Profile:        PatientCabaRecupero
Parent:         Patient
Id:             PatientCabaRecupero
Title:          "Paciente para Recupero CABA"
Description:    "Perfil de Paciente Para RECUPERO CABA"
* name 1..2
* birthDate 1..1
* gender 1..1
* identifier 1..2

* identifier.system 1..1
* identifier.value 1..1

* identifier ^slicing.discriminator.type = #value
* identifier ^slicing.discriminator.path = "use"
* identifier ^slicing.rules = #closed
* identifier contains DocumentoUnico 1..1 MS
* identifier[DocumentoUnico].use = #official
* identifier contains IdentificadorInterno 0..1 MS
* identifier[IdentificadorInterno].use = #usual

* name ^slicing.discriminator.type = #value
* name ^slicing.discriminator.path = "use"
* name ^slicing.rules = #closed
* name contains NombreOficial 1..1 MS
* name[NombreOficial].use = #official
* name[NombreOficial].family 1..1 MS
* name[NombreOficial].family.extension contains ExtensionFathersFamilyName named FathersFamilyName 1..1
* name[NombreOficial].family.extension contains ExtensionMothersFamilyName named MothersFamilyName 1..1
* name[NombreOficial].given 1..2 MS
* name contains NombreElegido 0..1 MS
* name[NombreElegido].use = #usual
* name[NombreElegido].given 1..1 MS

* gender from http://hl7.org/fhir/ValueSet/administrative-gender (required) 

* name[NombreOficial].given ^short = "DatosPaciente.nombrePaciente / DatosPaciente.otroNombrePaciente"
* name[NombreElegido].given ^short = "DatosPaciente.nombreAutopercibidoPaciente"
* identifier[DocumentoUnico].use ^short = "DatosPaciente.Documento de Identidad"
* identifier[DocumentoUnico].system ^short = "DatosPaciente.tipoDocumentoPaciente"	
* identifier[DocumentoUnico].value ^short = "DatosPaciente.idDocumentoPaciente"
* identifier[IdentificadorInterno].value ^short = "DatosPaciente.idPaciente"
* gender ^short = "DatosPaciente.codSexoPaciente"
* birthDate ^short = "DatosPaciente.fechaNacimientoPaciente"