Extension: ExtensionMothersFamilyName
Id: ExtensionMothersFamilyName
Description: "Extension used in the HumanName.family element to record the person's first (or paternal) family name."
* ^url = $ExtensionMothersFamilyName
* ^title = "Extension: MothersFamilyName"
* ^fhirVersion = #4.0.1
* ^context.type = #element
* ^context.expression = "HumanName.family"
* . 1..1 MS
* . ^short = "DatosPaciente.otroApellidoPaciente"
* url = $ExtensionMothersFamilyName (exactly)
* value[x] 1..1
* value[x] only string
