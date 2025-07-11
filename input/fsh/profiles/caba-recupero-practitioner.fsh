Profile:        PractitionerCabaRecupero
Parent:         Practitioner
Id:             PractitionerCabaRecupero
Title:          "Practitioner para Recupero CABA"
Description:    "Perfil de Practitioner Para RECUPERO CABA"

* identifier 1..1
* name 1..1
* qualification 1..1

* identifier.system 1..1
* identifier.value 1..1
* name.text 1..1
* qualification.code 1..1

* qualification.code from RecuperoProfesionesVS (required)

* identifier.system ^short = "ProfesionalEfector.codTipoMatriculaFirmante / Solicitante"
* identifier.value ^short = "ProfesionalEfector.idMatriculaFirmante / Solicitante"
* name.text ^short = "profesionalFirmante / Solicitante"
* qualification.code ^short = "ProfesionalEfector.codProfesionFirmante / Solicitante"

