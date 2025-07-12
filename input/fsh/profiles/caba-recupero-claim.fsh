Profile:        ClaimCabaRecupero
Parent:         Claim
Id:             ClaimCabaRecupero
Title:          "Claim Recupero Para CABA"
Description:    "Perfil de Claim para CABA Recupero"

* priority 1..1
* status 1..1
* type 1..1
* use 1..1
* patient 1..1
* created 1..1
* insurance 1..1
* provider 1..1
* facility 1..1
* referral 1..1 
* diagnosis 1..1
* procedure 1..*

* insurance.sequence 1..1
* insurance.focal 1..1
* insurance.coverage 1..1
* insurance.coverage.identifier.value 1..1
* insurance.coverage.display 1..1
* provider.display 1..1
* facility.display 1..1
* diagnosis.sequence 1..1
* diagnosis.diagnosisCodeableConcept 1..1
* procedure.sequence 1..1
* procedure.date 1..1
* procedure.procedureCodeableConcept 1..1

* status = #active
* use = #claim
* priority = http://terminology.hl7.org/CodeSystem/processpriority#normal

* patient only Reference(PatientCabaRecupero) 
* referral only Reference(ServiceRequestCabaRecupero)
* diagnosis.diagnosisCodeableConcept from RecuperoDiagnosticosVS (required)
* procedure.procedureCodeableConcept from RecuperoProcedimientosVS (required)
* supportingInfo.sequence = 1
* supportingInfo.category = $claiminformationcategory#attachment "Attachment"
* supportingInfo.valueReference only Reference(DocumentReferenceCabaRecupero)

* diagnosis ^short = "DiagnosticoPresuntivo"
* procedure ^short = "Prestaciones"
* facility  ^short = "DatosContexto.desServicioDetalle"