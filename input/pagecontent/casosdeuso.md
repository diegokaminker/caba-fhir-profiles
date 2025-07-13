# Caso de uso 1: Generación de Solicitudes de Recupero

## Introducción

Este documento tiene como propósito definir los lineamientos para la generación de **Solicitudes de Recupero**. Cada instancia está destinada a contener una solicitud de recupero correspondiente a un pedido completado.
Se establecen aquí las **reglas de estructura, formato y campos mínimos obligatorios** que deben cumplirse para garantizar una correcta interpretación de la información. Asimismo, se brinda un ejemplo de uso con datos simulados para facilitar su implementación.

La actualización de datos se realiza mediente un POST al servidor FHIR de SolicitudesRecupero


### [Sistema Efector] o [SE]: Es el que genera las solicitudes de recupero. Se prevé un sistema por laboratorio.

### [Repositorio Intermedio] o [RI]: Es el que almacena las solicitudes hasta que la organización de facturación las recupera para su procesamiento. También guarda las definiciones terminológicas que permiten validar las solicitudes.

### [Sistema Facturador]  o [SF]: Es el que procesa las solicitudes para su cobranza

I01. [SE] -> [RI]: Envío de Nueva Solicitud de Recupero
```
POST http://fhirserver.hl7fundamentals.org/fhir/Bundle
```
Proveemos un endpoint de acceso libre a efectos de pruebas
- **Endpoint FHIR**: `http://fhirserver.hl7fundamentals.org/fhir/`
- **Tipo de recurso**: `Bundle`
- **Cuerpo del Recurso**: {{Ver Ejemplo de Contenido Bundle}}


I02. [SF] -> [RI]: Consulta de Nuevas Solicitudes de Recupero
GET http://fhirserver.hl7fundamentals.org/fhir/Bundle?_lastUpdated=geYYYY-MM-DDTHH:MM:SS
Siendo YYYY-MM-DDTHH:MM:SS la fecha de la última lectura exitosa
```
Proveemos un endpoint de acceso libre a efectos de pruebas
- **Endpoint FHIR**: `http://fhirserver.hl7fundamentals.org/fhir/`
- **Tipo de recurso**: `Bundle`
- **Cuerpo del Recurso**: {{Ver Ejemplo de Contenido Bundle}}


I03. [SE] -> [RI]: Consulta Terminológica
I04. [SF] -> [RI]: Consulta Terminológica
Estas consultas permiten obtener las listas de conceptos y valores válidos
I02. [SF] -> [RI]: Consulta de Nuevas Solicitudes de Recupero
GET http://fhirserver.hl7fundamentals.org/fhir/Bundle?_lastUpdated=geYYYY-MM-DDTHH:MM:SS
Siendo YYYY-MM-DDTHH:MM:SS la fecha de la última lectura exitosa
```
Proveemos un endpoint de acceso libre a efectos de pruebas
- **Endpoint FHIR**: `http://fhirserver.hl7fundamentals.org/fhir/`
- **Tipo de recurso**: `CodeSystem` o 'ValueSet'
- **Parametros de la Consulta** ?url={url del valueset}
