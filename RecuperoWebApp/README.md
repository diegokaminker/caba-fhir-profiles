# Recupero Web App

Una aplicación web completa para generar y enviar bundles FHIR de recupero de manera aleatoria o manual.

## Características

### 🎯 Funcionalidades Principales

1. **Configuración de Servidor FHIR**
   - URL configurable del servidor FHIR (sin /metadata)
   - Prueba de conectividad en tiempo real (agrega /metadata automáticamente)
   - Servidor por defecto: `https://fhirserver.hl7fundamentals.org/fhir`

2. **Dos Modos de Operación**
   - **Modo Aleatorio**: Genera bundles completamente aleatorios con un solo clic
   - **Modo Manual**: Permite selección manual de todos los elementos

3. **Listas Maestras Disponibles**
   - **Coberturas**: Medifé, OSDE, Swiss Medical, Galeno, Omint, Particular
   - **Diagnósticos**: Hipertensión, Diabetes, EPOC, Cardiopatía, Dislipidemia
   - **Procedimientos**: 20+ estudios de laboratorio (Glucosa, Creatinina, Hemograma, etc.)
   - **Tipos de Documento**: DNI, Pasaporte, Libreta Cívica, Libreta de Enrolamiento
   - **Tipos de Matrícula**: Ministerio de Salud CABA, Colegio de Bioquímicos
   - **Profesiones**: Médico, Bioquímico, Farmacéutico, Enfermero

4. **Entidades Disponibles**
   - **50 Pacientes**: Nombres españoles, fechas de nacimiento, géneros, DNIs
   - **50 Profesionales**: Clínicos y bioquímicos con matrículas
   - **3 Sitios Ejecutantes**: Laboratorios
   - **3 Sitios Solicitantes**: Hospitales

### 🔧 Funcionalidades Técnicas

- **Generación de Identificadores Únicos**: Siguiendo las convenciones de nombres definidas
- **Generación de PDF**: Adjuntos automáticos o manuales
- **Fechas Aleatorias**: Cerca de la fecha actual pero algunos días antes
- **Envío al Servidor FHIR**: POST automático de bundles
- **Reportes de Resultados**: Feedback completo del proceso

## Estructura del Proyecto

```
RecuperoWebApp/
├── index.html          # Página principal
├── app.js             # Lógica de la aplicación
├── styles.css         # Estilos personalizados
└── README.md          # Documentación
```

## Convenciones de Nombres

### Identificadores de Pacientes
- **DNI**: `http://renaper.gob.ar/dni`
- **Interno**: `http://[laboratorio].gob.ar/pacientes`

### Identificadores de Matrículas
- **Solicitante**: `http://recupero.gob.ar/matriculas/10006441714000`
- **Firmante**: `http://recupero.gob.ar/matriculas/75060562116524`

### Identificadores de Coberturas
- **Formato**: `http://recupero.gob.ar/coberturas/[CODIGO]`
- **Ejemplo**: `http://recupero.gob.ar/coberturas/MP056`

## Uso

### Modo Aleatorio
1. Asegúrate de que el servidor FHIR esté configurado correctamente
2. **Selecciona el modo aleatorio** usando el toggle
3. Haz clic en "Generar Bundle Aleatorio"
4. La aplicación seleccionará automáticamente todos los elementos
5. Haz clic en "Generar Bundle y Enviar al Servidor"

### Modo Manual
1. **Selecciona el modo manual** usando el toggle
2. Selecciona manualmente cada elemento:
   - Paciente
   - Solicitante (Clínico)
   - Ejecutante (Bioquímico)
   - Sitios (Solicitante y Ejecutante)
   - Cobertura
   - Prestaciones (3-20)
3. Opcionalmente, sube un archivo PDF
4. Haz clic en "Generar Bundle y Enviar al Servidor"

## Tecnologías Utilizadas

- **HTML5**: Estructura de la página
- **CSS3**: Estilos y diseño responsivo
- **JavaScript ES6+**: Lógica de la aplicación
- **Bootstrap 5**: Framework CSS para el diseño
- **Font Awesome**: Iconos
- **jsPDF**: Generación de PDFs
- **Fetch API**: Comunicación con servidor FHIR

## Instalación y Uso

1. **Clonar o descargar** el proyecto
2. **Abrir** `index.html` en un navegador web moderno
3. **Configurar** la URL del servidor FHIR si es necesario
4. **Probar** la conexión al servidor
5. **Usar** en modo aleatorio o manual

## Requisitos del Navegador

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Estructura del Bundle FHIR

La aplicación utiliza el template oficial `Bundle-RecuperoCABABundleEjemplo.json` y genera bundles que incluyen:

- **Bundle**: Contenedor principal con metadatos y profile de CABA
- **Claim**: Reclamo principal con prestaciones y diagnósticos
- **Patient**: Paciente con identificadores DNI e interno
- **ServiceRequest**: Solicitud de servicio con referencias
- **Encounter**: Encuentro clínico ambulatorio
- **Practitioner** (2): Profesional firmante (bioquímico) y solicitante (médico)
- **DocumentReference**: Documentación adicional con PDF adjunto

### Profiles Utilizados
- `http://recuperocaba.gob.ar/StructureDefinition/BundleCabaRecupero`
- `http://recuperocaba.gob.ar/StructureDefinition/ClaimCabaRecupero`
- `http://recuperocaba.gob.ar/StructureDefinition/PatientCabaRecupero`
- `http://recuperocaba.gob.ar/StructureDefinition/ServiceRequestCabaRecupero`
- `http://recuperocaba.gob.ar/StructureDefinition/EncounterCabaRecupero`
- `http://recuperocaba.gob.ar/StructureDefinition/PractitionerCabaRecupero`

## Personalización

### Agregar Nuevos Elementos

Para agregar nuevos elementos a las listas, edita el archivo `app.js`:

```javascript
// Agregar nueva cobertura
this.masterLists.coberturas.push({
    code: 'NUEVO',
    display: 'Nueva Cobertura'
});

// Agregar nuevo paciente
this.entityLists.patients.push({
    name: 'Nuevo Paciente',
    birthDate: '1990-01-01',
    gender: 'male',
    dni: '12345678',
    internalId: 'P999'
});
```

### Modificar Servidor FHIR

Cambia la URL por defecto en `app.js`:

```javascript
this.fhirServer = 'https://tu-servidor-fhir.com/fhir';
```

## Soporte

Para reportar problemas o solicitar nuevas funcionalidades, contacta al equipo de desarrollo.

## Licencia

Este proyecto está desarrollado para uso interno del sistema de recupero. 