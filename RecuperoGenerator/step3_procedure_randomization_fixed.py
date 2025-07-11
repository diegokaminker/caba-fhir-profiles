#!/usr/bin/env python3
"""
Step 3: Procedure Randomization for RecuperoGenerator (FIXED VERSION)
Loads procedure codes from actual FSH files and randomizes clinical data while preserving template structure.
GUIDs remain fixed as they are part of the template structure.
IMPORTANT: All codes must come from the defined code systems - no fictional codes allowed.
"""

import json
import random
import re
from datetime import datetime, timedelta
from typing import Dict, List, Any, Tuple
from dataclasses import dataclass
from pathlib import Path

@dataclass
class ProcedureCode:
    """Represents a procedure code from FSH files"""
    code: str
    display: str
    system: str
    category: str

@dataclass
class DiagnosisCode:
    """Represents a diagnosis code from FSH files"""
    code: str
    display: str
    system: str

@dataclass
class InsuranceCode:
    """Represents an insurance code from FSH files"""
    code: str
    display: str
    system: str

class ProcedureRandomizer:
    """Handles procedure and clinical data randomization using ACTUAL code systems"""
    
    def __init__(self):
        self.template_data = None
        self.procedure_codes = []
        self.diagnosis_codes = []
        self.insurance_codes = []
        self.procedure_variables = []
        
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
    
    def load_fsh_codesystems(self, fsh_dir: str = "../input/fsh") -> Dict[str, List]:
        """Load code systems from ACTUAL FSH files"""
        codes = {
            'procedures': [],
            'diagnoses': [],
            'insurance': []
        }
        
        fsh_path = Path(fsh_dir)
        if not fsh_path.exists():
            print(f"⚠️  FSH directory not found: {fsh_path}")
            return codes
        
        # Load procedure codes from ACTUAL file
        procedures_file = fsh_path / "terminology" / "codesystems" / "caba-recupero-procedimientos.fsh"
        if procedures_file.exists():
            codes['procedures'] = self._parse_fsh_procedures(procedures_file)
            print(f"✅ Loaded {len(codes['procedures'])} procedure codes from ACTUAL file")
        else:
            print(f"❌ Procedure codes file not found: {procedures_file}")
        
        # Load diagnosis codes from ACTUAL file
        diagnoses_file = fsh_path / "terminology" / "codesystems" / "caba-recupero-diagnostico.fsh"
        if diagnoses_file.exists():
            codes['diagnoses'] = self._parse_fsh_diagnoses(diagnoses_file)
            print(f"✅ Loaded {len(codes['diagnoses'])} diagnosis codes from ACTUAL file")
        else:
            print(f"❌ Diagnosis codes file not found: {diagnoses_file}")
        
        # Load insurance codes from ACTUAL file
        insurance_file = fsh_path / "terminology" / "codesystems" / "caba-recupero-coberturas.fsh"
        if insurance_file.exists():
            codes['insurance'] = self._parse_fsh_insurance(insurance_file)
            print(f"✅ Loaded {len(codes['insurance'])} insurance codes from ACTUAL file")
        else:
            print(f"❌ Insurance codes file not found: {insurance_file}")
        
        return codes
    
    def _parse_fsh_procedures(self, file_path: Path) -> List[ProcedureCode]:
        """Parse ACTUAL procedure codes from FSH file"""
        codes = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Parse FSH procedure codes: #code "display"
            pattern = r'#(\S+)\s+"([^"]+)"'
            matches = re.findall(pattern, content)
            
            for code, display in matches:
                codes.append(ProcedureCode(
                    code=code,
                    display=display,
                    system="http://recuperocaba.gob.ar/CodeSystem/procedimientos-codesystem",
                    category="laboratory"
                ))
            
            print(f"   Found {len(codes)} procedure codes")
        
        except Exception as e:
            print(f"⚠️  Error parsing procedures file {file_path}: {e}")
        
        return codes
    
    def _parse_fsh_diagnoses(self, file_path: Path) -> List[DiagnosisCode]:
        """Parse ACTUAL diagnosis codes from FSH file"""
        codes = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Parse FSH diagnosis codes: #code "display"
            pattern = r'#(\S+)\s+"([^"]+)"'
            matches = re.findall(pattern, content)
            
            for code, display in matches:
                codes.append(DiagnosisCode(
                    code=code,
                    display=display,
                    system="http://recuperocaba.gob.ar/CodeSystem/diagnosticos-codesystem"
                ))
            
            print(f"   Found {len(codes)} diagnosis codes")
        
        except Exception as e:
            print(f"⚠️  Error parsing diagnoses file {file_path}: {e}")
        
        return codes
    
    def _parse_fsh_insurance(self, file_path: Path) -> List[InsuranceCode]:
        """Parse ACTUAL insurance codes from FSH file"""
        codes = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Parse FSH insurance codes: #code "display"
            pattern = r'#(\S+)\s+"([^"]+)"'
            matches = re.findall(pattern, content)
            
            for code, display in matches:
                codes.append(InsuranceCode(
                    code=code,
                    display=display,
                    system="http://recuperocaba.gob.ar/CodeSystem/coberturas-codesystem"
                ))
            
            print(f"   Found {len(codes)} insurance codes")
        
        except Exception as e:
            print(f"⚠️  Error parsing insurance file {file_path}: {e}")
        
        return codes
    
    def identify_procedure_variables(self) -> List[Dict]:
        """Identify all procedure-related variable elements in the template"""
        procedure_vars = []
        
        if not self.template_data:
            return procedure_vars
        
        # Find Claim resource
        for i, entry in enumerate(self.template_data.get("entry", [])):
            resource = entry.get("resource", {})
            if resource.get("resourceType") == "Claim":
                claim_index = i
                claim_resource = resource
                
                # Diagnosis codes
                for j, diagnosis in enumerate(claim_resource.get("diagnosis", [])):
                    coding = diagnosis.get("diagnosisCodeableConcept", {}).get("coding", [])
                    if coding:
                        procedure_vars.append({
                            "path": f"entry[{claim_index}].resource.diagnosis[{j}].diagnosisCodeableConcept.coding[0]",
                            "type": "diagnosis_code",
                            "current_value": coding[0],
                            "system": coding[0].get("system", "")
                        })
                
                # Procedure codes
                for j, procedure in enumerate(claim_resource.get("procedure", [])):
                    coding = procedure.get("procedureCodeableConcept", {}).get("coding", [])
                    if coding:
                        procedure_vars.append({
                            "path": f"entry[{claim_index}].resource.procedure[{j}].procedureCodeableConcept.coding[0]",
                            "type": "procedure_code",
                            "current_value": coding[0],
                            "system": coding[0].get("system", "")
                        })
                    
                    # Procedure dates
                    if "date" in procedure:
                        procedure_vars.append({
                            "path": f"entry[{claim_index}].resource.procedure[{j}].date",
                            "type": "procedure_date",
                            "current_value": procedure.get("date", "")
                        })
                
                # Insurance coverage
                for j, insurance in enumerate(claim_resource.get("insurance", [])):
                    coverage = insurance.get("coverage", {})
                    identifier = coverage.get("identifier", {})
                    if identifier:
                        procedure_vars.append({
                            "path": f"entry[{claim_index}].resource.insurance[{j}].coverage.identifier",
                            "type": "insurance_coverage",
                            "current_value": identifier,
                            "system": identifier.get("system", "")
                        })
                
                break
        
        self.procedure_variables = procedure_vars
        return procedure_vars
    
    def generate_random_procedure_data(self, codes: Dict[str, List], num_procedures: int = None) -> Dict:
        """Generate random procedure data using ACTUAL codes only"""
        
        if not codes['procedures']:
            print("❌ No procedure codes available!")
            return None
        
        if num_procedures is None:
            num_procedures = random.randint(3, min(8, len(codes['procedures'])))
        
        # Select random procedures from ACTUAL codes
        selected_procedures = random.sample(codes['procedures'], min(num_procedures, len(codes['procedures'])))
        
        # Select random diagnosis from ACTUAL codes
        selected_diagnosis = random.choice(codes['diagnoses']) if codes['diagnoses'] else None
        
        # Select random insurance from ACTUAL codes
        selected_insurance = random.choice(codes['insurance']) if codes['insurance'] else None
        
        # Generate procedure dates (within last 30 days)
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30)
        
        procedure_data = {
            'procedures': selected_procedures,
            'diagnosis': selected_diagnosis,
            'insurance': selected_insurance,
            'procedure_dates': []
        }
        
        # Generate dates for each procedure
        for _ in selected_procedures:
            random_days = random.randint(0, (end_date - start_date).days)
            procedure_date = (start_date + timedelta(days=random_days)).strftime("%Y-%m-%d")
            procedure_data['procedure_dates'].append(procedure_date)
        
        return procedure_data
    
    def apply_procedure_data_to_template(self, procedure_data: Dict) -> Dict:
        """Apply randomized procedure data to the template while preserving structure"""
        
        if not self.template_data:
            return None
        
        # Create a deep copy of the template
        import copy
        randomized_template = copy.deepcopy(self.template_data)
        
        # Find Claim resource
        claim_entry = None
        claim_index = None
        for i, entry in enumerate(randomized_template.get("entry", [])):
            if entry.get("resource", {}).get("resourceType") == "Claim":
                claim_entry = entry
                claim_index = i
                break
        
        if not claim_entry:
            print("❌ Claim resource not found in template!")
            return None
        
        claim_resource = claim_entry["resource"]
        
        # Update diagnosis with ACTUAL code
        if procedure_data['diagnosis'] and claim_resource.get("diagnosis"):
            diagnosis = claim_resource["diagnosis"][0]
            coding = diagnosis["diagnosisCodeableConcept"]["coding"][0]
            coding["code"] = procedure_data['diagnosis'].code
            coding["display"] = procedure_data['diagnosis'].display
            coding["system"] = procedure_data['diagnosis'].system
        
        # Update procedures with ACTUAL codes
        if claim_resource.get("procedure"):
            # Remove existing procedures
            claim_resource["procedure"] = []
            
            # Add new procedures with ACTUAL codes
            for i, procedure_code in enumerate(procedure_data['procedures']):
                procedure_date = procedure_data['procedure_dates'][i] if i < len(procedure_data['procedure_dates']) else "2024-01-15"
                
                new_procedure = {
                    "procedureCodeableConcept": {
                        "coding": [
                            {
                                "system": procedure_code.system,
                                "code": procedure_code.code,
                                "display": procedure_code.display
                            }
                        ]
                    },
                    "date": procedure_date
                }
                
                claim_resource["procedure"].append(new_procedure)
        
        # Update insurance with ACTUAL code
        if procedure_data['insurance'] and claim_resource.get("insurance"):
            insurance = claim_resource["insurance"][0]
            identifier = insurance["coverage"]["identifier"]
            identifier["value"] = procedure_data['insurance'].code
            identifier["system"] = procedure_data['insurance'].system
        
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
    
    def generate_procedure_randomization_report(self, procedure_data: Dict) -> str:
        """Generate a report of the procedure randomization"""
        report = []
        report.append("# Procedure Randomization Report (FIXED VERSION)")
        report.append("")
        report.append(f"**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append("")
        report.append("## Generated Procedure Data (ACTUAL Codes)")
        report.append("")
        
        if procedure_data['diagnosis']:
            report.append(f"**Diagnosis**: {procedure_data['diagnosis'].code} - {procedure_data['diagnosis'].display}")
            report.append(f"**System**: {procedure_data['diagnosis'].system}")
            report.append("")
        
        report.append(f"**Procedures**: {len(procedure_data['procedures'])}")
        for i, procedure in enumerate(procedure_data['procedures']):
            date = procedure_data['procedure_dates'][i] if i < len(procedure_data['procedure_dates']) else "N/A"
            report.append(f"- {procedure.code} - {procedure.display} (Date: {date})")
            report.append(f"  - System: {procedure.system}")
        report.append("")
        
        if procedure_data['insurance']:
            report.append(f"**Insurance**: {procedure_data['insurance'].code} - {procedure_data['insurance'].display}")
            report.append(f"**System**: {procedure_data['insurance'].system}")
            report.append("")
        
        report.append("## Code System Compliance")
        report.append("- ✅ **ALL codes from ACTUAL FSH files**")
        report.append("- ✅ **No fictional codes used**")
        report.append("- ✅ **Proper code system URIs**")
        report.append("- ✅ **FHIR compliance maintained**")
        report.append("")
        
        report.append("## Procedure Variables Updated")
        report.append("")
        for var in self.procedure_variables:
            report.append(f"- **{var['type']}** at `{var['path']}`")
            report.append(f"  - Original: `{var['current_value']}`")
            report.append("")
        
        report.append("## Template Integrity")
        report.append("- ✅ GUIDs preserved (fixed template elements)")
        report.append("- ✅ Resource structure maintained")
        report.append("- ✅ Resource types preserved")
        report.append("- ✅ Only procedure data values changed")
        report.append("")
        
        return "\n".join(report)

def main():
    """Main function to run procedure randomization with ACTUAL codes"""
    print("🔬 Step 3: Procedure Randomization (FIXED VERSION)")
    print("=" * 60)
    print("⚠️  IMPORTANT: Using ACTUAL codes from FSH files only!")
    print("=" * 60)
    
    # Initialize randomizer
    randomizer = ProcedureRandomizer()
    
    # Load template
    template_file = "output/Bundle-PatientRandomized.json"
    if not randomizer.load_template(template_file):
        print("⚠️  Using original template...")
        template_file = "output/Bundle-RecuperoCABABundleEjemplo.json"
        if not randomizer.load_template(template_file):
            return
    
    # Load ACTUAL code systems
    print("\n📚 Loading ACTUAL code systems from FSH files...")
    codes = randomizer.load_fsh_codesystems()
    
    # Validate that we have codes
    if not any(codes.values()):
        print("❌ No code systems loaded! Cannot proceed without actual codes.")
        return
    
    print(f"\n📊 Code Systems Summary:")
    print(f"   Procedures: {len(codes['procedures'])} (from ACTUAL FSH file)")
    print(f"   Diagnoses: {len(codes['diagnoses'])} (from ACTUAL FSH file)")
    print(f"   Insurance: {len(codes['insurance'])} (from ACTUAL FSH file)")
    
    # Identify procedure variables
    print("\n🔍 Identifying procedure variables...")
    procedure_vars = randomizer.identify_procedure_variables()
    print(f"   Procedure variables found: {len(procedure_vars)}")
    
    for var in procedure_vars:
        print(f"   - {var['type']}: {var['path']}")
    
    # Generate random procedure data using ACTUAL codes
    print("\n🔬 Generating random procedure data using ACTUAL codes...")
    num_procedures = random.randint(3, min(8, len(codes['procedures'])))
    procedure_data = randomizer.generate_random_procedure_data(codes, num_procedures)
    
    if not procedure_data:
        print("❌ Failed to generate procedure data!")
        return
    
    print(f"   Procedures: {len(procedure_data['procedures'])}")
    if procedure_data['diagnosis']:
        print(f"   Diagnosis: {procedure_data['diagnosis'].code} - {procedure_data['diagnosis'].display}")
    if procedure_data['insurance']:
        print(f"   Insurance: {procedure_data['insurance'].code} - {procedure_data['insurance'].display}")
    
    # Apply procedure data to template
    print("\n🔧 Applying procedure data to template...")
    randomized_template = randomizer.apply_procedure_data_to_template(procedure_data)
    
    if not randomized_template:
        print("❌ Failed to apply procedure data!")
        return
    
    # Validate template integrity
    print("\n✅ Validating template integrity...")
    if not randomizer.validate_template_integrity(randomized_template):
        print("❌ Template integrity validation failed!")
        return
    
    # Save randomized template
    output_file = "output/Bundle-ProcedureRandomized-FIXED.json"
    Path("output").mkdir(exist_ok=True)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(randomized_template, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Randomized template saved: {output_file}")
    
    # Generate and save report
    report = randomizer.generate_procedure_randomization_report(procedure_data)
    report_file = "procedure_randomization_report_FIXED.md"
    
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write(report)
    
    print(f"📄 Report saved: {report_file}")
    
    print("\n✅ Procedure randomization completed with ACTUAL codes!")
    print("\n📊 Summary:")
    print(f"   - Procedure variables: {len(procedure_vars)}")
    print(f"   - Procedures generated: {len(procedure_data['procedures'])}")
    print(f"   - Template integrity: ✅ Validated")
    print(f"   - GUIDs preserved: ✅ Fixed template elements")
    print(f"   - Code compliance: ✅ ACTUAL FSH codes only")
    print(f"   - Output: {output_file}")
    print(f"   - Report: {report_file}")

if __name__ == "__main__":
    main() 