Profile:        ServiceRequestCabaRecupero
Parent:         ServiceRequest
Id:             ServiceRequestCabaRecupero
Title:          "ServiceRequest para Recupero CABA"
Description:    "Perfil de ServiceRequest Para RECUPERO CABA"

* status 1..1
* intent 1..1
* locationCode 1..1
* identifier 1..1
* category 1..1
* subject 1..1
* encounter 1..1
* authoredOn 1..1
* occurrenceDateTime 1..1
* requester 1..1
* performer 1..1

* requester only Reference(PractitionerCabaRecupero)
* performer only Reference(PractitionerCabaRecupero)
* encounter only Reference(EncounterCabaRecupero)
* subject only Reference(PatientCabaRecupero)

* status = #completed
* intent = #order
* category = $sct#108252007 "Laboratory Procedure"

* locationCode.text 1..1
* identifier.system 1..1
* identifier.value 1..1
* authoredOn ^short = "fechasServicio.fechaMuestra"
* occurrenceDateTime ^short = "fechasServicio.fechaResultado"
* locationCode.text ^short = "DatosContexto.desAreaJerarquicaSolicitud"
* identifier ^short = "DatosContexto.idPedido"
* performer ^short = "ProfesionalFirmante"
* requester ^short = "ProfesionalSolicitante"
