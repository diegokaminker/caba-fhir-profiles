Profile:        BundleCabaRecupero
Parent:         Bundle
Id:             BundleCabaRecupero
Title:          "Bundle Recupero Para CABA"
Description:    "Perfil de Bundle para CABA Recupero"


* identifier 1..1
* timestamp 1..1
* type = #collection
* timestamp ^short = "Fecha de Creación"
* identifier 1..1 MS
* identifier ^short = "Identificador Único de Reporte"
* identifier.system 1..1 MS
* identifier.value 1..1 MS
* entry 7..7
* entry.fullUrl 1..1    
* entry MS
* entry ^slicing.discriminator.type = #profile
* entry ^slicing.discriminator.path = "resource"
* entry ^slicing.rules = #open
* entry contains
    DatosClaim 1..1 MS and
    DatosPaciente 1..1 MS and
    DatosServicio 1..1 MS and
    DatosEncuentro 1..1 MS and
    DatosProfesionalFirmante 1..1 MS and
    DatosProfesionalSolicitante 1..1 MS and
    DatosAdjunto 1..1 MS 
    
* entry[DatosClaim].resource only ClaimCabaRecupero
* entry[DatosPaciente].resource only PatientCabaRecupero
* entry[DatosServicio].resource only ServiceRequestCabaRecupero
* entry[DatosEncuentro].resource only EncounterCabaRecupero
* entry[DatosProfesionalSolicitante].resource only PractitionerCabaSolicitanteRecupero
* entry[DatosProfesionalFirmante].resource only PractitionerCabaFirmanteRecupero
* entry[DatosAdjunto].resource only DocumentReferenceCabaRecupero



