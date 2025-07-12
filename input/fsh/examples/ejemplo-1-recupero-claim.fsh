Instance: RecuperoCABABundleEjemplo
InstanceOf: BundleCabaRecupero
Usage: #example
* type = #collection
* identifier.system = "http://hospital1.gob.ar/recuperos"
* identifier.value = "1234567890"
* timestamp =  "2025-03-13T07:19:12-03:00"
* entry[DatosClaim].fullUrl = "urn:uuid:23596630-d122-4dd4-bf1e-61a9d287ac05"
* entry[DatosClaim].resource = RecuperoCABAClaimEjemplo
* entry[DatosPaciente].fullUrl = "urn:uuid:de45db8b-8e3f-404e-a7af-910a289eeb8c"
* entry[DatosPaciente].resource = RecuperoCABAPacienteEjemplo
* entry[DatosServicio].fullUrl = "urn:uuid:e4caeb31-9418-494e-a945-8799a90fb08c"
* entry[DatosServicio].resource = RecuperoCABAServiceRequestEjemplo
* entry[DatosEncuentro].fullUrl = "urn:uuid:108abd93-5b06-415b-9c66-0fe8b2c29ccf"
* entry[DatosEncuentro].resource = RecuperoCABAEncounterEjemplo
* entry[DatosProfesionalFirmante].fullUrl = "urn:uuid:576e3804-7d1a-4530-9c3d-a8e16779f2a8"
* entry[DatosProfesionalFirmante].resource = RecuperoCABAProfesionalFirmanteEjemplo
* entry[DatosProfesionalSolicitante].fullUrl = "urn:uuid:511b97a7-5ac5-4c5f-9e4f-94e17db97958"
* entry[DatosProfesionalSolicitante].resource = RecuperoCABAProfesionalSolicitanteEjemplo
* entry[DatosAdjunto].fullUrl = "urn:uuid:59a1159e-3016-4c84-a936-0725edc823a0"
* entry[DatosAdjunto].resource = RecuperoCABADocumentacionAdicionalEjemplo

Instance: RecuperoCABAClaimEjemplo
InstanceOf: ClaimCabaRecupero
Usage: #inline
* priority = http://terminology.hl7.org/CodeSystem/processpriority#normal
* status = #active
* type = $claim-type#institutional "Institutional"
* patient = Reference(urn:uuid:de45db8b-8e3f-404e-a7af-910a289eeb8c)
* created = "2025-03-13T07:19:12-03:00"
* insurance.sequence = 1
* insurance.focal = true
* insurance.coverage.identifier.system = "http://recuperocaba.gob.ar/CodeSystem/coberturas-codesystem"
* insurance.coverage.identifier.value = "MP004"
* insurance.coverage.display = "Medicus"
* provider.display = "Hospital 1 - Laboratorio de Análisis Clínicos"
* facility.display = "Hospital 1 - Clínica Médica"
* referral = Reference(urn:uuid:e4caeb31-9418-494e-a945-8799a90fb08c)
* diagnosis.sequence = 1
* diagnosis.diagnosisCodeableConcept = $recupero-diagnosticos#A010 "Fiebre tifoidea"
* procedure[0].sequence = 1
* procedure[=].date = "2025-03-13"
* procedure[=].procedureCodeableConcept = $codificacion-laboratorio#475 "HEMOGRAMA COMPLETO"
* procedure[+].sequence = 2
* procedure[=].date = "2025-03-13"
* procedure[=].procedureCodeableConcept = $codificacion-laboratorio#171 "COAGULOGRAMA COMPLETO"
* procedure[+].sequence = 3
* procedure[=].date = "2025-03-13"
* procedure[=].procedureCodeableConcept = $codificacion-laboratorio#481 "HEPATOGRAMA COMPLETO"
* procedure[+].sequence = 4
* procedure[=].date = "2025-03-13"
* procedure[=].procedureCodeableConcept = $codificacion-laboratorio#902 "UREMIA"
* procedure[+].sequence = 5
* procedure[=].date = "2025-03-13"
* procedure[=].procedureCodeableConcept = $codificacion-laboratorio#192 "CREATININA"
* supportingInfo.sequence = 1
* supportingInfo.category = $claiminformationcategory#attachment "Attachment"
* supportingInfo.valueReference = Reference(urn:uuid:59a1159e-3016-4c84-a936-0725edc823a0)

Instance: RecuperoCABAPacienteEjemplo
InstanceOf: PatientCabaRecupero
Usage: #inline
* identifier[IdentificadorInterno].use = #usual
* identifier[IdentificadorInterno].value = "7699001"
* identifier[IdentificadorInterno].system = "http://hospital1.gob.ar/pacientes"
* identifier[DocumentoUnico].use = #official
* identifier[DocumentoUnico].system = "http://renaper.gob.ar/dni"
* identifier[DocumentoUnico].value = "99990001"
* name[NombreOficial].use = #official
* name[NombreOficial].family = "PRUEBAPA PRUEBAMA"
* name[NombreOficial].given[0] = "FLORENCIA"
* name[NombreOficial].given[+] = "BELEN"
* name[NombreOficial].family.extension[ExtensionFathersFamilyName].url = $ExtensionFathersFamilyName
* name[NombreOficial].family.extension[ExtensionFathersFamilyName].valueString = "PRUEBAPA"
* name[NombreOficial].family.extension[ExtensionMothersFamilyName].url = $ExtensionMothersFamilyName
* name[NombreOficial].family.extension[ExtensionMothersFamilyName].valueString = "PRUEBAMA"
* name[NombreElegido].use = #usual
* name[NombreElegido].given = "BELU"
* gender = #female
* birthDate = "1990-01-01"

Instance: RecuperoCABAServiceRequestEjemplo
InstanceOf: ServiceRequestCabaRecupero
Usage: #inline
* status = #completed
* intent = #order
* locationCode.text = "Laboratorio de Análisis Clínicos"
* identifier.system = "http://hospital1.gob.ar/pedidos"
* identifier.value = "12345"
* category = $sct#108252007 "Laboratory Procedure"
* subject = Reference(urn:uuid:de45db8b-8e3f-404e-a7af-910a289eeb8c)
* encounter = Reference(urn:uuid:108abd93-5b06-415b-9c66-0fe8b2c29ccf)
* authoredOn = "2025-03-13T07:19:12-03:00"
* occurrenceDateTime = "2025-03-15T07:19:12-03:00"
* requester = Reference(urn:uuid:511b97a7-5ac5-4c5f-9e4f-94e17db97958)
* performer = Reference(urn:uuid:576e3804-7d1a-4530-9c3d-a8e16779f2a8)

Instance: RecuperoCABAEncounterEjemplo
InstanceOf: EncounterCabaRecupero
Usage: #inline
* status = #unknown
* class = $v3-ActCode#AMB "ambulatory"
* type.text = "Immunología"
* subject = Reference(urn:uuid:de45db8b-8e3f-404e-a7af-910a289eeb8c)
* identifier.system = "http://hospital1.gob.ar/episodios"
* identifier.value = "130145562"

Instance: RecuperoCABAProfesionalFirmanteEjemplo
InstanceOf: PractitionerCabaRecupero
Usage: #inline
* identifier.system = "http://recuperocaba.gob.ar/CodeSystem/recupero-tipos-matricula/10002001110000"
* identifier.value = "116772b"
* name.text = "DELIA JUAN"
* qualification.code = $recupero-profesiones-efectores#27 "Bioquímico"

Instance: RecuperoCABAProfesionalSolicitanteEjemplo
InstanceOf: PractitionerCabaRecupero
Usage: #inline
* identifier.system = "http://recuperocaba.gob.ar/CodeSystem/recupero-tipos-matricula/10006441714000"
* identifier.value = "16772"
* name.text = "CARRERA VALERIA"
* qualification.code = $recupero-profesiones#1 "Médico"

Instance: RecuperoCABADocumentacionAdicionalEjemplo
InstanceOf: DocumentReference
Usage: #inline
* status = #current
* type = $loinc#11502-2 "Laboratory Report"
* subject = Reference(urn:uuid:de45db8b-8e3f-404e-a7af-910a289eeb8c)
* date = "2025-03-13T07:19:12-03:00"
* content.attachment.contentType = #application/pdf
* content.attachment.data = "JVBERi0xLjQKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9nCi9QYWdlcyAyIDAgUgo+PgplbmRvYmoK MiAwIG9iago8PC9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagoz IDAgb2JqCjw8L1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA1OTUgODQy XQovQ29udGVudHMgNSAwIFIKL1Jlc291cmNlcyA8PC9Qcm9jU2V0IFsvUERGIC9UZXh0XQovRm9u dCA8PC9GMSA0IDAgUj4+Cj4+Cj4+CmVuZG9iago0IDAgb2JqCjw8L1R5cGUgL0ZvbnQKL1N1YnR5 cGUgL1R5cGUxCi9OYW1lIC9GMQovQmFzZUZvbnQgL0hlbHZldGljYQovRW5jb2RpbmcgL01hY1Jv bWFuRW5jb2RpbmcKPj4KZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDUzCj4+CnN0cmVhbQpCVAov RjEgMjAgVGYKMjIwIDQwMCBUZAooRHVtbXkgUERGKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhy ZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZgowMDAwMDAwMDA5IDAwMDAwIG4KMDAwMDAwMDA2MyAw MDAwMCBuCjAwMDAwMDAxMjQgMDAwMDAgbgowMDAwMDAwMjc3IDAwMDAwIG4KMDAwMDAwMDM5MiAw MDAwMCBuCnRyYWlsZXIKPDwvU2l6ZSA2Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo0OTUKJSVFT0YK"