Profile:        DocumentReferenceCabaRecupero
Parent:         DocumentReference
Id:             DocumentReferenceCabaRecupero
Title:          "DocumentReference Recupero Para CABA"
Description:    "Perfil de DocumentReference para CABA Recupero"

* status 1..1
* type 1..1
* subject 1..1
* date 1..1
* content 1..1
* status = #current
* type = $loinc#11502-2 "Laboratory Report"
* subject only Reference(PatientCabaRecupero)
* content.attachment 1..1
* content.attachment.contentType 1..1
* content.attachment.contentType = #application/pdf
* content.attachment.data 0..1
* content.attachment.url 0..1

* content.attachment ^short = "documentacionAuditoria"
* content.attachment.data ^short = "Incluido en Base64"
* content.attachment.url ^short = "Disponible a través de un vínculo"
