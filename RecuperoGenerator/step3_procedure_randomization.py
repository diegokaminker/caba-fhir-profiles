#!/usr/bin/env python3
"""
Step 3: Procedure Randomization for RecuperoGenerator
Loads procedure codes from FSH files and randomizes clinical data while preserving template structure.
GUIDs remain fixed as they are part of the template structure.
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

class ProcedureRandomizer:
    """Handles procedure and clinical data randomization"""
    
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
        """Load code systems from FSH files"""
        codes = {
            'procedures': [],
            'diagnoses': [],
            'insurance': []
        }
        
        fsh_path = Path(fsh_dir)
        if not fsh_path.exists():
            print(f"⚠️  FSH directory not found: {fsh_path}")
            return codes
        
        # Load procedure codes
        procedures_file = fsh_path / "logical_models" / "recupero_laboratorio.fsh"
        if procedures_file.exists():
            codes['procedures'] = self._parse_fsh_codesystem(procedures_file, "procedures")
            print(f"✅ Loaded {len(codes['procedures'])} procedure codes")
        
        # Load diagnosis codes
        diagnoses_file = fsh_path / "terminology" / "caba-recupero-codesystems.fsh"
        if diagnoses_file.exists():
            codes['diagnoses'] = self._parse_fsh_codesystem(diagnoses_file, "diagnoses")
            print(f"✅ Loaded {len(codes['diagnoses'])} diagnosis codes")
        
        # Load insurance codes
        insurance_file = fsh_path / "terminology" / "caba-recupero-codesystems.fsh"
        if insurance_file.exists():
            codes['insurance'] = self._parse_fsh_codesystem(insurance_file, "insurance")
            print(f"✅ Loaded {len(codes['insurance'])} insurance codes")
        
        return codes
    
    def _parse_fsh_codesystem(self, file_path: Path, code_type: str) -> List:
        """Parse FSH code system files"""
        codes = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Parse FSH code system format
            if code_type == "procedures":
                # Look for procedure codes in the format: * code = #"code" "display"
                pattern = r'\* code = #"([^"]+)"\s+"([^"]+)"'
                matches = re.findall(pattern, content)
                
                for code, display in matches:
                    codes.append(ProcedureCode(
                        code=code,
                        display=display,
                        system="http://recuperocaba.gob.ar/CodeSystem/codificacion-laboratorio",
                        category="laboratory"
                    ))
            
            elif code_type == "diagnoses":
                # Look for diagnosis codes
                pattern = r'\* code = #"([^"]+)"\s+"([^"]+)"'
                matches = re.findall(pattern, content)
                
                for code, display in matches:
                    codes.append(DiagnosisCode(
                        code=code,
                        display=display,
                        system="http://recuperocaba.gob.ar/CodeSystem/recupero-diagnosticos"
                    ))
            
            elif code_type == "insurance":
                # Look for insurance codes
                pattern = r'\* code = #"([^"]+)"\s+"([^"]+)"'
                matches = re.findall(pattern, content)
                
                for code, display in matches:
                    codes.append({
                        'code': code,
                        'display': display,
                        'system': "http://recuperocaba.gob.ar/CodeSystem/coberturas-codesystem"
                    })
        
        except Exception as e:
            print(f"⚠️  Error parsing {file_path}: {e}")
        
        return codes
    
    def create_sample_codes(self) -> Dict[str, List]:
        """Create sample codes if FSH files are not available"""
        print("📝 Creating sample codes for testing...")
        
        codes = {
            'procedures': [
                ProcedureCode("GLU", "Glucosa en sangre", "http://recuperocaba.gob.ar/CodeSystem/codificacion-laboratorio", "laboratory"),
                ProcedureCode("CRE", "Creatinina", "http://recuperocaba.gob.ar/CodeSystem/codificacion-laboratorio", "laboratory"),
                ProcedureCode("URE", "Urea", "http://recuperocaba.gob.ar/CodeSystem/codificacion-laboratorio", "laboratory"),
                ProcedureCode("HEM", "Hemograma completo", "http://recuperocaba.gob.ar/CodeSystem/codificacion-laboratorio", "laboratory"),
                ProcedureCode("COL", "Colesterol total", "http://recuperocaba.gob.ar/CodeSystem/codificacion-laboratorio", "laboratory"),
                ProcedureCode("TRI", "Triglicéridos", "http://recuperocaba.gob.ar/CodeSystem/codificacion-laboratorio", "laboratory"),
                ProcedureCode("TGO", "Transaminasa GOT", "http://recuperocaba.gob.ar/CodeSystem/codificacion-laboratorio", "laboratory"),
                ProcedureCode("TGP", "Transaminasa GPT", "http://recuperocaba.gob.ar/CodeSystem/codificacion-laboratorio", "laboratory"),
                ProcedureCode("ALB", "Albúmina", "http://recuperocaba.gob.ar/CodeSystem/codificacion-laboratorio", "laboratory"),
                ProcedureCode("BIL", "Bilirrubina total", "http://recuperocaba.gob.ar/CodeSystem/codificacion-laboratorio", "laboratory")
            ],
            'diagnoses': [
                DiagnosisCode("DIAB", "Diabetes mellitus", "http://recuperocaba.gob.ar/CodeSystem/recupero-diagnosticos"),
                DiagnosisCode("HIPA", "Hipertensión arterial", "http://recuperocaba.gob.ar/CodeSystem/recupero-diagnosticos"),
                DiagnosisCode("DISL", "Dislipidemia", "http://recuperocaba.gob.ar/CodeSystem/recupero-diagnosticos"),
                DiagnosisCode("OBES", "Obesidad", "http://recuperocaba.gob.ar/CodeSystem/recupero-diagnosticos"),
                DiagnosisCode("ANEM", "Anemia", "http://recuperocaba.gob.ar/CodeSystem/recupero-diagnosticos"),
                DiagnosisCode("HEPA", "Hepatopatía", "http://recuperocaba.gob.ar/CodeSystem/recupero-diagnosticos"),
                DiagnosisCode("RENA", "Enfermedad renal", "http://recuperocaba.gob.ar/CodeSystem/recupero-diagnosticos"),
                DiagnosisCode("TIRO", "Enfermedad tiroidea", "http://recuperocaba.gob.ar/CodeSystem/recupero-diagnosticos")
            ],
            'insurance': [
                {'code': 'OSDE', 'display': 'OSDE', 'system': "http://recuperocaba.gob.ar/CodeSystem/coberturas-codesystem"},
                {'code': 'GALENO', 'display': 'GALENO', 'system': "http://recuperocaba.gob.ar/CodeSystem/coberturas-codesystem"},
                {'code': 'SWISS', 'display': 'SWISS MEDICAL', 'system': "http://recuperocaba.gob.ar/CodeSystem/coberturas-codesystem"},
                {'code': 'MEDICUS', 'display': 'MEDICUS', 'system': "http://recuperocaba.gob.ar/CodeSystem/coberturas-codesystem"},
                {'code': 'OMINT', 'display': 'OMINT', 'system': "http://recuperocaba.gob.ar/CodeSystem/coberturas-codesystem"}
            ]
        }
        
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
        """Generate random procedure data"""
        
        if num_procedures is None:
            num_procedures = random.randint(3, 8)  # 3-8 procedures per bundle
        
        # Select random procedures
        selected_procedures = random.sample(codes['procedures'], min(num_procedures, len(codes['procedures'])))
        
        # Select random diagnosis
        selected_diagnosis = random.choice(codes['diagnoses']) if codes['diagnoses'] else None
        
        # Select random insurance
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
        
        # Update diagnosis
        if procedure_data['diagnosis'] and claim_resource.get("diagnosis"):
            diagnosis = claim_resource["diagnosis"][0]
            coding = diagnosis["diagnosisCodeableConcept"]["coding"][0]
            coding["code"] = procedure_data['diagnosis'].code
            coding["display"] = procedure_data['diagnosis'].display
        
        # Update procedures
        if claim_resource.get("procedure"):
            # Remove existing procedures
            claim_resource["procedure"] = []
            
            # Add new procedures
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
        
        # Update insurance
        if procedure_data['insurance'] and claim_resource.get("insurance"):
            insurance = claim_resource["insurance"][0]
            identifier = insurance["coverage"]["identifier"]
            identifier["value"] = procedure_data['insurance']['code']
        
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
        report.append("# Procedure Randomization Report")
        report.append("")
        report.append(f"**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append("")
        
        report.append("## Generated Procedure Data")
        report.append("")
        
        if procedure_data['diagnosis']:
            report.append(f"**Diagnosis**: {procedure_data['diagnosis'].code} - {procedure_data['diagnosis'].display}")
            report.append("")
        
        report.append(f"**Procedures**: {len(procedure_data['procedures'])}")
        for i, procedure in enumerate(procedure_data['procedures']):
            date = procedure_data['procedure_dates'][i] if i < len(procedure_data['procedure_dates']) else "N/A"
            report.append(f"- {procedure.code} - {procedure.display} (Date: {date})")
        report.append("")
        
        if procedure_data['insurance']:
            report.append(f"**Insurance**: {procedure_data['insurance']['code']} - {procedure_data['insurance']['display']}")
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
    """Main function to run procedure randomization"""
    print("🔬 Step 3: Procedure Randomization")
    print("=" * 50)
    
    # Initialize randomizer
    randomizer = ProcedureRandomizer()
    
    # Load template
    template_file = "output/Bundle-PatientRandomized.json"
    if not randomizer.load_template(template_file):
        print("⚠️  Using original template...")
        template_file = "output/Bundle-RecuperoCABABundleEjemplo.json"
        if not randomizer.load_template(template_file):
            return
    
    # Load code systems
    print("\n📚 Loading code systems...")
    codes = randomizer.load_fsh_codesystems()
    
    # If no codes loaded, create sample codes
    if not any(codes.values()):
        codes = randomizer.create_sample_codes()
    
    print(f"   Procedures: {len(codes['procedures'])}")
    print(f"   Diagnoses: {len(codes['diagnoses'])}")
    print(f"   Insurance: {len(codes['insurance'])}")
    
    # Identify procedure variables
    print("\n🔍 Identifying procedure variables...")
    procedure_vars = randomizer.identify_procedure_variables()
    print(f"   Procedure variables found: {len(procedure_vars)}")
    
    for var in procedure_vars:
        print(f"   - {var['type']}: {var['path']}")
    
    # Generate random procedure data
    print("\n🔬 Generating random procedure data...")
    num_procedures = random.randint(3, 8)
    procedure_data = randomizer.generate_random_procedure_data(codes, num_procedures)
    
    print(f"   Procedures: {len(procedure_data['procedures'])}")
    if procedure_data['diagnosis']:
        print(f"   Diagnosis: {procedure_data['diagnosis'].code} - {procedure_data['diagnosis'].display}")
    if procedure_data['insurance']:
        print(f"   Insurance: {procedure_data['insurance']['code']}")
    
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
    output_file = "output/Bundle-ProcedureRandomized.json"
    Path("output").mkdir(exist_ok=True)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(randomized_template, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Randomized template saved: {output_file}")
    
    # Generate and save report
    report = randomizer.generate_procedure_randomization_report(procedure_data)
    report_file = "procedure_randomization_report.md"
    
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write(report)
    
    print(f"📄 Report saved: {report_file}")
    
    print("\n✅ Procedure randomization completed!")
    print("\n📊 Summary:")
    print(f"   - Procedure variables: {len(procedure_vars)}")
    print(f"   - Procedures generated: {len(procedure_data['procedures'])}")
    print(f"   - Template integrity: ✅ Validated")
    print(f"   - GUIDs preserved: ✅ Fixed template elements")
    print(f"   - Output: {output_file}")
    print(f"   - Report: {report_file}")

if __name__ == "__main__":
    main() 