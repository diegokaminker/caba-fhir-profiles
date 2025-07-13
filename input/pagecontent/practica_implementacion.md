# Guía de Implementación - Práctica Recupero CABA

Este documento demuestra las técnicas utilizadas para la generación de guías de implementación HL7 FHIR, incluyendo ejemplos prácticos del proyecto Recupero CABA.

> **Nota:** Cualquier coincidencia con proyectos reales es pura coincidencia. Está prohibido utilizar cualquiera de los artefactos que acompañan esta guía con pacientes reales, ya que se trata de una guía realizada con objetivos didácticos.

## Índice Temático

### Técnicas de IG Publisher
- [Páginas Adicionales y Menú](#páginas-adicionales-y-menú)
- [Logo y Template Personalizado](#logo-y-template-personalizado)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Subir Recursos de Conformidad](#subir-recursos-de-conformidad)
- [Incluir Imágenes](#incluir-imágenes)
- [URL Canónica](#url-canónica)

### Técnicas de FSH
- [Modelos Lógicos](#modelos-lógicos)
- [Restricciones a Nivel de Recurso](#restricciones-a-nivel-de-recurso)
- [Restricciones a Nivel de Elemento](#restricciones-a-nivel-de-elemento)
- [Slicing](#slicing)
- [Restricciones Terminológicas](#restricciones-terminológicas)
- [Definición de Extensiones](#definición-de-extensiones)
- [Definición y Validación de Bundles](#definición-y-validación-de-bundles)
- [Definición de Alias](#definición-de-alias)
- [Definición de Ejemplos](#definición-de-ejemplos)
- [Definición de Naming Systems](#definición-de-naming-systems)

### Implementaciones de Referencia
- [Clientes](#clientes)
- [Servidores](#servidores)
- [Otros Actores](#otros-actores)

---

## Técnicas de IG Publisher

### Páginas Adicionales y Menú

Se pueden agregar páginas adicionales al IG y configurar el menú de navegación.

**Configuración en sushi-config.yaml:**

```yaml
menu:
  Home: index.html
  Artefactos: artifacts.html
  Casos de Uso: casosdeuso.html
  Modelo Lógico: modelologico.html
```

**Páginas en input/pagecontent/:**
- `index.md` - Página principal
- `modelologico.md` - Documentación del modelo lógico
- `practica_implementacion.md` - Esta guía de implementación

### Logo y Template Personalizado

Se puede personalizar el logo y usar templates diferentes al default.

> **Implementado:** Se utiliza el template default de HL7, pero se puede personalizar agregando archivos en `input/includes/` y `input/assets/`.

### Estructura de Carpetas

Organización de archivos siguiendo las convenciones de IG Publisher.

```
input/
├── fsh/
│   ├── logical_models/     # Modelos lógicos
│   ├── profiles/          # Perfiles FHIR
│   ├── extensions/        # Extensiones personalizadas
│   ├── examples/          # Ejemplos de recursos
│   ├── terminology/       # CodeSystems y ValueSets
│   ├── alias/            # Definiciones de alias
│   └── naming_systems/   # Sistemas de nombres
├── pagecontent/          # Páginas de documentación
├── images/              # Imágenes generadas
├── images_source/       # Fuentes de diagramas PlantUML
└── includes/            # Archivos incluidos
```

### Subir Recursos de Conformidad

Scripts para subir recursos de conformidad al servidor FHIR.

**Script uploadig.sh:**
```bash
#!/bin/bash
# Sube recursos individuales al servidor FHIR
# Uso: ./uploadig.sh [folder_path] [server_url]

# Verifica existencia y sube CodeSystems, ValueSets, StructureDefinitions
```

**Script verify_upload.sh:**
```bash
#!/bin/bash
# Verifica que todos los recursos estén correctamente subidos
# Genera reporte de estado de cada recurso
```

### Incluir Imágenes

Inclusión de diagramas PlantUML en la documentación.

**Sintaxis en markdown:**
```markdown
![MindMap](recupero_laboratorio_mindmap.svg)
```

**Diagramas creados:**
- Mindmap general del modelo
- Diagramas detallados de cada backbone element
- Fuentes en `input/images_source/`

### URL Canónica

Configuración de la URL canónica del Implementation Guide.

```yaml
canonical: http://recuperocaba.gob.ar
```

---

## Técnicas de FSH

### Modelos Lógicos

Definición de modelos lógicos para representar necesidades de negocio.

**Ejemplo: RecuperoLaboratorioSolicitud**

```fsh
Logical: RecuperoLaboratorioSolicitud
Parent: Base
Description: "Representa una solicitud de recupero de gastos de laboratorio"

* DatosPaciente 1..1 BackboneElement "Información del Paciente"
  * apellidoPaciente 1..1 string "Apellido(s) del paciente"
  * nombrePaciente 1..1 string "Nombre(s) del paciente"
  // ... más elementos
```

> **Propósito:** Los modelos lógicos representan las necesidades del negocio previo a su estandarización utilizando FHIR, y no constituyen artefactos de interoperabilidad.

### Restricciones a Nivel de Recurso

Definición de perfiles que restringen recursos FHIR base.

**Ejemplo: Perfil de Patient**

```fsh
Profile: CABA-RecuperoPatient
Parent: Patient
Id: caba-recupero-patient
Title: "CABA Recupero Patient"
Description: "Perfil de paciente para el sistema de recupero de CABA"
```

**Perfiles implementados:**
- `caba-recupero-patient.fsh` - Perfil de paciente
- `caba-recupero-claim.fsh` - Perfil de claim
- `caba-recupero-practitioner.fsh` - Perfil de profesional
- `caba-recupero-bundle.fsh` - Perfil de bundle

### Restricciones a Nivel de Elemento

Restricciones específicas en elementos de recursos FHIR.

**Ejemplo: Restricción en nombre del paciente**

```fsh
* name 1..* HumanName "Nombre completo del paciente"
  * family 1..1 string "Apellido del paciente"
  * given 1..* string "Nombre(s) del paciente"
  * extension contains
    caba-recupero-fathersfamilyname named fathersFamilyName 0..1
    caba-recupero-mothersfamilyname named mothersFamilyName 0..1
```

### Slicing

Técnica para dividir arrays en subconjuntos específicos.

> **Ejemplo:** Slicing en identificadores del paciente para separar DNI de identificadores internos del sistema.

### Restricciones Terminológicas

Definición de CodeSystems y ValueSets para estandarizar terminología.

**CodeSystems implementados:**
- `caba-recupero-profesiones.fsh` - Profesiones médicas
- `caba-recupero-coberturas.fsh` - Tipos de cobertura
- `caba-recupero-procedimientos.fsh` - Procedimientos de laboratorio
- `caba-recupero-diagnostico.fsh` - Diagnósticos

**Ejemplo de CodeSystem:**

```fsh
CodeSystem: CABA-RecuperoProfesiones
Id: caba-recupero-profesiones
Title: "CABA Recupero Profesiones"
Description: "Códigos de profesiones médicas para el sistema de recupero"
* #MED "Médico"
* #BIO "Bioquímico"
* #ENF "Enfermero"
```

### Definición de Extensiones

Extensiones personalizadas para agregar elementos específicos del dominio.

**Extensiones implementadas:**
- `caba-recupero-fathersfamilyname.fsh` - Apellido paterno
- `caba-recupero-mothersfamilyname.fsh` - Apellido materno

**Ejemplo de extensión:**

```fsh
Extension: CABA-RecuperoFathersFamilyName
Id: caba-recupero-fathersfamilyname
Title: "CABA Recupero Father's Family Name"
Description: "Apellido paterno del paciente"
* value[x] only string
```

### Definición y Validación de Bundles

Definición de bundles para agrupar recursos relacionados.

**Perfil de Bundle:**

```fsh
Profile: CABA-RecuperoBundle
Parent: Bundle
Id: caba-recupero-bundle
Title: "CABA Recupero Bundle"
Description: "Bundle para solicitudes de recupero de laboratorio"

* type = #collection
* entry 1..* BackboneElement
  * resource 1..1 Resource
```

### Definición de Alias

Definición de alias para simplificar referencias en FSH.

> **Implementado:** Se pueden definir alias en `input/fsh/alias/` para simplificar referencias a recursos y terminologías frecuentemente utilizadas.

### Definición de Ejemplos

Ejemplos de recursos que cumplen con los perfiles definidos.

**Ejemplo implementado:**
- `ejemplo-1-recupero-claim.fsh` - Ejemplo completo de claim con todos los recursos

```fsh
Instance: ejemplo-1-recupero-claim
InstanceOf: CABA-RecuperoClaim
Title: "Ejemplo 1 - Recupero Claim"
Description: "Ejemplo completo de una solicitud de recupero"
```

### Definición de Naming Systems

Definición de sistemas de nombres para identificadores específicos del dominio.

> **Implementado:** Se pueden definir naming systems en `input/fsh/naming_systems/` para estandarizar identificadores como DNIs, matrículas profesionales, etc.

---

## Implementaciones de Referencia

### Clientes

Implementaciones de clientes para interactuar con el sistema de recupero.

**RecuperoWebApp:**
- Aplicación web para generar bundles de recupero
- Modo aleatorio y manual de generación
- Integración con servidor FHIR
- Generación de PDFs como attachments

**RecuperoViewer:**
- Visor web para consultar bundles del servidor
- Filtrado por fechas
- Visualización detallada de recursos
- Interfaz en español

### Servidores

Configuración y uso de servidores FHIR para el sistema de recupero.

**Servidor de prueba:**
```
https://fhirserver.hl7fundamentals.org/fhir
```

**Scripts de gestión:**
- `uploadig.sh` - Subida de recursos de conformidad
- `verify_upload.sh` - Verificación de recursos subidos

### Otros Actores

Otros componentes del ecosistema de recupero.

**Componentes adicionales:**
- **Template:** Plantillas JSON para generación de bundles
- **Scripts de generación:** Herramientas para crear datos de prueba
- **Documentación:** Guías de implementación generadas automáticamente

---

## Conclusión

Esta práctica demuestra la implementación completa de un sistema de recupero de laboratorio utilizando estándares HL7 FHIR, desde la definición de modelos lógicos hasta la implementación de clientes y servidores de referencia.

Cada técnica mostrada en esta guía ha sido implementada y probada en el contexto del proyecto Recupero CABA, proporcionando ejemplos prácticos y reales de cómo aplicar las mejores prácticas de desarrollo de Implementation Guides FHIR. 