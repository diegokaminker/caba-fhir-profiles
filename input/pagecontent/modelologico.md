# Modelo Lógico - RecuperoLaboratorioSolicitud

## Descripción General

El modelo lógico `RecuperoLaboratorioSolicitud` representa una solicitud de recupero de gastos de laboratorio, incluyendo toda la información relevante para el procesamiento y auditoría del servicio.

## Estructura General del Modelo

![MindMap](recupero_laboratorio_mindmap.svg)


## Elementos del Modelo

### 1. DatosPaciente

Información completa del paciente que recibe el servicio de laboratorio.

![MindMap](datos_paciente.svg)


| Campo | Tipo | Cardinalidad | Descripción |
|-------|------|--------------|-------------|
| idPaciente | BackboneElement | 1..1 | Identificador único para el paciente |
| apellidoPaciente | string | 1..1 | Apellido(s) del paciente |
| otroApellidoPaciente | string | 0..1 | Otro(s) apellido(s) del paciente |
| nombrePaciente | string | 1..1 | Nombre(s) del paciente |
| otroNombrePaciente | string | 0..1 | Otro(s) nombre(s) del paciente |
| nombreAutopercibidoPaciente | string | 0..1 | Nombre autopercibido o preferido del paciente |
| tipoDocumentoPaciente | string | 1..1 | Tipo de documento de identificación del paciente (ej., DNI, Pasaporte) |
| documentoPaciente | string | 1..1 | Número de documento de identificación del paciente |
| codSexoPaciente | string | 1..1 | Sexo del paciente (ej., Masculino, Femenino, Otro) |
| fechaNacimientoPaciente | date | 1..1 | Fecha de nacimiento del paciente |

### 2. DatosContexto

Contexto del servicio realizado, incluyendo información sobre el ámbito, efector y servicio.

![MindMap](datos_contexto.svg)

| Campo | Tipo | Cardinalidad | Descripción |
|-------|------|--------------|-------------|
| codAmbito | string | 1..1 | Contexto de la solicitud (ej., Guardia, Internación, Ambulatorio) |
| idEpisodio | string | 0..1 | Identificador del episodio clínico, si aplica |
| desEfectorProcesamiento | string | 0..1 | Efector o instalación de salud donde se tomó la muestra |
| desAmbitoDetalle | string | 0..1 | Descripción detallada del ámbito de la solicitud |
| desServicioDetalle | string | 0..1 | Servicio o área jerárquica donde se originó la solicitud |
| desAreaJerarquicaSolicitud | string | 0..1 | Área jerárquica de la solicitud |
| idPedido | string | 1..1 | Identificador de la solicitud (Id_solicitud) |

### 3. DiagnosticoPresuntivo

Información de diagnósticos asociados al servicio de laboratorio.

![MindMap](diagnostico_presuntivo.svg)

| Campo | Tipo | Cardinalidad | Descripción |
|-------|------|--------------|-------------|
| codDiagnosticoTm | string | 0..1 | Identificador del código de diagnóstico local |
| desDiagnosticoTm | string | 0..1 | Descripción del diagnóstico local |
| codDiagnosticoSnomed | string | 0..1 | Identificador SNOMED CT para el diagnóstico |
| desDiagnosticoSnomed | string | 0..1 | Descripción SNOMED CT para el diagnóstico |

### 4. ProfesionalSolicitante

Información del profesional que solicita el servicio de laboratorio.

![MindMap](profesional_solicitante.svg)

| Campo | Tipo | Cardinalidad | Descripción |
|-------|------|--------------|-------------|
| codProfesionSolicitante | string | 0..1 | Identificador de la profesión del profesional solicitante |
| desProfesionSolicitante | string | 0..1 | Profesión del profesional solicitante |
| codTipoMatriculaSolicitante | string | 0..1 | Tipo de matrícula profesional del profesional solicitante |
| idMatriculaSolicitante | string | 0..1 | Número de matrícula del profesional solicitante |

### 5. ProfesionalEfector

Información del profesional que firma o atiende el servicio (firmante/atendedor).

![MindMap](profesional_efector.svg)

| Campo | Tipo | Cardinalidad | Descripción |
|-------|------|--------------|-------------|
| codProfesionFirmante | string | 0..1 | Identificador de la profesión del profesional firmante/atendedor |
| desProfesionFirmante | string | 0..1 | Profesión del profesional firmante/atendedor |
| profesional | string | 0..1 | Nombre del profesional firmante/atendedor |
| codTipoMatriculaFirmante | string | 0..1 | Identificador de la matrícula del profesional firmante/atendedor |
| idMatriculaFirmante | string | 0..1 | Número de matrícula del profesional firmante/atendedor |

### 6. FechasServicio

Fechas relacionadas con el servicio de laboratorio.

![MindMap](fechas_servicio.svg)

| Campo | Tipo | Cardinalidad | Descripción |
|-------|------|--------------|-------------|
| fechaMuestra | date | 0..1 | Fecha en que se tomó la muestra |
| fechaResultado | date | 0..1 | Fecha en que se obtuvo el resultado |

### 7. DatosCobertura

Información de cobertura del servicio.

![MindMap](datos_cobertura.svg)

| Campo | Tipo | Cardinalidad | Descripción |
|-------|------|--------------|-------------|
| codCobertura | string | 0..1 | Código de Cobertura |
| desCobertura | string | 0..1 | Descripción de la cobertura/seguro del paciente |
| idCobertura | string | 0..1 | Número de Carnet del Paciente |

### 8. Prestaciones

Lista de servicios/procedimientos solicitados.

![MindMap](prestaciones.svg)


| Campo | Tipo | Cardinalidad | Descripción |
|-------|------|--------------|-------------|
| prestaciones | RecuperoLaboratorioPrestacion[] | 0..* | Lista de servicios/procedimientos solicitados |

#### RecuperoLaboratorioPrestacion

| Campo | Tipo | Cardinalidad | Descripción |
|-------|------|--------------|-------------|
| codPrestacion | string | 1..1 | Identificador de la prestación/procedimiento |
| desPrestacion | string | 1..1 | Descripción de la prestación/procedimiento |
| codSnomed | string | 0..1 | Identificador SNOMED CT para la prestación/procedimiento |
| desPrestacionSnomed | string | 0..1 | Descripción SNOMED CT para la prestación/procedimiento |

### 9. DocumentacionAuditoria

Archivos adjuntos que documentan el servicio.

![MindMap](documentacion_auditoria.svg)

| Campo | Tipo | Cardinalidad | Descripción |
|-------|------|--------------|-------------|
| documentacionAuditoria | string[] | 0..* | Archivos Adjuntos Documentando Servicio |

## Uso del Modelo

Este modelo lógico se utiliza para representar las necesidades del negocio previo a su estandarización utilizando FHIR, y no constituye un artefacto de interoperabilidad

## Relaciones con FHIR

El modelo lógico `RecuperoLaboratorioSolicitud` se mapea a recursos FHIR específicos:

- **DatosPaciente** → Patient
- **DatosContexto** → Encounter, ServiceRequest
- **DiagnosticoPresuntivo** → Claim
- **ProfesionalSolicitante/ProfesionalEfector** → Practitioner
- **FechasServicio** → ServiceRequest
- **DatosCobertura** → Claim
- **Prestaciones** → Claim
- **DocumentacionAuditoria** → DocumentReference

## Validaciones

El modelo incluye las siguientes validaciones:

- Campos obligatorios (1..1) deben estar presentes
- Campos opcionales (0..1) pueden estar ausentes
- Arrays (0..*) pueden contener múltiples elementos
- Las fechas deben estar en formato ISO 8601
- Los códigos SNOMED CT deben ser válidos. Por el momento no los estamos incluyendo