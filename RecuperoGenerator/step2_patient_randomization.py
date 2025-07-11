#!/usr/bin/env python3
"""
Step 2: Patient Randomization for RecuperoGenerator
Generates random patient data while preserving the exact template structure.
GUIDs remain fixed as they are part of the template structure.
"""

import json
import random
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Any, Tuple
from dataclasses import dataclass
from pathlib import Path
import faker

@dataclass
class PatientData:
    """Represents randomized patient data"""
    identifier: str
    family_name: str
    given_names: List[str]
    birth_date: str
    gender: str = "unknown"

class PatientRandomizer:
    """Handles patient data randomization while preserving template structure"""
    
    def __init__(self):
        self.fake = faker.Faker(['es_ES'])  # Spanish locale for realistic names
        self.template_data = None
        self.patient_variables = []
        
    def load_template(self, template_file: str) -> bool:
        """Load the template JSON file"""
        try:
            with open(template_file, 'r', encoding='utf-8') as f:
                self.template_data = json.load(f)
            print(f"✅ Template loaded: {template_file}")
            return True
        except Exception as e:
            print(f"❌ Error loading template: {e}")
            return False
    
    def identify_patient_variables(self) -> List[Dict]:
        """Identify all patient-related variable elements in the template"""
        patient_vars = []
        
        if not self.template_data:
            return patient_vars
        
        # Find Patient resource
        for i, entry in enumerate(self.template_data.get("entry", [])):
            resource = entry.get("resource", {})
            if resource.get("resourceType") == "Patient":
                patient_index = i
                patient_resource = resource
                
                # Patient identifiers
                for j, identifier in enumerate(patient_resource.get("identifier", [])):
                    patient_vars.append({
                        "path": f"entry[{patient_index}].resource.identifier[{j}].value",
                        "type": "patient_identifier",
                        "system": identifier.get("system", ""),
                        "current_value": identifier.get("value", "")
                    })
                
                # Patient names
                for j, name in enumerate(patient_resource.get("name", [])):
                    if "family" in name:
                        patient_vars.append({
                            "path": f"entry[{patient_index}].resource.name[{j}].family",
                            "type": "patient_family_name",
                            "current_value": name.get("family", "")
                        })
                    
                    if "given" in name:
                        patient_vars.append({
                            "path": f"entry[{patient_index}].resource.name[{j}].given",
                            "type": "patient_given_names",
                            "current_value": name.get("given", [])
                        })
                
                # Patient birth date
                if "birthDate" in patient_resource:
                    patient_vars.append({
                        "path": f"entry[{patient_index}].resource.birthDate",
                        "type": "patient_birth_date",
                        "current_value": patient_resource.get("birthDate", "")
                    })
                
                break
        
        self.patient_variables = patient_vars
        return patient_vars
    
    def generate_random_patient_data(self) -> PatientData:
        """Generate random patient data"""
        
        # Generate random patient identifier (hospital ID)
        hospital_id = f"HOSP-{random.randint(10000, 99999)}"
        
        # Generate random Spanish names
        family_name = self.fake.last_name()
        given_names = [self.fake.first_name(), self.fake.first_name()]
        
        # Generate random birth date (adult, 18-80 years old)
        end_date = datetime.now() - timedelta(days=18*365)
        start_date = datetime.now() - timedelta(days=80*365)
        random_days = random.randint(0, (end_date - start_date).days)
        birth_date = (start_date + timedelta(days=random_days)).strftime("%Y-%m-%d")
        
        return PatientData(
            identifier=hospital_id,
            family_name=family_name,
            given_names=given_names,
            birth_date=birth_date
        )
    
    def apply_patient_data_to_template(self, patient_data: PatientData) -> Dict:
        """Apply randomized patient data to the template while preserving structure"""
        
        if not self.template_data:
            return None
        
        # Create a deep copy of the template
        import copy
        randomized_template = copy.deepcopy(self.template_data)
        
        # Apply patient data to the identified variables
        for var in self.patient_variables:
            if var["type"] == "patient_identifier":
                # Update patient identifier
                path_parts = var["path"].split(".")
                current = randomized_template
                for part in path_parts[:-1]:
                    if "[" in part:
                        # Handle array access
                        array_name = part.split("[")[0]
                        array_index = int(part.split("[")[1].split("]")[0])
                        current = current[array_name][array_index]
                    else:
                        current = current[part]
                
                # Update the value
                current["value"] = patient_data.identifier
                
            elif var["type"] == "patient_family_name":
                # Update family name
                path_parts = var["path"].split(".")
                current = randomized_template
                for part in path_parts[:-1]:
                    if "[" in part:
                        array_name = part.split("[")[0]
                        array_index = int(part.split("[")[1].split("]")[0])
                        current = current[array_name][array_index]
                    else:
                        current = current[part]
                
                current["family"] = patient_data.family_name
                
            elif var["type"] == "patient_given_names":
                # Update given names
                path_parts = var["path"].split(".")
                current = randomized_template
                for part in path_parts[:-1]:
                    if "[" in part:
                        array_name = part.split("[")[0]
                        array_index = int(part.split("[")[1].split("]")[0])
                        current = current[array_name][array_index]
                    else:
                        current = current[part]
                
                current["given"] = patient_data.given_names
                
            elif var["type"] == "patient_birth_date":
                # Update birth date
                path_parts = var["path"].split(".")
                current = randomized_template
                for part in path_parts[:-1]:
                    if "[" in part:
                        array_name = part.split("[")[0]
                        array_index = int(part.split("[")[1].split("]")[0])
                        current = current[array_name][array_index]
                    else:
                        current = current[part]
                
                current["birthDate"] = patient_data.birth_date
        
        return randomized_template
    
    def validate_template_integrity(self, template: Dict) -> bool:
        """Validate that the template structure remains intact"""
        if not template:
            return False
        
        # Check that all GUIDs are preserved
        original_guids = set()
        new_guids = set()
        
        for entry in self.template_data.get("entry", []):
            if "fullUrl" in entry:
                original_guids.add(entry["fullUrl"])
        
        for entry in template.get("entry", []):
            if "fullUrl" in entry:
                new_guids.add(entry["fullUrl"])
        
        if original_guids != new_guids:
            print("❌ GUID integrity check failed!")
            return False
        
        # Check that resource structure is preserved
        if len(self.template_data.get("entry", [])) != len(template.get("entry", [])):
            print("❌ Resource count mismatch!")
            return False
        
        # Check that resource types are preserved
        for i, entry in enumerate(template.get("entry", [])):
            original_type = self.template_data["entry"][i]["resource"]["resourceType"]
            new_type = entry["resource"]["resourceType"]
            if original_type != new_type:
                print(f"❌ Resource type mismatch at index {i}: {original_type} != {new_type}")
                return False
        
        print("✅ Template integrity validated")
        return True
    
    def generate_patient_randomization_report(self, patient_data: PatientData) -> str:
        """Generate a report of the patient randomization"""
        report = []
        report.append("# Patient Randomization Report")
        report.append("")
        report.append(f"**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append("")
        
        report.append("## Generated Patient Data")
        report.append("")
        report.append(f"- **Identifier**: `{patient_data.identifier}`")
        report.append(f"- **Family Name**: `{patient_data.family_name}`")
        report.append(f"- **Given Names**: `{', '.join(patient_data.given_names)}`")
        report.append(f"- **Birth Date**: `{patient_data.birth_date}`")
        report.append(f"- **Gender**: `{patient_data.gender}`")
        report.append("")
        
        report.append("## Patient Variables Updated")
        report.append("")
        for var in self.patient_variables:
            report.append(f"- **{var['type']}** at `{var['path']}`")
            report.append(f"  - Original: `{var['current_value']}`")
            report.append("")
        
        report.append("## Template Integrity")
        report.append("- ✅ GUIDs preserved (fixed template elements)")
        report.append("- ✅ Resource structure maintained")
        report.append("- ✅ Resource types preserved")
        report.append("- ✅ Only patient data values changed")
        report.append("")
        
        return "\n".join(report)

def main():
    """Main function to run patient randomization"""
    print("🎯 Step 2: Patient Randomization")
    print("=" * 50)
    
    # Initialize randomizer
    randomizer = PatientRandomizer()
    
    # Load template
    template_file = "output/Bundle-RecuperoCABABundleEjemplo.json"
    if not randomizer.load_template(template_file):
        return
    
    # Identify patient variables
    print("\n🔍 Identifying patient variables...")
    patient_vars = randomizer.identify_patient_variables()
    print(f"   Patient variables found: {len(patient_vars)}")
    
    for var in patient_vars:
        print(f"   - {var['type']}: {var['path']}")
    
    # Generate random patient data
    print("\n👤 Generating random patient data...")
    patient_data = randomizer.generate_random_patient_data()
    print(f"   Patient: {patient_data.given_names[0]} {patient_data.family_name}")
    print(f"   ID: {patient_data.identifier}")
    print(f"   Birth: {patient_data.birth_date}")
    
    # Apply patient data to template
    print("\n🔧 Applying patient data to template...")
    randomized_template = randomizer.apply_patient_data_to_template(patient_data)
    
    if not randomized_template:
        print("❌ Failed to apply patient data!")
        return
    
    # Validate template integrity
    print("\n✅ Validating template integrity...")
    if not randomizer.validate_template_integrity(randomized_template):
        print("❌ Template integrity validation failed!")
        return
    
    # Save randomized template
    output_file = "output/Bundle-PatientRandomized.json"
    Path("output").mkdir(exist_ok=True)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(randomized_template, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Randomized template saved: {output_file}")
    
    # Generate and save report
    report = randomizer.generate_patient_randomization_report(patient_data)
    report_file = "patient_randomization_report.md"
    
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write(report)
    
    print(f"📄 Report saved: {report_file}")
    
    print("\n✅ Patient randomization completed!")
    print("\n📊 Summary:")
    print(f"   - Patient variables: {len(patient_vars)}")
    print(f"   - Template integrity: ✅ Validated")
    print(f"   - GUIDs preserved: ✅ Fixed template elements")
    print(f"   - Output: {output_file}")
    print(f"   - Report: {report_file}")

if __name__ == "__main__":
    main() 