Profile:        EncounterCabaRecupero
Parent:         Encounter
Id:             EncounterCabaRecupero
Title:          "Encuentro para Recupero CABA"
Description:    "Perfil de Encuentro Para RECUPERO CABA"

* status 1..1
* class 1..1
* type 1..1
* subject 1..1
* identifier 1..1

* type.text 1..1
* subject only Reference(PatientCabaRecupero)
* class from http://terminology.hl7.org/ValueSet/v3-ActEncounterCode (required)

* identifier ^short = "DatosContexto.idEpisodio"
* class ^short = "DatosContexto.codAmbito"
* type ^short = "DatosContexto.desAmbitoDetalle"
