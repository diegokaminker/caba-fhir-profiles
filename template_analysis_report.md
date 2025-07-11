# Bundle Template Analysis Report

## Bundle Structure
- **Resource Type**: Bundle
- **Bundle Type**: collection
- **Total Resources**: 7

## Resources
- **Claim**: RecuperoCABAClaimEjemplo (urn:uuid:23596630-d122-4dd4-bf1e-61a9d287ac05)
- **Patient**: RecuperoCABAPacienteEjemplo (urn:uuid:de45db8b-8e3f-404e-a7af-910a289eeb8c)
- **ServiceRequest**: RecuperoCABAServiceRequestEjemplo (urn:uuid:e4caeb31-9418-494e-a945-8799a90fb08c)
- **Encounter**: RecuperoCABAEncounterEjemplo (urn:uuid:108abd93-5b06-415b-9c66-0fe8b2c29ccf)
- **Practitioner**: RecuperoCABAProfesionalFirmanteEjemplo (urn:uuid:576e3804-7d1a-4530-9c3d-a8e16779f2a8)
- **Practitioner**: RecuperoCABAProfesionalSolicitanteEjemplo (urn:uuid:511b97a7-5ac5-4c5f-9e4f-94e17db97958)
- **DocumentReference**: RecuperoCABADocumentacionAdicionalEjemplo (urn:uuid:59a1159e-3016-4c84-a936-0725edc823a0)

## Variable Elements
Total variable elements identified: 33

### Bundle Identifier (1 elements)
- **Path**: `identifier.value`
  - Current: `1234567890`
  - Constraints: {'pattern': 'numeric', 'length': 10}

### Bundle Timestamp (1 elements)
- **Path**: `timestamp`
  - Current: `2025-03-13T07:19:12-03:00`
  - Constraints: {'format': 'ISO8601', 'range': 'recent'}

### Claim Created Date (1 elements)
- **Path**: `entry[0].resource.created`
  - Current: `2025-03-13T07:19:12-03:00`
  - Constraints: {'format': 'ISO8601', 'range': 'recent'}

### Diagnosis Code (1 elements)
- **Path**: `entry[0].resource.diagnosis[0].diagnosisCodeableConcept.coding[0]`
  - Current: `{'system': 'http://recuperocaba.gob.ar/CodeSystem/recupero-diagnosticos', 'code': 'A010', 'display': 'Fiebre tifoidea'}`
  - Code System: `http://recuperocaba.gob.ar/CodeSystem/recupero-diagnosticos`

### Procedure Code (5 elements)
- **Path**: `entry[0].resource.procedure[0].procedureCodeableConcept.coding[0]`
  - Current: `{'system': 'http://recuperocaba.gob.ar/CodeSystem/codificacion-laboratorio', 'code': '475', 'display': 'HEMOGRAMA'}`
  - Code System: `http://recuperocaba.gob.ar/CodeSystem/codificacion-laboratorio`

- **Path**: `entry[0].resource.procedure[1].procedureCodeableConcept.coding[0]`
  - Current: `{'system': 'http://recuperocaba.gob.ar/CodeSystem/codificacion-laboratorio', 'code': '171', 'display': 'COAGULOGRAMA'}`
  - Code System: `http://recuperocaba.gob.ar/CodeSystem/codificacion-laboratorio`

- **Path**: `entry[0].resource.procedure[2].procedureCodeableConcept.coding[0]`
  - Current: `{'system': 'http://recuperocaba.gob.ar/CodeSystem/codificacion-laboratorio', 'code': '481', 'display': 'HEPATOGRAMA'}`
  - Code System: `http://recuperocaba.gob.ar/CodeSystem/codificacion-laboratorio`

- **Path**: `entry[0].resource.procedure[3].procedureCodeableConcept.coding[0]`
  - Current: `{'system': 'http://recuperocaba.gob.ar/CodeSystem/codificacion-laboratorio', 'code': '902', 'display': 'UREA, SERICA'}`
  - Code System: `http://recuperocaba.gob.ar/CodeSystem/codificacion-laboratorio`

- **Path**: `entry[0].resource.procedure[4].procedureCodeableConcept.coding[0]`
  - Current: `{'system': 'http://recuperocaba.gob.ar/CodeSystem/codificacion-laboratorio', 'code': '192', 'display': 'CREATININA, EN SANGRE'}`
  - Code System: `http://recuperocaba.gob.ar/CodeSystem/codificacion-laboratorio`

### Procedure Date (5 elements)
- **Path**: `entry[0].resource.procedure[0].date`
  - Current: `2025-03-13`
  - Constraints: {'format': 'YYYY-MM-DD', 'range': 'recent'}

- **Path**: `entry[0].resource.procedure[1].date`
  - Current: `2025-03-13`
  - Constraints: {'format': 'YYYY-MM-DD', 'range': 'recent'}

- **Path**: `entry[0].resource.procedure[2].date`
  - Current: `2025-03-13`
  - Constraints: {'format': 'YYYY-MM-DD', 'range': 'recent'}

- **Path**: `entry[0].resource.procedure[3].date`
  - Current: `2025-03-13`
  - Constraints: {'format': 'YYYY-MM-DD', 'range': 'recent'}

- **Path**: `entry[0].resource.procedure[4].date`
  - Current: `2025-03-13`
  - Constraints: {'format': 'YYYY-MM-DD', 'range': 'recent'}

### Insurance Coverage (1 elements)
- **Path**: `entry[0].resource.insurance[0].coverage.identifier`
  - Current: `{'system': 'http://recuperocaba.gob.ar/CodeSystem/coberturas-codesystem', 'value': 'MP004'}`
  - Code System: `http://recuperocaba.gob.ar/CodeSystem/coberturas-codesystem`

### Patient Identifier (2 elements)
- **Path**: `entry[1].resource.identifier[0].value`
  - Current: `7699001`
  - Constraints: {'system': 'http://hospital1.gob.ar/pacientes'}

- **Path**: `entry[1].resource.identifier[1].value`
  - Current: `99990001`
  - Constraints: {'system': 'http://renaper.gob.ar/dni'}

### Patient Family Name (2 elements)
- **Path**: `entry[1].resource.name[0].family`
  - Current: `PRUEBAPA PRUEBAMA`

- **Path**: `entry[1].resource.name[1].family`
  - Current: `None`

### Patient Given Names (2 elements)
- **Path**: `entry[1].resource.name[0].given`
  - Current: `['FLORENCIA', 'BELEN']`

- **Path**: `entry[1].resource.name[1].given`
  - Current: `['BELU']`

### Patient Birth Date (1 elements)
- **Path**: `entry[1].resource.birthDate`
  - Current: `1990-01-01`
  - Constraints: {'format': 'YYYY-MM-DD', 'range': 'adult'}

### Servicerequest Identifier (1 elements)
- **Path**: `entry[2].resource.identifier[0].value`
  - Current: `12345`

### Servicerequest Occurrence Date (1 elements)
- **Path**: `entry[2].resource.occurrenceDateTime`
  - Current: `2025-03-15T07:19:12-03:00`
  - Constraints: {'format': 'ISO8601', 'range': 'recent'}

### Servicerequest Authored Date (1 elements)
- **Path**: `entry[2].resource.authoredOn`
  - Current: `2025-03-13T07:19:12-03:00`
  - Constraints: {'format': 'ISO8601', 'range': 'recent'}

### Encounter Identifier (1 elements)
- **Path**: `entry[3].resource.identifier[0].value`
  - Current: `130145562`

### Practitioner Identifier (2 elements)
- **Path**: `entry[4].resource.identifier[0].value`
  - Current: `116772b`
  - Code System: `http://recuperocaba.gob.ar/CodeSystem/recupero-tipos-matricula`

- **Path**: `entry[4].resource.identifier[0].value`
  - Current: `16772`
  - Code System: `http://recuperocaba.gob.ar/CodeSystem/recupero-tipos-matricula`

### Practitioner Name (2 elements)
- **Path**: `entry[4].resource.name[0].text`
  - Current: `DELIA JUAN`

- **Path**: `entry[4].resource.name[0].text`
  - Current: `CARRERA VALERIA`

### Practitioner Qualification (2 elements)
- **Path**: `entry[4].resource.qualification[0].code.coding[0]`
  - Current: `{'system': 'http://recuperocaba.gob.ar/CodeSystem/recupero-profesiones', 'code': '27', 'display': 'Bioquímico'}`
  - Code System: `http://recuperocaba.gob.ar/CodeSystem/recupero-profesiones`

- **Path**: `entry[4].resource.qualification[0].code.coding[0]`
  - Current: `{'system': 'http://recuperocaba.gob.ar/CodeSystem/recupero-profesiones', 'code': '1', 'display': 'Médico'}`
  - Code System: `http://recuperocaba.gob.ar/CodeSystem/recupero-profesiones`

### Document Date (1 elements)
- **Path**: `entry[5].resource.date`
  - Current: `2025-03-13T07:19:12-03:00`
  - Constraints: {'format': 'ISO8601', 'range': 'recent'}

## GUID Mapping
- **RecuperoCABAClaimEjemplo**: `urn:uuid:23596630-d122-4dd4-bf1e-61a9d287ac05`
- **RecuperoCABAPacienteEjemplo**: `urn:uuid:de45db8b-8e3f-404e-a7af-910a289eeb8c`
- **RecuperoCABAServiceRequestEjemplo**: `urn:uuid:e4caeb31-9418-494e-a945-8799a90fb08c`
- **RecuperoCABAEncounterEjemplo**: `urn:uuid:108abd93-5b06-415b-9c66-0fe8b2c29ccf`
- **RecuperoCABAProfesionalFirmanteEjemplo**: `urn:uuid:576e3804-7d1a-4530-9c3d-a8e16779f2a8`
- **RecuperoCABAProfesionalSolicitanteEjemplo**: `urn:uuid:511b97a7-5ac5-4c5f-9e4f-94e17db97958`
- **RecuperoCABADocumentacionAdicionalEjemplo**: `urn:uuid:59a1159e-3016-4c84-a936-0725edc823a0`
