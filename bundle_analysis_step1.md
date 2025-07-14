# Bundle Analysis - Step 1: Example Bundle Structure

## Bundle Overview
- **Resource Type**: Bundle
- **Profile**: http://recuperocaba.gob.ar/StructureDefinition/BundleCabaRecupero
- **Type**: collection

## Bundle Constraints (Updated Requirements)
1. **ID Element**: Should NOT be included in the bundle
2. **Resource IDs**: No resource in the bundle (including the bundle itself) should include an `id` element
3. **Timestamp**: Should be the current time when creating the bundle (dynamic)
4. **Identifier System**: Should follow Case A of naming conventions:
   - Format: `{domain_uri}/recuperos`
   - Examples:
     - Hospital 1: `http://hospital1.gob.ar/recuperos`
     - Laboratorio 1: `http://laboratorio1.gob.ar/recuperos`
     - Hospital 2: `http://hospital2.gob.ar/recuperos`
5. **Identifier Value**: Should be a UUID (not hardcoded like "1234567890")

> **Key Requirement:** The `id` element must NOT be present in the bundle or in any resource contained within the bundle. All resource identification and referencing should be done via `fullUrl` and `reference` fields using UUIDs.

## Bundle Metadata (Corrected)
```json
{
  "identifier": {
    "system": "http://hospital1.gob.ar/recuperos",  // Based on performer organization
    "value": "uuid-generated-value"                 // Dynamic UUID
  },
  "timestamp": "2025-01-13T15:30:45-03:00"         // Current timestamp when created
}
```

## Bundle Entries (Resources)

### Entry 1: Claim Resource
- **Full URL**: urn:uuid:23596630-d122-4dd4-bf1e-61a9d287ac05
- **Resource ID**: RecuperoCABAClaimEjemplo
- **Profile**: http://recuperocaba.gob.ar/StructureDefinition/ClaimCabaRecupero
- **Status**: active
- **Type**: institutional
- **Use**: claim
- **Patient Reference**: urn:uuid:de45db8b-8e3f-404e-a7af-910a289eeb8c
- **Referral Reference**: urn:uuid:e4caeb31-9418-494e-a945-8799a90fb08c
- **Supporting Info Reference**: urn:uuid:59a1159e-3016-4c84-a936-0725edc823a0

**Key Elements**:
- Provider: "Hospital 1 - Laboratorio de Análisis Clínicos"
- Facility: "Hospital 1 - Clínica Médica"
- Priority: normal
- Created: 2025-03-13T07:19:12-03:00
- Diagnosis: A010 (Fiebre tifoidea)
- Procedures: 5 procedures (HEMOGRAMA, COAGULOGRAMA, HEPATOGRAMA, UREMIA, CREATININA)
- Insurance: MP004 (Medicus)

### Entry 2: Patient Resource
- **Full URL**: urn:uuid:de45db8b-8e3f-404e-a7af-910a289eeb8c
- **Resource ID**: RecuperoCABAPacienteEjemplo
- **Profile**: http://recuperocaba.gob.ar/StructureDefinition/PatientCabaRecupero

**Key Elements**:
- **Identifiers**:
  - System: http://hospital1.gob.ar/pacientes, Value: 7699001 (use: usual)
  - System: http://renaper.gob.ar/dni, Value: 99990001 (use: official)
- **Names**:
  - Official: PRUEBAPA PRUEBAMA (with extensions for father's and mother's family names)
  - Given: ["FLORENCIA", "BELEN"]
  - Usual: BELU
- **Extensions**:
  - Father's Family Name: PRUEBAPA
  - Mother's Family Name: PRUEBAMA
- **Demographics**: Female, Birth Date: 1990-01-01

### Entry 3: ServiceRequest Resource
- **Full URL**: urn:uuid:e4caeb31-9418-494e-a945-8799a90fb08c
- **Resource ID**: RecuperoCABAServiceRequestEjemplo
- **Profile**: http://recuperocaba.gob.ar/StructureDefinition/ServiceRequestCabaRecupero

**Key Elements**:
- **Identifier**: http://hospital1.gob.ar/pedidos/12345
- **Status**: completed
- **Intent**: order
- **Category**: Laboratory Procedure (SNOMED: 108252007)
- **Subject Reference**: urn:uuid:de45db8b-8e3f-404e-a7af-910a289eeb8c
- **Encounter Reference**: urn:uuid:108abd93-5b06-415b-9c66-0fe8b2c29ccf
- **Requester Reference**: urn:uuid:511b97a7-5ac5-4c5f-9e4f-94e17db97958
- **Performer Reference**: urn:uuid:576e3804-7d1a-4530-9c3d-a8e16779f2a8
- **Occurrence**: 2025-03-15T07:19:12-03:00
- **Authored On**: 2025-03-13T07:19:12-03:00
- **Location Code**: "Laboratorio de Análisis Clínicos"

### Entry 4: Encounter Resource
- **Full URL**: urn:uuid:108abd93-5b06-415b-9c66-0fe8b2c29ccf
- **Resource ID**: RecuperoCABAEncounterEjemplo
- **Profile**: http://recuperocaba.gob.ar/StructureDefinition/EncounterCabaRecupero

**Key Elements**:
- **Identifier**: http://hospital1.gob.ar/episodios/130145562
- **Status**: unknown
- **Class**: AMB (ambulatory)
- **Type**: "Immunología"
- **Subject Reference**: urn:uuid:de45db8b-8e3f-404e-a7af-910a289eeb8c

### Entry 5: Practitioner (Firmante) Resource
- **Full URL**: urn:uuid:576e3804-7d1a-4530-9c3d-a8e16779f2a8
- **Resource ID**: RecuperoCABAProfesionalFirmanteEjemplo
- **Profile**: http://recuperocaba.gob.ar/StructureDefinition/PractitionerCabaFirmanteRecupero

**Key Elements**:
- **Identifier**: http://recuperocaba.gob.ar/CodeSystem/recupero-tipos-matricula/10002001110000/116772b
- **Name**: "DELIA JUAN"
- **Qualification**: Bioquímico (code: 27)

### Entry 6: Practitioner (Solicitante) Resource
- **Full URL**: urn:uuid:511b97a7-5ac5-4c5f-9e4f-94e17db97958
- **Resource ID**: RecuperoCABAProfesionalSolicitanteEjemplo
- **Profile**: http://recuperocaba.gob.ar/StructureDefinition/PractitionerCabaSolicitanteRecupero

**Key Elements**:
- **Identifier**: http://recuperocaba.gob.ar/CodeSystem/recupero-tipos-matricula/10006441714000/16772
- **Name**: "CARRERA VALERIA"
- **Qualification**: Médico (code: 1)

### Entry 7: DocumentReference Resource
- **Full URL**: urn:uuid:59a1159e-3016-4c84-a936-0725edc823a0
- **Resource ID**: RecuperoCABADocumentacionAdicionalEjemplo

**Key Elements**:
- **Status**: current
- **Type**: Laboratory Report (LOINC: 11502-2)
- **Subject Reference**: urn:uuid:de45db8b-8e3f-404e-a7af-910a289eeb8c
- **Date**: 2025-03-13T07:19:12-03:00
- **Content**: PDF attachment with base64 data

## UUID Mapping
| Resource Type | UUID | Purpose |
|---------------|------|---------|
| Claim | 23596630-d122-4dd4-bf1e-61a9d287ac05 | Main claim resource |
| Patient | de45db8b-8e3f-404e-a7af-910a289eeb8c | Patient data |
| ServiceRequest | e4caeb31-9418-494e-a945-8799a90fb08c | Service request |
| Encounter | 108abd93-5b06-415b-9c66-0fe8b2c29ccf | Encounter data |
| Practitioner (Firmante) | 576e3804-7d1a-4530-9c3d-a8e16779f2a8 | Attending professional |
| Practitioner (Solicitante) | 511b97a7-5ac5-4c5f-9e4f-94e17db97958 | Requesting professional |
| DocumentReference | 59a1159e-3016-4c84-a936-0725edc823a0 | Supporting documentation |

## Reference Relationships
- Claim → Patient (de45db8b-8e3f-404e-a7af-910a289eeb8c)
- Claim → ServiceRequest (e4caeb31-9418-494e-a945-8799a90fb08c)
- Claim → DocumentReference (59a1159e-3016-4c84-a936-0725edc823a0)
- ServiceRequest → Patient (de45db8b-8e3f-404e-a7af-910a289eeb8c)
- ServiceRequest → Encounter (108abd93-5b06-415b-9c66-0fe8b2c29ccf)
- ServiceRequest → Practitioner (Solicitante) (511b97a7-5ac5-4c5f-9e4f-94e17db97958)
- ServiceRequest → Practitioner (Firmante) (576e3804-7d1a-4530-9c3d-a8e16779f2a8)
- Encounter → Patient (de45db8b-8e3f-404e-a7af-910a289eeb8c)
- DocumentReference → Patient (de45db8b-8e3f-404e-a7af-910a289eeb8c)

## Key Observations
1. **Fixed UUIDs**: All UUIDs are hardcoded and consistent across references
2. **Profile Compliance**: All resources use specific CABA profiles
3. **Naming Systems**: Uses specific naming systems for DNI and matrículas
4. **Extensions**: Patient uses family name extensions
5. **Code Systems**: Uses local CABA code systems for diagnoses, procedures, professions
6. **Timestamps**: All timestamps are consistent (2025-03-13T07:19:12-03:00)
7. **Base64 Data**: DocumentReference contains actual base64-encoded PDF data

## Bundle Generation Requirements (Updated)
1. **No ID field** in the bundle
2. **Dynamic timestamp** when bundle is created
3. **Identifier system** based on performer organization domain + "/recuperos"
4. **Identifier value** as UUID
5. **Type**: "collection"
6. **Profile**: http://recuperocaba.gob.ar/StructureDefinition/BundleCabaRecupero

## Next Steps
This analysis provides the baseline for comparing our generator's output. Each subsequent step will focus on one resource type and compare our implementation against this structure. 