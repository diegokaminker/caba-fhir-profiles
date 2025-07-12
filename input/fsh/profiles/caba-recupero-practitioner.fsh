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


* identifier.system ^short = "ProfesionalEfector.codTipoMatriculaFirmante / Solicitante"
* identifier.value ^short = "ProfesionalEfector.idMatriculaFirmante / Solicitante"
* name.text ^short = "profesionalFirmante / Solicitante"



Profile:        PractitionerCabaSolicitanteRecupero
Parent:         PractitionerCabaRecupero
Id:             PractitionerCabaSolicitanteRecupero
Title:          "Practitioner Solicitante para Recupero CABA"
Description:    "Perfil de Practitioner Solicitante Para RECUPERO CABA"
* qualification.code from RecuperoProfesionesVS (required)
* qualification.code ^short = "ProfesionalSolicitante.codProfesionSolicitante"

Profile:        PractitionerCabaFirmanteRecupero
Parent:         PractitionerCabaRecupero
Id:             PractitionerCabaFirmanteRecupero
Title:          "Practitioner Firmante para Recupero CABA"
Description:    "Perfil de Practitioner Firmante Para RECUPERO CABA"
* qualification.code from RecuperoProfesionesEfectoresVS (required)
* qualification.code ^short = "ProfesionalEfector.codProfesionFirmante"
