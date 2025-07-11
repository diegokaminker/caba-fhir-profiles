#!/usr/bin/env python3
"""
Step 1: Template Analysis for RecuperoGenerator
Analyzes the Bundle-RecuperoCABABundleEjemplo.json template to identify
variable elements that can be randomized while preserving the exact structure.
"""

import json
import uuid
from typing import Dict, List, Any, Set
from dataclasses import dataclass
from pathlib import Path

@dataclass
class VariableElement:
    """Represents a variable element in the template that can be randomized"""
    path: str  # JSON path to the element
    current_value: Any  # Current value in template
    variable_type: str  # Type of variable (patient_name, procedure_code, date, etc.)
    constraints: Dict[str, Any] = None  # Any constraints for this variable
    code_system: str = None  # If it's a coded element, which code system

@dataclass
class ResourceMapping:
    """Maps resource types to their GUIDs and relationships"""
    resource_type: str
    guid: str
    id: str
    references_to: List[str] = None  # List of GUIDs this resource references
    referenced_by: List[str] = None  # List of GUIDs that reference this resource

class BundleTemplateAnalyzer:
    """Analyzes the FHIR Bundle template to identify variable elements"""
    
    def __init__(self, template_file: str):
        self.template_file = template_file
        self.template_data = None
        self.variable_elements = []
        self.resource_mappings = []
        self.guid_mapping = {}
        
    def load_template(self) -> Dict[str, Any]:
        """Load the template JSON file"""
        try:
            with open(self.template_file, 'r', encoding='utf-8') as f:
                self.template_data = json.load(f)
            print(f"✅ Template loaded: {self.template_file}")
            return self.template_data
        except Exception as e:
            print(f"❌ Error loading template: {e}")
            return None
    
    def analyze_bundle_structure(self) -> Dict[str, Any]:
        """Analyze the overall bundle structure"""
        if not self.template_data:
            return {}
        
        bundle_info = {
            "resourceType": self.template_data.get("resourceType"),
            "type": self.template_data.get("type"),
            "total_resources": len(self.template_data.get("entry", [])),
            "resources": []
        }
        
        # Analyze each resource in the bundle
        for entry in self.template_data.get("entry", []):
            resource = entry.get("resource", {})
            resource_info = {
                "resourceType": resource.get("resourceType"),
                "id": resource.get("id"),
                "guid": entry.get("fullUrl"),
                "profile": resource.get("meta", {}).get("profile", [])
            }
            bundle_info["resources"].append(resource_info)
        
        return bundle_info
    
    def extract_guids_and_references(self) -> Dict[str, str]:
        """Extract all GUIDs and their relationships - GUIDs are FIXED template elements"""
        guid_mapping = {}
        references = {}
        
        for entry in self.template_data.get("entry", []):
            guid = entry.get("fullUrl")
            resource = entry.get("resource", {})
            resource_id = resource.get("id")
            
            if guid:
                guid_mapping[resource_id] = guid
                
                # Find all references in this resource
                resource_refs = self._find_references_in_resource(resource)
                references[guid] = resource_refs
        
        self.guid_mapping = guid_mapping
        return guid_mapping, references
    
    def _find_references_in_resource(self, resource: Dict[str, Any]) -> List[str]:
        """Recursively find all reference fields in a resource"""
        references = []
        
        def find_refs(obj, path=""):
            if isinstance(obj, dict):
                for key, value in obj.items():
                    current_path = f"{path}.{key}" if path else key
                    if key == "reference" and isinstance(value, str):
                        references.append(value)
                    elif isinstance(value, (dict, list)):
                        find_refs(value, current_path)
            elif isinstance(obj, list):
                for i, item in enumerate(obj):
                    current_path = f"{path}[{i}]"
                    find_refs(item, current_path)
        
        find_refs(resource)
        return references
    
    def identify_variable_elements(self) -> List[VariableElement]:
        """Identify all elements that can be randomized"""
        variables = []
        
        # Bundle level variables
        variables.extend(self._analyze_bundle_variables())
        
        # Resource level variables
        for entry in self.template_data.get("entry", []):
            resource = entry.get("resource", {})
            resource_type = resource.get("resourceType")
            
            if resource_type == "Claim":
                variables.extend(self._analyze_claim_variables(resource))
            elif resource_type == "Patient":
                variables.extend(self._analyze_patient_variables(resource))
            elif resource_type == "ServiceRequest":
                variables.extend(self._analyze_servicerequest_variables(resource))
            elif resource_type == "Encounter":
                variables.extend(self._analyze_encounter_variables(resource))
            elif resource_type == "Practitioner":
                variables.extend(self._analyze_practitioner_variables(resource))
            elif resource_type == "DocumentReference":
                variables.extend(self._analyze_documentreference_variables(resource))
        
        self.variable_elements = variables
        return variables
    
    def _analyze_bundle_variables(self) -> List[VariableElement]:
        """Analyze bundle-level variables"""
        variables = []
        
        # Bundle identifier
        identifier = self.template_data.get("identifier", {})
        variables.append(VariableElement(
            path="identifier.value",
            current_value=identifier.get("value"),
            variable_type="bundle_identifier",
            constraints={"pattern": "numeric", "length": 10}
        ))
        
        # Bundle timestamp
        variables.append(VariableElement(
            path="timestamp",
            current_value=self.template_data.get("timestamp"),
            variable_type="bundle_timestamp",
            constraints={"format": "ISO8601", "range": "recent"}
        ))
        
        return variables
    
    def _analyze_claim_variables(self, claim: Dict[str, Any]) -> List[VariableElement]:
        """Analyze Claim resource variables"""
        variables = []
        
        # Claim created date
        variables.append(VariableElement(
            path="entry[0].resource.created",
            current_value=claim.get("created"),
            variable_type="claim_created_date",
            constraints={"format": "ISO8601", "range": "recent"}
        ))
        
        # Diagnosis codes
        for i, diagnosis in enumerate(claim.get("diagnosis", [])):
            coding = diagnosis.get("diagnosisCodeableConcept", {}).get("coding", [])
            if coding:
                variables.append(VariableElement(
                    path=f"entry[0].resource.diagnosis[{i}].diagnosisCodeableConcept.coding[0]",
                    current_value=coding[0],
                    variable_type="diagnosis_code",
                    code_system="http://recuperocaba.gob.ar/CodeSystem/recupero-diagnosticos"
                ))
        
        # Procedure codes
        for i, procedure in enumerate(claim.get("procedure", [])):
            coding = procedure.get("procedureCodeableConcept", {}).get("coding", [])
            if coding:
                variables.append(VariableElement(
                    path=f"entry[0].resource.procedure[{i}].procedureCodeableConcept.coding[0]",
                    current_value=coding[0],
                    variable_type="procedure_code",
                    code_system="http://recuperocaba.gob.ar/CodeSystem/codificacion-laboratorio"
                ))
            
            # Procedure date
            variables.append(VariableElement(
                path=f"entry[0].resource.procedure[{i}].date",
                current_value=procedure.get("date"),
                variable_type="procedure_date",
                constraints={"format": "YYYY-MM-DD", "range": "recent"}
            ))
        
        # Insurance coverage
        for i, insurance in enumerate(claim.get("insurance", [])):
            coverage = insurance.get("coverage", {})
            identifier = coverage.get("identifier", {})
            variables.append(VariableElement(
                path=f"entry[0].resource.insurance[{i}].coverage.identifier",
                current_value=identifier,
                variable_type="insurance_coverage",
                code_system="http://recuperocaba.gob.ar/CodeSystem/coberturas-codesystem"
            ))
        
        return variables
    
    def _analyze_patient_variables(self, patient: Dict[str, Any]) -> List[VariableElement]:
        """Analyze Patient resource variables"""
        variables = []
        
        # Patient identifiers
        for i, identifier in enumerate(patient.get("identifier", [])):
            variables.append(VariableElement(
                path=f"entry[1].resource.identifier[{i}].value",
                current_value=identifier.get("value"),
                variable_type="patient_identifier",
                constraints={"system": identifier.get("system")}
            ))
        
        # Patient names
        for i, name in enumerate(patient.get("name", [])):
            variables.append(VariableElement(
                path=f"entry[1].resource.name[{i}].family",
                current_value=name.get("family"),
                variable_type="patient_family_name"
            ))
            
            variables.append(VariableElement(
                path=f"entry[1].resource.name[{i}].given",
                current_value=name.get("given"),
                variable_type="patient_given_names"
            ))
        
        # Patient birth date
        variables.append(VariableElement(
            path="entry[1].resource.birthDate",
            current_value=patient.get("birthDate"),
            variable_type="patient_birth_date",
            constraints={"format": "YYYY-MM-DD", "range": "adult"}
        ))
        
        return variables
    
    def _analyze_servicerequest_variables(self, servicerequest: Dict[str, Any]) -> List[VariableElement]:
        """Analyze ServiceRequest resource variables"""
        variables = []
        
        # ServiceRequest identifier
        for i, identifier in enumerate(servicerequest.get("identifier", [])):
            variables.append(VariableElement(
                path=f"entry[2].resource.identifier[{i}].value",
                current_value=identifier.get("value"),
                variable_type="servicerequest_identifier"
            ))
        
        # Dates
        variables.append(VariableElement(
            path="entry[2].resource.occurrenceDateTime",
            current_value=servicerequest.get("occurrenceDateTime"),
            variable_type="servicerequest_occurrence_date",
            constraints={"format": "ISO8601", "range": "recent"}
        ))
        
        variables.append(VariableElement(
            path="entry[2].resource.authoredOn",
            current_value=servicerequest.get("authoredOn"),
            variable_type="servicerequest_authored_date",
            constraints={"format": "ISO8601", "range": "recent"}
        ))
        
        return variables
    
    def _analyze_encounter_variables(self, encounter: Dict[str, Any]) -> List[VariableElement]:
        """Analyze Encounter resource variables"""
        variables = []
        
        # Encounter identifier
        for i, identifier in enumerate(encounter.get("identifier", [])):
            variables.append(VariableElement(
                path=f"entry[3].resource.identifier[{i}].value",
                current_value=identifier.get("value"),
                variable_type="encounter_identifier"
            ))
        
        return variables
    
    def _analyze_practitioner_variables(self, practitioner: Dict[str, Any]) -> List[VariableElement]:
        """Analyze Practitioner resource variables"""
        variables = []
        
        # Practitioner identifier
        for i, identifier in enumerate(practitioner.get("identifier", [])):
            variables.append(VariableElement(
                path=f"entry[4].resource.identifier[{i}].value",
                current_value=identifier.get("value"),
                variable_type="practitioner_identifier",
                code_system="http://recuperocaba.gob.ar/CodeSystem/recupero-tipos-matricula"
            ))
        
        # Practitioner name
        for i, name in enumerate(practitioner.get("name", [])):
            variables.append(VariableElement(
                path=f"entry[4].resource.name[{i}].text",
                current_value=name.get("text"),
                variable_type="practitioner_name"
            ))
        
        # Practitioner qualification
        for i, qualification in enumerate(practitioner.get("qualification", [])):
            coding = qualification.get("code", {}).get("coding", [])
            if coding:
                variables.append(VariableElement(
                    path=f"entry[4].resource.qualification[{i}].code.coding[0]",
                    current_value=coding[0],
                    variable_type="practitioner_qualification",
                    code_system="http://recuperocaba.gob.ar/CodeSystem/recupero-profesiones"
                ))
        
        return variables
    
    def _analyze_documentreference_variables(self, docref: Dict[str, Any]) -> List[VariableElement]:
        """Analyze DocumentReference resource variables"""
        variables = []
        
        # Document date
        variables.append(VariableElement(
            path="entry[5].resource.date",
            current_value=docref.get("date"),
            variable_type="document_date",
            constraints={"format": "ISO8601", "range": "recent"}
        ))
        
        return variables
    
    def generate_analysis_report(self) -> str:
        """Generate a comprehensive analysis report"""
        report = []
        report.append("# Bundle Template Analysis Report")
        report.append("")
        
        # Bundle structure
        bundle_info = self.analyze_bundle_structure()
        report.append("## Bundle Structure")
        report.append(f"- **Resource Type**: {bundle_info['resourceType']}")
        report.append(f"- **Bundle Type**: {bundle_info['type']}")
        report.append(f"- **Total Resources**: {bundle_info['total_resources']}")
        report.append("")
        
        # Resources
        report.append("## Resources")
        for resource in bundle_info['resources']:
            report.append(f"- **{resource['resourceType']}**: {resource['id']} ({resource['guid']})")
        report.append("")
        
        # Variable elements
        report.append("## Variable Elements")
        report.append(f"Total variable elements identified: {len(self.variable_elements)}")
        report.append("")
        
        by_type = {}
        for var in self.variable_elements:
            if var.variable_type not in by_type:
                by_type[var.variable_type] = []
            by_type[var.variable_type].append(var)
        
        for var_type, vars in by_type.items():
            report.append(f"### {var_type.replace('_', ' ').title()} ({len(vars)} elements)")
            for var in vars:
                report.append(f"- **Path**: `{var.path}`")
                report.append(f"  - Current: `{var.current_value}`")
                if var.code_system:
                    report.append(f"  - Code System: `{var.code_system}`")
                if var.constraints:
                    report.append(f"  - Constraints: {var.constraints}")
                report.append("")
        
        # GUID mapping (FIXED template elements)
        report.append("## GUID Mapping (Fixed Template Elements)")
        report.append("**IMPORTANT**: These GUIDs are part of the template structure and should NOT be changed during randomization.")
        report.append("")
        for resource_id, guid in self.guid_mapping.items():
            report.append(f"- **{resource_id}**: `{guid}`")
        report.append("")
        
        return "\n".join(report)
    
    def save_analysis(self, output_file: str = "template_analysis_report.md"):
        """Save the analysis report to a file"""
        report = self.generate_analysis_report()
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(report)
        print(f"✅ Analysis report saved: {output_file}")

def main():
    """Main function to run the template analysis"""
    print("🔍 Step 1: Bundle Template Analysis")
    print("=" * 50)
    
    template_file = "output/Bundle-RecuperoCABABundleEjemplo.json"
    
    # Check if template exists, if not create a sample
    if not Path(template_file).exists():
        print(f"⚠️  Template file '{template_file}' not found!")
        print("Creating sample template for analysis...")
        
        # Create output directory if it doesn't exist
        Path("output").mkdir(exist_ok=True)
        
        # Create a sample template with fixed GUIDs
        sample_template = {
            "resourceType": "Bundle",
            "type": "collection",
            "identifier": {
                "system": "http://recuperocaba.gob.ar/Bundle",
                "value": "BUNDLE-001"
            },
            "timestamp": "2024-01-15T10:30:00Z",
            "entry": [
                {
                    "fullUrl": "urn:uuid:550e8400-e29b-41d4-a716-446655440001",
                    "resource": {
                        "resourceType": "Claim",
                        "id": "claim-001",
                        "created": "2024-01-15T10:00:00Z",
                        "diagnosis": [
                            {
                                "diagnosisCodeableConcept": {
                                    "coding": [
                                        {
                                            "system": "http://recuperocaba.gob.ar/CodeSystem/recupero-diagnosticos",
                                            "code": "DIAG-001",
                                            "display": "Sample Diagnosis"
                                        }
                                    ]
                                }
                            }
                        ],
                        "procedure": [
                            {
                                "procedureCodeableConcept": {
                                    "coding": [
                                        {
                                            "system": "http://recuperocaba.gob.ar/CodeSystem/codificacion-laboratorio",
                                            "code": "PROC-001",
                                            "display": "Sample Procedure"
                                        }
                                    ]
                                },
                                "date": "2024-01-15"
                            }
                        ],
                        "insurance": [
                            {
                                "coverage": {
                                    "identifier": {
                                        "system": "http://recuperocaba.gob.ar/CodeSystem/coberturas-codesystem",
                                        "value": "INS-001"
                                    }
                                }
                            }
                        ]
                    }
                },
                {
                    "fullUrl": "urn:uuid:550e8400-e29b-41d4-a716-446655440002",
                    "resource": {
                        "resourceType": "Patient",
                        "id": "patient-001",
                        "identifier": [
                            {
                                "system": "http://hospital.com/patient",
                                "value": "PAT-001"
                            }
                        ],
                        "name": [
                            {
                                "family": "Sample",
                                "given": ["John", "Doe"]
                            }
                        ],
                        "birthDate": "1980-01-01"
                    }
                }
            ]
        }
        
        # Save sample template
        with open(template_file, 'w', encoding='utf-8') as f:
            json.dump(sample_template, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Sample template created: {template_file}")
    
    # Initialize analyzer
    analyzer = BundleTemplateAnalyzer(template_file)
    
    # Load template
    if not analyzer.load_template():
        return
    
    # Analyze structure
    print("\n📋 Analyzing bundle structure...")
    bundle_info = analyzer.analyze_bundle_structure()
    print(f"   Bundle type: {bundle_info['type']}")
    print(f"   Resources: {bundle_info['total_resources']}")
    
    # Extract GUIDs and references
    print("\n🔗 Extracting GUIDs and references (FIXED template elements)...")
    guid_mapping, references = analyzer.extract_guids_and_references()
    print(f"   Fixed GUIDs found: {len(guid_mapping)}")
    
    # Identify variable elements
    print("\n🎯 Identifying variable elements...")
    variables = analyzer.identify_variable_elements()
    print(f"   Variable elements: {len(variables)}")
    
    # Generate and save report
    print("\n📄 Generating analysis report...")
    analyzer.save_analysis()
    
    print("\n✅ Template analysis completed!")
    print("\n📊 Summary:")
    print(f"   - Bundle resources: {bundle_info['total_resources']}")
    print(f"   - Fixed GUIDs: {len(guid_mapping)} (template structure)")
    print(f"   - Variable elements: {len(variables)}")
    print(f"   - Report saved: template_analysis_report.md")

if __name__ == "__main__":
    main() 