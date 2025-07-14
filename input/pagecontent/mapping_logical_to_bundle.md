# Mapeo del Modelo Lógico al Bundle FHIR

## Resumen

Este documento describe el mapeo entre el modelo lógico `RecuperoLaboratorioSolicitud` y la estructura del Bundle FHIR que contiene los recursos necesarios para el recupero de gastos de laboratorio.

## Estructura del Mapeo

### 1. Bundle Principal

El modelo lógico se mapea a un Bundle FHIR con las siguientes características:

- **Tipo**: `collection`
- **Perfil**: `http://recuperocaba.gob.ar/StructureDefinition/BundleCabaRecupero`
- **Timestamp**: Timestamp actual cuando se crea el bundle
- **Identificador**: Sistema basado en la URL del efector + "/recuperos", valor UUID generado

### 2. Recursos del Bundle

El bundle contiene 7 recursos principales, cada uno mapeado desde elementos específicos del modelo lógico:

#### 2.1 Patient Resource (Entry 0)
**Mapeo desde**: `DatosPaciente`

| Elemento Lógico | Campo FHIR | Descripción |
|-----------------|------------|-------------|
| `idPaciente` | `identifier[0]` | Identificador interno del paciente |
| `tipoDocumentoPaciente` + `documentoPaciente` | `identifier[1]` | DNI oficial |
| `apellidoPaciente` | `name[0].family` | Apellido principal |
| `otroApellidoPaciente` | `name[0]._family.extension[0]` | Apellido paterno (extensión) |
| `apellidoPaciente` | `name[0]._family.extension[1]` | Apellido materno (extensión) |
| `nombrePaciente` + `otroNombrePaciente` | `name[0].given` | Nombres |
| `nombreAutopercibidoPaciente` | `name[1]` | Nombre de uso habitual |
| `codSexoPaciente` | `gender` | Sexo del paciente |
| `fechaNacimientoPaciente` | `birthDate` | Fecha de nacimiento |

#### 2.2 ServiceRequest Resource (Entry 1)
**Mapeo desde**: `DatosContexto` + `FechasServicio`

| Elemento Lógico | Campo FHIR | Descripción |
|-----------------|------------|-------------|
| `idPedido` | `identifier[0]` | Identificador de la solicitud |
| `codAmbito` | `locationCode[0].text` | Contexto del servicio |
| `desEfectorProcesamiento` | `locationCode[0].text` | Efector de procesamiento |
| `fechaMuestra` | `occurrenceDateTime` | Fecha de toma de muestra |
| `fechaResultado` | `authoredOn` | Fecha del resultado |

#### 2.3 Encounter Resource (Entry 2)
**Mapeo desde**: `DatosContexto`

| Elemento Lógico | Campo FHIR | Descripción |
|-----------------|------------|-------------|
| `idEpisodio` | `identifier[0]` | Identificador del episodio |

#### 2.4 Claim Resource (Entry 3)
**Mapeo desde**: `DiagnosticoPresuntivo` + `DatosCobertura` + `prestaciones`

| Elemento Lógico | Campo FHIR | Descripción |
|-----------------|------------|-------------|
| `codDiagnosticoTm` | `diagnosis[0].diagnosisCodeableConcept.coding[0]` | Código diagnóstico local |
| `codDiagnosticoSnomed` | `diagnosis[0].diagnosisCodeableConcept.coding[1]` | Código SNOMED |
| `codCobertura` | `insurance[0].coverage.identifier` | Código de cobertura |
| `idCobertura` | `insurance[0].coverage.identifier[1]` | Número de carnet |
| `prestaciones[].codPrestacion` | `procedure[].procedureCodeableConcept.coding[0]` | Códigos de procedimientos |

#### 2.5 Practitioner (Solicitante) Resource (Entry 4)
**Mapeo desde**: `ProfesionalSolicitante`

| Elemento Lógico | Campo FHIR | Descripción |
|-----------------|------------|-------------|
| `codProfesionSolicitante` | `qualification[0].code.coding[0]` | Código de profesión |
| `codTipoMatriculaSolicitante` | `identifier[0].system` | Sistema de matrícula |
| `idMatriculaSolicitante` | `identifier[0].value` | Número de matrícula |
| `profesional` | `name[0].text` | Nombre del profesional |

#### 2.6 Practitioner (Firmante) Resource (Entry 5)
**Mapeo desde**: `ProfesionalEfector`

| Elemento Lógico | Campo FHIR | Descripción |
|-----------------|------------|-------------|
| `codProfesionFirmante` | `qualification[0].code.coding[0]` | Código de profesión |
| `codTipoMatriculaFirmante` | `identifier[0].system` | Sistema de matrícula |
| `idMatriculaFirmante` | `identifier[0].value` | Número de matrícula |
| `profesional` | `name[0].text` | Nombre del profesional |

#### 2.7 DocumentReference Resource (Entry 6)
**Mapeo desde**: `documentacionAuditoria`

| Elemento Lógico | Campo FHIR | Descripción |
|-----------------|------------|-------------|
| `documentacionAuditoria` | `content[0].attachment.data` | Datos del documento en base64 |

## Referencias Cruzadas

El mapeo incluye referencias entre recursos usando UUIDs:

- **Patient**: Referenciado en Claim, ServiceRequest, Encounter, DocumentReference
- **ServiceRequest**: Referenciado en Claim
- **Encounter**: Referenciado en ServiceRequest
- **Practitioners**: Referenciados en ServiceRequest
- **DocumentReference**: Referenciado en Claim

## Ejemplo de Mapeo

### Entrada del Modelo Lógico:
```json
{
  "DatosPaciente": {
    "idPaciente": "7699001",
    "apellidoPaciente": "PRUEBAMA",
    "otroApellidoPaciente": "PRUEBAPA",
    "nombrePaciente": ["FLORENCIA", "BELEN"],
    "nombreAutopercibidoPaciente": "BELU",
    "tipoDocumentoPaciente": "DNI",
    "documentoPaciente": "99990001",
    "codSexoPaciente": "female",
    "fechaNacimientoPaciente": "1990-01-01"
  },
  "DatosContexto": {
    "idPedido": "12345",
    "idEpisodio": "130145562",
    "codAmbito": "Ambulatorio"
  },
  "DiagnosticoPresuntivo": {
    "codDiagnosticoTm": "A010",
    "desDiagnosticoTm": "Fiebre tifoidea"
  }
}
```

### Salida del Bundle FHIR:
```json
{
  "resourceType": "Bundle",
  "type": "collection",
  "entry": [
    {
      "fullUrl": "urn:uuid:de45db8b-8e3f-404e-a7af-910a289eeb8c",
      "resource": {
        "resourceType": "Patient",
        "identifier": [
          {
            "system": "http://hospital1.gob.ar/pacientes",
            "value": "7699001",
            "use": "usual"
          },
          {
            "system": "http://renaper.gob.ar/dni",
            "value": "99990001",
            "use": "official"
          }
        ],
        "name": [
          {
            "family": "PRUEBAMA",
            "_family": {
              "extension": [
                {
                  "url": "http://recuperocaba.gob.ar/StructureDefinition/ExtensionFathersFamilyName",
                  "valueString": "PRUEBAPA"
                },
                {
                  "url": "http://recuperocaba.gob.ar/StructureDefinition/ExtensionMothersFamilyName",
                  "valueString": "PRUEBAMA"
                }
              ]
            },
            "given": ["FLORENCIA", "BELEN"]
          },
          {
            "use": "usual",
            "given": ["BELU"]
          }
        ],
        "gender": "female",
        "birthDate": "1990-01-01"
      }
    }
  ]
}
```

## Consideraciones de Implementación

1. **UUIDs**: Todos los recursos usan UUIDs fijos para referencias consistentes
2. **Perfiles**: Cada recurso debe usar el perfil específico de CABA
3. **Sistemas de Códigos**: Se utilizan los sistemas de códigos locales de CABA
4. **Extensiones**: Se aplican extensiones específicas para nombres de familia
5. **Timestamps**: Se generan dinámicamente al crear el bundle

## Validación del Mapeo

El mapeo debe validarse contra:
- Los perfiles FHIR de CABA
- Las reglas de negocio del recupero
- La consistencia de referencias entre recursos
- La conformidad con los sistemas de códigos utilizados 