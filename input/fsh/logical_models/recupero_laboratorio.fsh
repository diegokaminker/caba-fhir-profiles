Logical: RecuperoLaboratorioSolicitud
Parent: Base
Description: "Representa una solicitud de recupero de gastos de laboratorio, incluyendo la información relevante"

* DatosPaciente 1..1 BackboneElement "Información del Paciente"
  * idPaciente 1..1 BackboneElement "Identificador único para el paciente"
  * apellidoPaciente 1..1 string "Apellido(s) del paciente"
  * otroApellidoPaciente 0..1 string "Otro(s) apellido(s) del paciente"
  * nombrePaciente 1..1 string "Nombre(s) del paciente"
  * otroNombrePaciente 0..1 string "Otro(s) nombre(s) del paciente"
  * nombreAutopercibidoPaciente 0..1 string "Nombre autopercibido o preferido del paciente"
  * tipoDocumentoPaciente 1..1 string "Tipo de documento de identificación del paciente (ej., DNI, Pasaporte)"
  * documentoPaciente 1..1 string "Número de documento de identificación del paciente"
  * codSexoPaciente 1..1 string "Sexo del paciente (ej., Masculino, Femenino, Otro)"
  * fechaNacimientoPaciente 1..1 date "Fecha de nacimiento del paciente"

* DatosContexto 1..1 BackboneElement "Contexto del Servicio Realizado"
  * codAmbito 1..1 string "Contexto de la solicitud (ej., Guardia, Internación, Ambulatorio)"
  * idEpisodio 0..1 string "Identificador del episodio clínico, si aplica"
  * desEfectorProcesamiento 0..1 string "Efector o instalación de salud donde se tomó la muestra"
  * desAmbitoDetalle 0..1 string "Descripción detallada del ámbito de la solicitud"
  * desServicioDetalle 0..1 string "Servicio o área jerárquica donde se originó la solicitud"
  * desAreaJerarquicaSolicitud 0..1 string "Área jerárquica de la solicitud"
  * idPedido 1..1 string "Identificador de la solicitud (Id_solicitud)"

* DiagnosticoPresuntivo 1..1 BackboneElement "Información de Diagnósticos"
  * codDiagnosticoTm 0..1 string "Identificador del código de diagnóstico local"
  * desDiagnosticoTm 0..1 string "Descripción del diagnóstico local"
  * codDiagnosticoSnomed 0..1 string "Identificador SNOMED CT para el diagnóstico"
  * desDiagnosticoSnomed 0..1 string "Descripción SNOMED CT para el diagnóstico"

* ProfesionalSolicitante 1..1 BackboneElement "Información del Profesional (Solicitante)"
  * codProfesionSolicitante 0..1 string "Identificador de la profesión del profesional solicitante"
  * desProfesionSolicitante 0..1 string "Profesión del profesional solicitante"
  * codTipoMatriculaSolicitante 0..1 string "Tipo de matrícula profesional del profesional solicitante"
  * idMatriculaSolicitante 0..1 string "Número de matrícula del profesional solicitante"

* ProfesionalEfector 1..1 BackboneElement "Información del Profesional (Firmante/Atendedor)"
  * codProfesionFirmante 0..1 string "Identificador de la profesión del profesional firmante/atendedor"
  * desProfesionFirmante 0..1 string "Profesión del profesional firmante/atendedor"
  * profesional 0..1 string "Nombre del profesional firmante/atendedor"
  * codTipoMatriculaFirmante 0..1 string "Identificador de la matrícula del profesional firmante/atendedor"
  * idMatriculaFirmante 0..1 string "Número de matrícula del profesional firmante/atendedor"

* FechasServicio 1..1 BackboneElement "Fechas del Servicio Realizado"
  * fechaMuestra 0..1 date "Fecha en que se tomó la muestra"
  * fechaResultado 0..1 date "Fecha en que se obtuvo el resultado"

* DatosCobertura 1..1 BackboneElement "Cobertura del Servicio"
  * codCobertura 0..1 string "Codigo de Cobertura"
  * desCobertura 0..1 string "Descripción de la cobertura/seguro del paciente"
  * idCobertura 0..1 string "Numero de Carnet del Paciente"

* documentacionAuditoria 0..* string "Archivos Adjuntos Documentando Servicio"

// Array anidado para Prestaciones (Servicios/Procedimientos)
* prestaciones 0..* RecuperoLaboratorioPrestacion "Lista de servicios/procedimientos solicitados"

Logical: RecuperoLaboratorioPrestacion
Parent: Base
Description: "Representa un único servicio o procedimiento"
* codPrestacion 1..1 string "Identificador de la prestación/procedimiento"
* desPrestacion 1..1 string "Descripción de la prestación/procedimiento"
* codSnomed 0..1 string "Identificador SNOMED CT para la prestación/procedimiento"
* desPrestacionSnomed 0..1 string "Descripción SNOMED CT para la prestación/procedimiento"


