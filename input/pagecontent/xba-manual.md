# Manual X-BA - Sistema de Interoperabilidad de la Ciudad de Buenos Aires

## Versiones

| Fecha | N° de Versión | Detalle |
|-------|---------------|---------|
| 2024/01/23 | 1.0.0 | Creación del manual |

## Índice

1. [Introducción](#introducción)
2. [Sistema de Interoperabilidad](#sistema-de-interoperabilidad)
3. [Estructura de Implementación X-BA](#estructura-de-implementación-x-ba)
4. [Adhesión como Organización Miembro a X-BA](#adhesión-como-organización-miembro-a-x-ba)
5. [Gestión de X-BA](#gestión-de-x-ba)
6. [Implementación de Casos de Uso en X-BA](#implementación-de-casos-de-uso-en-x-ba)
7. [Suspensión y Exclusión del Sistema X-BA](#suspensión-y-exclusión-del-sistema-x-ba)

---

## Introducción

El siguiente manual proporciona una guía completa y detallada sobre X-BA, el sistema de interoperabilidad implementado en la Ciudad de Buenos Aires por la Secretaría de Innovación y Transformación Digital. El objetivo principal es facilitar la comprensión y aplicación por parte de los usuarios. Se presenta dividido en 6 secciones:

### Sección 1: Sistema de Interoperabilidad
Esta sección se enfoca en resaltar la relevancia de los sistemas de interoperabilidad, explorando aspectos cruciales como su definición, implementación a nivel mundial, y el caso específico del sistema de interoperabilidad en la Ciudad Autónoma de Buenos Aires (X-BA). Proporciona una visión completa de la interoperabilidad y su aplicación práctica, subrayando la importancia de estos sistemas para la conectividad y eficiencia en situaciones del mundo real.

### Sección 2: Estructura de Implementación X-BA
Detalla los diversos roles principales y sus responsabilidades asociadas, ofreciendo una visión completa de la arquitectura y su funcionamiento en X-BA. Esto establece una base sólida para comprender la implementación del sistema y su estructura integral.

### Sección 3: Adhesión como Organización Miembro a X-BA
Proporciona instrucciones detalladas para que las organizaciones se unan y participen en el sistema de interoperabilidad, fundamental para comprender y utilizar eficazmente X-BA. Además, se incluye un detalle técnico sobre la instalación del servidor de seguridad necesario para operar dentro del ecosistema.

### Sección 4: Gestión de X-BA
Describe en detalle los dos sistemas de gestión para utilizar el sistema de interoperabilidad, incluyendo los objetivos de cada uno, sus componentes y los roles y responsabilidades asociados. Esta información es esencial para una gestión eficiente de X-BA.

### Sección 5: Implementación de Casos de Uso en X-BA
Detalla los pasos desde la detección y análisis hasta la activación de un caso de uso en X-BA. Proporciona recomendaciones tanto a nivel funcional (uso de datos, experiencia de usuario, calidad de datos) como a nivel técnico (protocolos SOAP y REST, adaptación de sistemas, desarrollo de servicios web, mantenimiento y soporte).

### Sección 6: Suspensión o Exclusión del Sistema de Interoperabilidad
Define los criterios y procedimientos para la suspensión o exclusión de una organización miembro de X-BA en caso de incumplimiento de obligaciones, estableciendo sanciones con el objetivo de preservar la calidad del sistema de interoperabilidad en su totalidad.

---

## Sistema de Interoperabilidad

### A. ¿Qué es un sistema de interoperabilidad?

Un sistema de interoperabilidad es una estructura diseñada para permitir la comunicación y el intercambio de información entre diferentes entidades o sistemas, sin importar las diferencias en sus tecnologías, plataformas o protocolos, ya que establece estándares, y define mecanismos de comunicación compatibles y políticas de seguridad consistentes.

Es importante destacar que un sistema de interoperabilidad debe ser:
- **Flexible y adaptable**, capaz de adaptarse a los cambios tecnológicos y a las necesidades futuras
- **Seguro**, garantizando la privacidad y la protección de los datos personales, cumpliendo con las regulaciones y normativas vigentes

Su objetivo principal es facilitar el intercambio eficiente y seguro de información entre los actores, promoviendo la transparencia, facilitando la automatización de procesos y mejorando la experiencia de los ciudadanos.

### B. ¿Qué nos llevó a implementar un sistema de interoperabilidad?

A partir del 2009, el Gobierno de la Ciudad inició una política de modernización, la transición de un modelo tradicional a uno digital. Aunque esto logró agilizar el proceso de acudir a las oficinas públicas, generó un nuevo desafío: la necesidad de integrar los diferentes sistemas de información que se fueron desarrollando de manera independiente.

### C. X-BA: el sistema de interoperabilidad de la Ciudad de Buenos Aires

X-BA es el sistema de interoperabilidad implementado en la Ciudad de Buenos Aires, basado en la tecnología X-Road desarrollada en Estonia. Este sistema permite el intercambio seguro de información entre diferentes entidades gubernamentales y privadas.

---

## Estructura de Implementación X-BA

### A. Roles y responsabilidades en X-BA

#### Operador del sistema de interoperabilidad
- Responsable de la gestión y mantenimiento del sistema central
- Coordina la integración de nuevas organizaciones
- Establece políticas y procedimientos de seguridad

#### Proveedor de servicio de confianza
- Gestiona certificados digitales y autenticación
- Asegura la confidencialidad e integridad de las comunicaciones
- Mantiene la infraestructura de clave pública (PKI)

#### Organizaciones Miembro (OM)
- Entidades que participan en el sistema de interoperabilidad
- Pueden ser proveedores y/o consumidores de servicios
- Deben cumplir con los estándares y políticas establecidas

### B. Arquitectura

La arquitectura de X-BA se basa en una red distribuida de servidores de seguridad que actúan como intermediarios entre las organizaciones participantes.

---

## Adhesión como Organización Miembro a X-BA

### A. Proceso de registro como Organización Miembro

#### Entidades públicas dependientes de la Ciudad de Buenos Aires
- Proceso simplificado de registro
- Integración directa con sistemas existentes
- Soporte técnico especializado

#### Entidades públicas de otras jurisdicciones o entidades privadas
- Proceso de evaluación y aprobación
- Cumplimiento de requisitos de seguridad
- Acuerdos de nivel de servicio

### B. Instalación de servidor de seguridad

Cada organización miembro debe instalar y configurar un servidor de seguridad (Security Server) que actúa como punto de entrada al sistema de interoperabilidad.

---

## Gestión de X-BA

### A. Servidor de seguridad

#### Roles, permisos y responsabilidades
- **Administrador del sistema**: Gestión completa del servidor
- **Administrador de servicios**: Publicación y gestión de servicios
- **Administrador de seguridad**: Configuración de políticas de seguridad

#### Componentes del servidor de seguridad
- **Proxy**: Intermediario para todas las comunicaciones
- **Message Log**: Registro de todas las transacciones
- **Signer**: Firma digital de mensajes
- **Monitor**: Monitoreo del estado del sistema

### B. Portal de Gestión de Servicios de Interoperabilidad

#### Roles y responsabilidades dentro del portal
- **Administrador central**: Gestión de organizaciones y políticas
- **Administrador de organización**: Gestión de subsistemas y servicios
- **Desarrollador**: Implementación de servicios

#### Componentes del Portal de Gestión de Servicios de Interoperabilidad
- Gestión de organizaciones miembro
- Configuración de servicios
- Monitoreo y auditoría
- Gestión de certificados

---

## Implementación de Casos de Uso en X-BA

### A. Detección

#### Mapeo de integración, documentos y datos
Identificación de los sistemas y datos que necesitan ser integrados, así como los documentos y formatos de intercambio requeridos.

### B. Análisis

Evaluación de la viabilidad técnica y funcional del caso de uso, incluyendo análisis de requisitos y diseño de la solución.

### C. Activación

#### Consumo de servicios

##### Servicios REST

Para consumir servicios REST a través del sistema de interoperabilidad X-BA, se debe construir la URL y los headers de la siguiente manera:

**Composición de URL:**
```
[ConnectionType]://[DNS_SecurityServer_Consumer]/[instancia]/[ecosistema]/[MemberClass_Provider]/[MemberCode_Provider]/[SubsystemCode_Provider]/[ServiceCode]
```

**Composición de Header:**
- **Key:** `X-Road-Client`
- **Value:** `[ecosistema]/[MemberClass]/[MemberCode_Consumer]/[SubsystemCode_Consumer]`

**Ejemplo práctico:**

Supongamos que queremos consultar el servicio `DeudorMoroso` del Ministerio de Justicia y Seguridad desde diferentes consumidores:

| SS CONSUMER   | API                                                                                                   | VALUE HEADER                        |
|---------------|-------------------------------------------------------------------------------------------------------|-------------------------------------|
| Innovación    | `https://xroad-innovacion.buenosaires.gob.ar/r1/edicaba/GOB/020/Prov-RDAM-Prd/DeudorMoroso`           | `edicaba/GOB/002/Cons-TAD-Prd`      |
| Educación     | `https://xroad-educacion.buenosaires.gob.ar/r1/edicaba/GOB/020/Prov-RDAM-Prd/DeudorMoroso`            | `edicaba/GOB/006/Cons-TAD-Prd`      |

> **Nota:** El valor del header depende del subsistema habilitado como consumidor.

##### Servicios SOAP

El consumo de servicios SOAP se realiza de manera diferente, ya que los datos de los servidores, subsistemas y servicios no se cargan en la URL, sino que se arman en el body.

**URL:** Únicamente se utiliza el DNS del servidor consumidor del servicio
```
https://xroad-innovacion.buenosaires.gob.ar
```

**Body de la consulta:**
```xml
<SOAP-ENV:Header>
<xrd:client iden:objectType="SUBSYSTEM">
<iden:xRoadInstance>[Ecosistema]</iden:xRoadInstance>
<iden:memberClass>[MemberClass]</iden:memberClass>
<iden:memberCode>[MemberCode_Cons]</iden:memberCode>
<iden:subsystemCode>[SubsystemCode_Cons]</iden:subsystemCode>
</xrd:client>
<xrd:service iden:objectType="SERVICE">
<iden:xRoadInstance>[Ecosistema]</iden:xRoadInstance>
<iden:memberClass>[MemberClass]</iden:memberClass>
<iden:memberCode>[MemberCode_Prov]</iden:memberCode>
<iden:subsystemCode>[SubsystemCode_Prov]</iden:subsystemCode>
<iden:serviceCode>[ServiceCode]</iden:serviceCode>
</xrd:service>
<xrd:userId>tuser</xrd:userId>
<xrd:id>ID11234</xrd:id>
<xrd:protocolVersion>4.0</xrd:protocolVersion>
</SOAP-ENV:Header>
```

Debajo se deberá agregar el body específico del servicio que se quiere consumir.

### D. Buenas prácticas y recomendaciones

#### Funcionales

**Uso ético de datos**
La Organización Miembro dueña del servicio debe analizar las solicitudes que recibe de otras OM, y cumplir con las leyes de protección de datos personales al habilitar cualquier acceso. También puede establecer condiciones de uso de los datos para cada integración.

#### Técnicas

- **Protocolos de comunicación**: Utilizar estándares abiertos y bien documentados
- **Seguridad**: Implementar autenticación y autorización robustas
- **Monitoreo**: Establecer sistemas de monitoreo y alertas
- **Documentación**: Mantener documentación actualizada de los servicios
- **Versionado**: Implementar estrategias de versionado para los servicios

---

## Suspensión y Exclusión del Sistema X-BA

El sistema establece criterios y procedimientos para la suspensión o exclusión de una organización miembro en caso de incumplimiento de obligaciones, estableciendo sanciones con el objetivo de preservar la calidad del sistema de interoperabilidad en su totalidad.

### Criterios de suspensión

- Incumplimiento de políticas de seguridad
- Uso indebido de los servicios
- Violación de acuerdos de nivel de servicio
- Falta de mantenimiento de la infraestructura

### Procedimientos

1. **Notificación**: Comunicación formal del problema
2. **Período de corrección**: Tiempo para resolver el problema
3. **Suspensión temporal**: Bloqueo temporal del acceso
4. **Exclusión definitiva**: En caso de no resolución
