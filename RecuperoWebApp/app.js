// Recupero Web App - Main JavaScript File

class RecuperoWebApp {
    constructor() {
        this.currentMode = null; // Will be set by user selection
        this.fhirServer = 'https://fhirserver.hl7fundamentals.org/fhir';
        this.currentSelection = {};
        this.selectedProcedures = [];
        
        // Master Lists (from codeSystems)
        this.masterLists = {
            coberturas: [
                { code: 'MP004', display: 'Medicus' },
                { code: 'MP056', display: 'Medifé' },
                { code: 'OS001', display: 'OSDE' },
                { code: 'SW001', display: 'Swiss Medical' },
                { code: 'GA001', display: 'Galeno' },
                { code: 'OM001', display: 'Omint' },
                { code: 'PA001', display: 'Particular' }
            ],
            diagnostico: [
                { code: 'I10', display: 'Hipertensión esencial' },
                { code: 'E11', display: 'Diabetes mellitus tipo 2' },
                { code: 'J44', display: 'EPOC' },
                { code: 'I25', display: 'Enfermedad cardíaca isquémica' },
                { code: 'E78', display: 'Dislipidemia' }
            ],
            procedimientos: [
                { code: '133', display: 'CALCEMIA TOTAL (CA)' },
                { code: '136', display: 'CALCIO - URINARIO' },
                { code: '144', display: 'CEA - ANTIGENO CARCINOEMBRIOGENICO' },
                { code: '171', display: 'COAGULOGRAMA' },
                { code: '174', display: 'COLESTEROL TOTAL' },
                { code: '189', display: 'CORTISOL' },
                { code: '190', display: 'CPK' },
                { code: '192', display: 'CREATININA' },
                { code: '193', display: 'CREATININA, CLEARENCE DE DEPURACION' },
                { code: '2004', display: 'APOLIPOPROTEINA A (APO A)' },
                { code: '2005', display: 'APOLIPOPROTEINA B (APO B)' },
                { code: '2006', display: 'FOLICO, ACIDO' },
                { code: '2007', display: 'ASCORBICO, ACIDO' },
                { code: '2014', display: 'COLESTEROL HDL. (HDL-C)' },
                { code: '2015', display: 'LDL COLESTEROL' },
                { code: '2020', display: 'VITAMINA D 25 (OH)' },
                { code: '2024', display: 'DEHIDROEPIANDROSTERONA, SULFATO - DHEA-S' },
                { code: '2026', display: 'ANDROSTENEDIONA, DELTA 4 - (DELTA4)' },
                { code: '2040', display: 'FERRITINA' },
                { code: '2043', display: 'SUBUNIDAD BETA DE GONADOTROFINA CORIÓNICA (CUANTIT' },
                { code: '2045C', display: 'HEMOGLOBINA GLICOSILADA (HB A1C)' },
                { code: '2052', display: 'MARCADOR TUMORAL DE COLON (CA. 19. 9)' },
                { code: '2053', display: 'MARCADOR TUMORAL DE OVARIO (CA 125)' },
                { code: '2063', display: 'OSTEOCALCINA' },
                { code: '2064', display: 'PEPTIDO C' },
                { code: '2078', display: 'TESTOSTERONA LIBRE, TO-L' },
                { code: '2084', display: 'VITAMINA B12' },
                { code: '2095', display: 'TESTOSTERONA BIODISPONIBLE' },
                { code: '2096', display: 'ZINC (ZN) - SERICO' },
                { code: '2111', display: 'GLOBULINA LIGADORA DE ANDROGENOS Y ESTROGENOS (GLA' },
                { code: '2146', display: 'ANTICOAGULANTE LUPICO, SIN INHIBICIÒN' },
                { code: '21471', display: 'CARDIOLIPINAS, AC. IGG ANTI-' },
                { code: '21472', display: 'CARDIOLIPINAS, AC. IGM ANTI-' },
                { code: '2155', display: 'VITAMINA B6 (PIRIDOXINA)' },
                { code: '2181', display: 'PEROXIDASA TIROIDEO, AC. ANTI- (ATPO / TPO)' },
                { code: '2182', display: 'TIROGLOBULINA, AC. ULTRASENSIBLE' },
                { code: '2227', display: 'PROGESTERONA (Monitoreo de ovulación)' },
                { code: '2250', display: 'SELENIO' },
                { code: '2263', display: 'LIPOPROTEINA A - LP(A)' },
                { code: '2302U', display: 'PROTEINA C REACTIVA - ULTRASENSIBLE (PCRUS)' },
                { code: '2373', display: 'PROTEINA C FUNCIONAL - CROMOGENICO' },
                { code: '2374', display: 'PROTEINA S LIBRE = INMUNOTURBIDIMETRIO' },
                { code: '241', display: 'CHAGAS (AD)' },
                { code: '2494', display: 'HOMOCISTEINA' },
                { code: '2529', display: 'FOSFOLIPIDOS, AC TOTALES ANTI- (IGA, IGG, IGM)' },
                { code: '2562', display: 'BETA CROSS LAPS - CTX - C- TELOPEPTIDO DE COLAGENO' },
                { code: '2676', display: 'ANTIGENO PROSTATICO ESPECIFICO LIBRE + TOTAL (PSA-' },
                { code: '2798', display: 'MICROALBUMINURIA / ALBUMINA URINARIA' },
                { code: '2872', display: 'TRIIODOTIRONINA LIBRE (T3L)' },
                { code: '297', display: 'ERITROSEDIMENTACION DE 1? HO' },
                { code: '300', display: 'ESTRADIOL' },
                { code: '3006', display: 'CITOMEGALOVIRUS, AC. IGG ANTI- (CMV-IGG)' },
                { code: '3014', display: 'HEPATITIS A AC. ANTI- IGG (HVA IGG) Ò AC. TOTALES' },
                { code: '3016', display: 'HEPATITIS B AC. DE SUPERFICIE ANTI- (HBSAC)' },
                { code: '3018', display: 'HEPATITIS B ANTÍGENO DE SUPERFICIE (AG. HBS)' },
                { code: '3019', display: 'Anticuerpos totales anti-CORE de HEPATITIS B HBCG' },
                { code: '3023', display: 'HEPATITIS C AC. IGG ANTI- (HCV AC. IGG)' },
                { code: '3037', display: 'RUBEOLA, AC. IGG ANTI-' },
                { code: '3038', display: 'RUBEOLA, AC. IGM ANTI-' },
                { code: '3042', display: 'TOXOPLASMOSIS, AC. IGM ANTI (ELISA)' },
                { code: '3052', display: 'SARAMPION, AC. IGM ANTI-' },
                { code: '3053', display: 'SARAMPION, AC. IGG ANTI-' },
                { code: '3091', display: 'TOXOPLASMOSIS, AC. IGG ANTI- (ELISA)' },
                { code: '3108', display: 'VARICELA ZOSTER AC. IGM ANTI-' },
                { code: '3117', display: 'CHAGAS, AC. IGM ANTI- (IFI)' },
                { code: '3130', display: 'VARICELA-ZOSTER, AC. IGG ANTI-' },
                { code: '3144', display: 'CITOMEGALOVIRUS. AC. IGM ANTI- (CMV-IGM)' },
                { code: '343', display: 'FERREMIA' },
                { code: '357', display: 'FOSFATASA ALCALINA (FAL)' },
                { code: '35F', display: 'ANTIBIOGRAMA FLUJO (solo facturacion)' },
                { code: '35M', display: 'ANTIBIOGRAMA DE MOCO (solo facturacion)' },
                { code: '361', display: 'FOSFATASA ALCALINA - ISOENZIMAS' },
                { code: '362', display: 'FOSFATEMIA (P)' },
                { code: '363', display: 'FOSFATURIA (P)' },
                { code: '370', display: 'FSH - HORMONA FOLICULO ESTIMULANTE' },
                { code: '412', display: 'GLUCEMIA' },
                { code: '4120', display: 'INDICE DE INSULINO RESISTENCIA' },
                { code: '420', display: 'GLUTAMIL TRANSPEPTIDASA' },
                { code: '430', display: 'GRAHAM, TEST DE' },
                { code: '433', display: 'GRUPO SANGUINEO Y FACTOR RH' },
                { code: '46', display: 'ANTICUERPOS ANTITIROGLOBULINA (ATG)' },
                { code: '475', display: 'HEMOGRAMA COMPLETO' },
                { code: '481', display: 'HEPATOGRAMA COMPLETO' },
                { code: '5074', display: 'PSA - ANTIGENO PROSTATICO ES' },
                { code: '5131', display: 'HDL COLESTEROL' },
                { code: '5174', display: 'FERRITINA' },
                { code: '5180', display: 'HEMOGLOBINA GLICOSILADA' },
                { code: '543', display: 'INSULINA' },
                { code: '546', display: 'IONOGRAMA PLASMATICO' },
                { code: '58', display: 'ANTITROMBINA III - CON CALIBRACION DE TRES (3) PUN' },
                { code: '6118', display: 'BETA 2 GLICOPROTEINA, AC. IGG ANTI-' },
                { code: '6119', display: 'BETA 2 GLICOPROTEINA, AC. IGM ANTI-' },
                { code: '612', display: 'LH - HORMONA LUTEINIZANTE' },
                { code: '6132', display: 'CHLAMYDIA TRACHOMATIS, AG PCR' },
                { code: '614', display: 'LIPIDOS TOTALES' },
                { code: '63', display: 'ANTICUERPOS ANTI HIV - (ELISA)' },
                { code: '653', display: 'MAGNESIO' },
                { code: '677', display: 'MATERIAL DESCARTABLE' },
                { code: '680', display: 'ACTO PROFESIONAL BIOQUIMICO' },
                { code: '7057', display: 'MYCOPLASMA Y UREAPLASMA CULTIVO' },
                { code: '7100', display: 'MYCOPLASMA HOMINIS, CULTIVO - AISLAMIENTO' },
                { code: '711', display: 'EXAMEN DE ORINA' },
                { code: '736', display: 'PARASITOLOGICO SERIADO' },
                { code: '739', display: 'PARATHORMONA - PTH' },
                { code: '746', display: 'PLAQUETAS, RECUENTO DE' },
                { code: '759', display: 'PROLACTINA (PRL)' },
                { code: '761', display: 'PCR CUANTITATIVA' },
                { code: '762', display: 'ALBUMINA (SERICA O URINARIA - C/U)' },
                { code: '763', display: 'PROTEINA TOTALES' },
                { code: '813', display: 'FACTOR RH' },
                { code: '8526', display: 'CREATININA, SERICA O URINARIA ESPONTÁNEA' },
                { code: '863', display: 'TESTOSTERONA - TO' },
                { code: '865', display: 'TSH - TIROTROFINA sSica' },
                { code: '866', display: 'TIROXINA TOTAL - T4' },
                { code: '867', display: 'T4L-TIROXINA LIBRE' },
                { code: '873', display: 'TRANSAMINASA, GLUTAMICO OXALACETICA. (GOT/AST)' },
                { code: '874', display: 'TRANSAMINASA, GLUTAMICO PIRUVICA (GPT / AGT)' },
                { code: '875', display: 'TRANSFERRINA (IDR / TURBIDIMETRIA)' },
                { code: '876', display: 'TRIGLICERIDEMIA' },
                { code: '877', display: 'TRIIODOTIRONINA TOTAL - T3' },
                { code: '902', display: 'UREMIA' },
                { code: '904', display: 'URICEMIA' },
                { code: '931', display: 'VAGINAL EXUDADO O FLUJO (DIRECTO Y CULTIVO)' },
                { code: '931M', display: 'CULTIVO DE MOCO CERVICAL (Endocervix)' },
                { code: '933', display: 'VDRL / USR - CUALITATIVA' },
                { code: '998', display: 'TOMA DE MUESTRA' },
                { code: 'GL0', display: 'GLUCEMIA O GLUCOSURIA (C/U)' },
                { code: 'GL120', display: 'GLUCEMIA O GLUCOSURIA (C/U)' }
            ],
            tiposDocumento: [
                { code: 'DNI', display: 'Documento Nacional de Identidad' },
                { code: 'PAS', display: 'Pasaporte' },
                { code: 'LC', display: 'Libreta Cívica' },
                { code: 'LE', display: 'Libreta de Enrolamiento' }
            ],
            tiposMatricula: [
                { code: '10006441714000', display: 'Ministerio de Salud CABA' },
                { code: '75060562116524', display: 'Colegio de Bioquímicos Zona I Bahía Blanca' }
            ],
            profesiones: [
                { code: 'MED', display: 'Médico' },
                { code: 'BIO', display: 'Bioquímico' },
                { code: 'FAR', display: 'Farmacéutico' },
                { code: 'ENF', display: 'Enfermero' }
            ]
        };

        // Entity Lists
        this.entityLists = {
            patients: [
                { name: 'María González', birthDate: '1985-03-15', gender: 'female', dni: '12345678', internalId: 'P001' },
                { name: 'Carlos Rodríguez', birthDate: '1978-07-22', gender: 'male', dni: '23456789', internalId: 'P002' },
                { name: 'Ana Martínez', birthDate: '1992-11-08', gender: 'female', dni: '34567890', internalId: 'P003' },
                { name: 'Luis Fernández', birthDate: '1965-04-30', gender: 'male', dni: '45678901', internalId: 'P004' },
                { name: 'Sofía López', birthDate: '1989-09-12', gender: 'female', dni: '56789012', internalId: 'P005' },
                { name: 'Diego Pérez', birthDate: '1982-12-25', gender: 'male', dni: '67890123', internalId: 'P006' },
                { name: 'Carmen Silva', birthDate: '1975-06-18', gender: 'female', dni: '78901234', internalId: 'P007' },
                { name: 'Roberto Torres', birthDate: '1990-01-05', gender: 'male', dni: '89012345', internalId: 'P008' },
                { name: 'Elena Ruiz', birthDate: '1987-08-14', gender: 'female', dni: '90123456', internalId: 'P009' },
                { name: 'Miguel Castro', birthDate: '1973-10-28', gender: 'male', dni: '01234567', internalId: 'P010' }
            ],
            clinicians: [
                { name: 'Dr. Juan Morales', profession: 'Médico', matricula: '12345', tipoMatricula: '10006441714000' },
                { name: 'Dr. Laura Sánchez', profession: 'Médico', matricula: '12346', tipoMatricula: '10006441714000' },
                { name: 'Dr. Pedro Jiménez', profession: 'Médico', matricula: '12347', tipoMatricula: '10006441714000' },
                { name: 'Dr. Isabel Vega', profession: 'Médico', matricula: '12348', tipoMatricula: '10006441714000' },
                { name: 'Dr. Fernando Herrera', profession: 'Médico', matricula: '12349', tipoMatricula: '10006441714000' },
                { name: 'Bioq. María Elena Díaz', profession: 'Bioquímico', matricula: '54321', tipoMatricula: '75060562116524' },
                { name: 'Bioq. Carlos Alberto Ruiz', profession: 'Bioquímico', matricula: '54322', tipoMatricula: '75060562116524' },
                { name: 'Bioq. Ana Sofía Mendoza', profession: 'Bioquímico', matricula: '54323', tipoMatricula: '75060562116524' },
                { name: 'Bioq. Roberto Luis Torres', profession: 'Bioquímico', matricula: '54324', tipoMatricula: '75060562116524' },
                { name: 'Bioq. Elena Patricia Castro', profession: 'Bioquímico', matricula: '54325', tipoMatricula: '75060562116524' }
            ],
            performerSites: [
                { name: 'Laboratorio 1', url: 'http://laboratorio1.gob.ar/' },
                { name: 'Laboratorio Hospital 1', url: 'http://laboratorio-hospital1.gob.ar/' },
                { name: 'Laboratorio Hospital 2', url: 'http://laboratorio-hospital2.gob.ar/' }
            ],
            requesterSites: [
                { name: 'Hospital 1', url: 'http://hospital1.gob.ar/' },
                { name: 'Hospital 2', url: 'http://hospital2.gob.ar/' },
                { name: 'Hospital 3', url: 'http://hospital3.gob.ar/' }
            ]
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.populateDropdowns();
        this.updateModeDisplay(); // Will show "Seleccionar Modo" initially
        this.testServerConnection();
    }

    setupEventListeners() {
        // Mode toggle
        document.getElementById('modeToggle').addEventListener('change', (e) => {
            this.currentMode = e.target.checked ? 'manual' : 'random';
            this.updateModeDisplay();
        });

        // Server test
        document.getElementById('testServer').addEventListener('click', () => {
            this.testServerConnection();
        });

        // FHIR server URL change
        document.getElementById('fhirServer').addEventListener('change', (e) => {
            this.fhirServer = e.target.value;
        });

        // Random generation
        document.getElementById('generateRandom').addEventListener('click', () => {
            this.generateRandomSelection();
        });

        // Manual controls
        document.getElementById('patientSelect').addEventListener('change', (e) => {
            this.updateCurrentSelection('patient', e.target.value);
        });

        document.getElementById('requesterSelect').addEventListener('change', (e) => {
            this.updateCurrentSelection('requester', e.target.value);
        });

        document.getElementById('performerSelect').addEventListener('change', (e) => {
            this.updateCurrentSelection('performer', e.target.value);
        });

        document.getElementById('requesterSiteSelect').addEventListener('change', (e) => {
            this.updateCurrentSelection('requesterSite', e.target.value);
        });

        document.getElementById('performerSiteSelect').addEventListener('change', (e) => {
            this.updateCurrentSelection('performerSite', e.target.value);
        });

        document.getElementById('insuranceSelect').addEventListener('change', (e) => {
            this.updateCurrentSelection('insurance', e.target.value);
        });

        document.getElementById('randomizeProcedures').addEventListener('click', () => {
            this.randomizeProcedures();
        });

        // Generate and send
        document.getElementById('generateAndSend').addEventListener('click', () => {
            this.generateAndSendBundle();
        });

        // Bundle preview and validation
        document.getElementById('generatePreview').addEventListener('click', () => {
            this.generateBundlePreview();
        });

        document.getElementById('validateBundle').addEventListener('click', () => {
            this.validateBundle();
        });
    }

    updateModeDisplay() {
        const modeLabel = document.getElementById('modeLabel');
        const manualControls = document.getElementById('manualControls');
        const randomPanel = document.getElementById('randomPanel');

        if (this.currentMode === 'manual') {
            modeLabel.textContent = 'Modo Manual';
            manualControls.style.display = 'block';
            randomPanel.style.display = 'none';
        } else if (this.currentMode === 'random') {
            modeLabel.textContent = 'Modo Aleatorio';
            manualControls.style.display = 'none';
            randomPanel.style.display = 'block';
        } else {
            // No mode selected yet
            modeLabel.textContent = 'Seleccionar Modo';
            manualControls.style.display = 'none';
            randomPanel.style.display = 'none';
        }
    }

    populateDropdowns() {
        // Populate patient dropdown
        const patientSelect = document.getElementById('patientSelect');
        this.entityLists.patients.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient.internalId;
            option.textContent = `${patient.name} (DNI: ${patient.dni})`;
            patientSelect.appendChild(option);
        });

        // Populate clinician dropdowns
        const requesterSelect = document.getElementById('requesterSelect');
        const performerSelect = document.getElementById('performerSelect');
        
        this.entityLists.clinicians.forEach(clinician => {
            const requesterOption = document.createElement('option');
            requesterOption.value = clinician.matricula;
            requesterOption.textContent = `${clinician.name} - ${clinician.profession}`;
            requesterSelect.appendChild(requesterOption);

            const performerOption = document.createElement('option');
            performerOption.value = clinician.matricula;
            performerOption.textContent = `${clinician.name} - ${clinician.profession}`;
            performerSelect.appendChild(performerOption);
        });

        // Populate site dropdowns
        const requesterSiteSelect = document.getElementById('requesterSiteSelect');
        const performerSiteSelect = document.getElementById('performerSiteSelect');

        this.entityLists.requesterSites.forEach(site => {
            const option = document.createElement('option');
            option.value = site.url;
            option.textContent = site.name;
            requesterSiteSelect.appendChild(option);
        });

        this.entityLists.performerSites.forEach(site => {
            const option = document.createElement('option');
            option.value = site.url;
            option.textContent = site.name;
            performerSiteSelect.appendChild(option);
        });

        // Populate insurance dropdown
        const insuranceSelect = document.getElementById('insuranceSelect');
        this.masterLists.coberturas.forEach(insurance => {
            const option = document.createElement('option');
            option.value = insurance.code;
            option.textContent = insurance.display;
            insuranceSelect.appendChild(option);
        });
    }

    async testServerConnection() {
        const serverStatus = document.getElementById('serverStatus');
        const serverUrl = document.getElementById('fhirServer').value;
        
        serverStatus.innerHTML = '<div class="loading-spinner"></div> Probando conexión...';
        
        try {
            const response = await fetch(serverUrl + '/metadata');
            if (response.ok) {
                serverStatus.innerHTML = '<div class="status-success">✓ Servidor FHIR conectado correctamente</div>';
            } else {
                serverStatus.innerHTML = '<div class="status-error">✗ Error al conectar con el servidor FHIR</div>';
            }
        } catch (error) {
            serverStatus.innerHTML = '<div class="status-error">✗ Error de conexión: ' + error.message + '</div>';
        }
    }

    generateRandomSelection() {
        // Validate mode
        if (this.currentMode !== 'random') {
            alert('Debe estar en modo aleatorio para usar esta función');
            return;
        }

        // Random patient
        const randomPatient = this.entityLists.patients[Math.floor(Math.random() * this.entityLists.patients.length)];
        
        // Random requester (clinician)
        const clinicians = this.entityLists.clinicians.filter(c => c.profession === 'Médico');
        const randomRequester = clinicians[Math.floor(Math.random() * clinicians.length)];
        
        // Random performer (biochemist)
        const biochemists = this.entityLists.clinicians.filter(c => c.profession === 'Bioquímico');
        const randomPerformer = biochemists[Math.floor(Math.random() * biochemists.length)];
        
        // Random sites
        const randomRequesterSite = this.entityLists.requesterSites[Math.floor(Math.random() * this.entityLists.requesterSites.length)];
        const randomPerformerSite = this.entityLists.performerSites[Math.floor(Math.random() * this.entityLists.performerSites.length)];
        
        // Random insurance
        const randomInsurance = this.masterLists.coberturas[Math.floor(Math.random() * this.masterLists.coberturas.length)];
        
        // Random procedures (3-20)
        const procedureCount = Math.floor(Math.random() * 18) + 3; // 3 to 20
        const shuffledProcedures = [...this.masterLists.procedimientos].sort(() => 0.5 - Math.random());
        const randomProcedures = shuffledProcedures.slice(0, procedureCount);

        // Update current selection
        this.currentSelection = {
            patient: randomPatient,
            requester: randomRequester,
            performer: randomPerformer,
            requesterSite: randomRequesterSite,
            performerSite: randomPerformerSite,
            insurance: randomInsurance,
            procedures: randomProcedures
        };

        this.selectedProcedures = randomProcedures;
        this.updateCurrentSelectionDisplay();
        this.updateProceduresDisplay();
    }

    updateCurrentSelection(key, value) {
        if (key === 'patient') {
            this.currentSelection.patient = this.entityLists.patients.find(p => p.internalId === value);
        } else if (key === 'requester') {
            this.currentSelection.requester = this.entityLists.clinicians.find(c => c.matricula === value);
        } else if (key === 'performer') {
            this.currentSelection.performer = this.entityLists.clinicians.find(c => c.matricula === value);
        } else if (key === 'requesterSite') {
            this.currentSelection.requesterSite = this.entityLists.requesterSites.find(s => s.url === value);
        } else if (key === 'performerSite') {
            this.currentSelection.performerSite = this.entityLists.performerSites.find(s => s.url === value);
        } else if (key === 'insurance') {
            this.currentSelection.insurance = this.masterLists.coberturas.find(i => i.code === value);
        }
        
        this.updateCurrentSelectionDisplay();
    }

    randomizeProcedures() {
        const count = parseInt(document.getElementById('procedureCount').value);
        const shuffledProcedures = [...this.masterLists.procedimientos].sort(() => 0.5 - Math.random());
        this.selectedProcedures = shuffledProcedures.slice(0, count);
        this.currentSelection.procedures = this.selectedProcedures;
        this.updateProceduresDisplay();
        this.updateCurrentSelectionDisplay();
    }

    updateCurrentSelectionDisplay() {
        const currentSelection = document.getElementById('currentSelection');
        
        if (!this.currentSelection.patient) {
            currentSelection.innerHTML = '<p class="text-muted">No hay selección actual</p>';
            return;
        }

        let html = '';
        
        if (this.currentSelection.patient) {
            html += `<div class="selection-item"><strong>Paciente:</strong> ${this.currentSelection.patient.name} (DNI: ${this.currentSelection.patient.dni})</div>`;
        }
        
        if (this.currentSelection.requester) {
            html += `<div class="selection-item"><strong>Solicitante:</strong> ${this.currentSelection.requester.name}</div>`;
        }
        
        if (this.currentSelection.performer) {
            html += `<div class="selection-item"><strong>Ejecutante:</strong> ${this.currentSelection.performer.name}</div>`;
        }
        
        if (this.currentSelection.requesterSite) {
            html += `<div class="selection-item"><strong>Sitio Solicitante:</strong> ${this.currentSelection.requesterSite.name}</div>`;
        }
        
        if (this.currentSelection.performerSite) {
            html += `<div class="selection-item"><strong>Sitio Ejecutante:</strong> ${this.currentSelection.performerSite.name}</div>`;
        }
        
        if (this.currentSelection.insurance) {
            html += `<div class="selection-item"><strong>Cobertura:</strong> ${this.currentSelection.insurance.display}</div>`;
        }
        
        if (this.currentSelection.procedures) {
            html += `<div class="selection-item"><strong>Prestaciones:</strong> ${this.currentSelection.procedures.length} seleccionadas</div>`;
        }

        currentSelection.innerHTML = html;
    }

    updateProceduresDisplay() {
        const proceduresContainer = document.getElementById('selectedProcedures');
        proceduresContainer.innerHTML = '';
        
        this.selectedProcedures.forEach(procedure => {
            const div = document.createElement('div');
            div.className = 'procedure-item';
            div.textContent = `${procedure.code} - ${procedure.display}`;
            proceduresContainer.appendChild(div);
        });
    }

    generatePDF(patientName) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(16);
        doc.text('ATTACHMENT FOR ' + patientName, 20, 20);
        
        return doc.output('blob');
    }

    // Use the exact GUIDs from the template
    TEMPLATE_GUIDS = {
        claim: "23596630-d122-4dd4-bf1e-61a9d287ac05",
        patient: "de45db8b-8e3f-404e-a7af-910a289eeb8c",
        serviceRequest: "e4caeb31-9418-494e-a945-8799a90fb08c",
        encounter: "108abd93-5b06-415b-9c66-0fe8b2c29ccf",
        practitionerPerformer: "576e3804-7d1a-4530-9c3d-a8e16779f2a8",
        practitionerRequester: "511b97a7-5ac5-4c5f-9e4f-94e17db97958",
        documentReference: "59a1159e-3016-4c84-a936-0725edc823a0"
    };

    generatePDFData(patientName) {
        // Simple PDF data in base64 (minimal PDF with patient name)
        const pdfContent = `JVBERi0xLjQKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9nCi9QYWdlcyAyIDAgUgo+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagozIDAgb2JqCjw8L1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA1OTUgODQyXQovQ29udGVudHMgNSAwIFIKL1Jlc291cmNlcyA8PC9Qcm9jU2V0IFsvUERGIC9UZXh0XQovRm9udCA8PC9GMSA0IDAgUj4+Cj4+Cj4+CmVuZG9iago0IDAgb2JqCjw8L1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9OYW1lIC9GMQovQmFzZUZvbnQgL0hlbHZldGljYQovRW5jb2RpbmcgL01hY1JvbWFuRW5jb2RpbmcKPj4KZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDUzCj4+CnN0cmVhbQpCVAovRjEgMjAgVGYKMjIwIDQwMCBUZAooQVRUQUNITUVOVCBGT1Ig${btoa(patientName)})IFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmCjAwMDAwMDAwMDkgMDAwMDAgbgowMDAwMDAwMDYzIDAwMDAwIG4KMDAwMDAwMDEyNCAwMDAwMCBuCjAwMDAwMDAyNzcgMDAwMDAgbgowMDAwMDAwMzkyIDAwMDAwIG4KdHJhaWxlcgo8PC9TaXplIDYKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjQ5NQolJUVPRgo=`;
        return pdfContent;
    }

    generateBundle() {
        if (!this.currentSelection.patient) {
            throw new Error('Debe seleccionar un paciente');
        }

        const now = new Date();
        const bundleId = 'bundle-' + Date.now();
        
        // Use exact GUIDs from template
        const patientUuid = 'urn:uuid:' + this.TEMPLATE_GUIDS.patient;
        const claimUuid = 'urn:uuid:' + this.TEMPLATE_GUIDS.claim;
        const serviceRequestUuid = 'urn:uuid:' + this.TEMPLATE_GUIDS.serviceRequest;
        const encounterUuid = 'urn:uuid:' + this.TEMPLATE_GUIDS.encounter;
        const requesterUuid = 'urn:uuid:' + this.TEMPLATE_GUIDS.practitionerRequester;
        const performerUuid = 'urn:uuid:' + this.TEMPLATE_GUIDS.practitionerPerformer;
        const documentUuid = 'urn:uuid:' + this.TEMPLATE_GUIDS.documentReference;

        // Generate dates (a few days before now)
        const serviceDate = new Date(now.getTime() - (Math.random() * 7 + 1) * 24 * 60 * 60 * 1000);
        const createdDate = new Date(serviceDate.getTime() - Math.random() * 24 * 60 * 60 * 1000);

        const bundle = {
            resourceType: 'Bundle',
            id: bundleId,
            meta: {
                profile: ['http://recuperocaba.gob.ar/StructureDefinition/BundleCabaRecupero']
            },
            identifier: {
                system: this.currentSelection.requesterSite.url + 'recuperos',
                value: Math.floor(Math.random() * 9000000000) + 1000000000
            },
            type: 'collection',
            timestamp: now.toISOString(),
            entry: []
        };

        // Claim resource (following template structure)
        const claim = {
            resourceType: 'Claim',
            meta: {
                profile: ['http://recuperocaba.gob.ar/StructureDefinition/ClaimCabaRecupero']
            },
            status: 'active',
            type: {
                coding: [{
                    system: 'http://terminology.hl7.org/CodeSystem/claim-type',
                    code: 'institutional',
                    display: 'Institutional'
                }]
            },
            use: 'claim',
            patient: {
                reference: patientUuid
            },
            created: createdDate.toISOString(),
            provider: {
                display: this.currentSelection.performerSite.name + ' - Laboratorio de Análisis Clínicos'
            },
            priority: {
                coding: [{
                    code: 'routine'
                }]
            },
            referral: {
                reference: serviceRequestUuid
            },
            facility: {
                display: this.currentSelection.requesterSite.name + ' - Clínica Médica'
            },
            supportingInfo: [{
                sequence: 1,
                category: {
                    coding: [{
                        system: 'http://terminology.hl7.org/CodeSystem/claiminformationcategory',
                        code: 'attachment',
                        display: 'Attachment'
                    }]
                },
                valueReference: {
                    reference: documentUuid
                }
            }],
            diagnosis: [{
                sequence: 1,
                diagnosisCodeableConcept: {
                    coding: [{
                        system: 'http://recuperocaba.gob.ar/CodeSystem/recupero-diagnosticos',
                        code: 'A010',
                        display: 'Fiebre tifoidea'
                    }]
                }
            }],
            procedure: this.currentSelection.procedures.map((procedure, index) => ({
                sequence: index + 1,
                date: serviceDate.toISOString().split('T')[0],
                procedureCodeableConcept: {
                    coding: [{
                        system: 'http://recuperocaba.gob.ar/CodeSystem/codificacion-laboratorio',
                        code: procedure.code,
                        display: procedure.display
                    }]
                }
            })),
            insurance: [{
                sequence: 1,
                focal: true,
                coverage: {
                    identifier: {
                        system: 'http://recuperocaba.gob.ar/CodeSystem/coberturas-codesystem',
                        value: this.currentSelection.insurance.code
                    },
                    display: this.currentSelection.insurance.display
                }
            }]
        };

        bundle.entry.push({
            fullUrl: claimUuid,
            resource: claim
        });

        // Patient resource (following template structure)
        const patient = {
            resourceType: 'Patient',
            meta: {
                profile: ['http://recuperocaba.gob.ar/StructureDefinition/PatientCabaRecupero']
            },
            identifier: [{
                use: 'usual',
                system: this.currentSelection.performerSite.url + 'pacientes',
                value: this.currentSelection.patient.internalId
            },
            {
                use: 'official',
                system: 'http://renaper.gob.ar/dni',
                value: this.currentSelection.patient.dni
            }],
            name: [{
                use: 'official',
                text: this.currentSelection.patient.name
            }],
            gender: this.currentSelection.patient.gender,
            birthDate: this.currentSelection.patient.birthDate
        };

        bundle.entry.push({
            fullUrl: patientUuid,
            resource: patient
        });

        // ServiceRequest resource
        const serviceRequest = {
            resourceType: 'ServiceRequest',
            meta: {
                profile: ['http://recuperocaba.gob.ar/StructureDefinition/ServiceRequestCabaRecupero']
            },
            identifier: [{
                system: this.currentSelection.requesterSite.url + 'pedidos',
                value: Math.floor(Math.random() * 90000) + 10000
            }],
            status: 'completed',
            intent: 'order',
            category: [{
                coding: [{
                    system: 'http://snomed.info/sct',
                    code: '108252007',
                    display: 'Laboratory Procedure'
                }]
            }],
            subject: {
                reference: patientUuid
            },
            encounter: {
                reference: encounterUuid
            },
            occurrenceDateTime: serviceDate.toISOString(),
            authoredOn: createdDate.toISOString(),
            requester: {
                reference: requesterUuid
            },
            performer: [{
                reference: performerUuid
            }],
            locationCode: [{
                text: 'Laboratorio de Análisis Clínicos'
            }]
        };

        bundle.entry.push({
            fullUrl: serviceRequestUuid,
            resource: serviceRequest
        });

        // Encounter resource
        const encounter = {
            resourceType: 'Encounter',
            meta: {
                profile: ['http://recuperocaba.gob.ar/StructureDefinition/EncounterCabaRecupero']
            },
            identifier: [{
                system: this.currentSelection.requesterSite.url + 'episodios',
                value: Math.floor(Math.random() * 900000000) + 100000000
            }],
            status: 'unknown',
            class: {
                system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
                code: 'AMB',
                display: 'ambulatory'
            },
            type: [{
                text: 'Laboratorio'
            }],
            subject: {
                reference: patientUuid
            }
        };

        bundle.entry.push({
            fullUrl: encounterUuid,
            resource: encounter
        });

        // Practitioner (Performer/Biochemist)
        const performer = {
            resourceType: 'Practitioner',
            meta: {
                profile: ['http://recuperocaba.gob.ar/StructureDefinition/PractitionerCabaRecupero']
            },
            identifier: [{
                system: 'http://recuperocaba.gob.ar/CodeSystem/recupero-tipos-matricula/' + this.currentSelection.performer.tipoMatricula,
                value: this.currentSelection.performer.matricula
            }],
            name: [{
                text: this.currentSelection.performer.name
            }],
            qualification: [{
                code: {
                    coding: [{
                        system: 'http://recuperocaba.gob.ar/CodeSystem/recupero-profesiones',
                        code: this.currentSelection.performer.profession === 'Bioquímico' ? '27' : '1',
                        display: this.currentSelection.performer.profession
                    }]
                }
            }]
        };

        bundle.entry.push({
            fullUrl: performerUuid,
            resource: performer
        });

        // Practitioner (Requester/Clinician)
        const requester = {
            resourceType: 'Practitioner',
            meta: {
                profile: ['http://recuperocaba.gob.ar/StructureDefinition/PractitionerCabaRecupero']
            },
            identifier: [{
                system: 'http://recuperocaba.gob.ar/CodeSystem/recupero-tipos-matricula/' + this.currentSelection.requester.tipoMatricula,
                value: this.currentSelection.requester.matricula
            }],
            name: [{
                text: this.currentSelection.requester.name
            }],
            qualification: [{
                code: {
                    coding: [{
                        system: 'http://recuperocaba.gob.ar/CodeSystem/recupero-profesiones',
                        code: this.currentSelection.requester.profession === 'Médico' ? '1' : '27',
                        display: this.currentSelection.requester.profession
                    }]
                }
            }]
        };

        bundle.entry.push({
            fullUrl: requesterUuid,
            resource: requester
        });

        // DocumentReference (PDF attachment)
        const documentReference = {
            resourceType: 'DocumentReference',
            status: 'current',
            type: {
                coding: [{
                    system: 'http://loinc.org',
                    code: '11502-2',
                    display: 'Laboratory Report'
                }]
            },
            subject: {
                reference: patientUuid
            },
            date: createdDate.toISOString(),
            content: [{
                attachment: {
                    contentType: 'application/pdf',
                    data: this.generatePDFData(this.currentSelection.patient.name)
                }
            }]
        };

        bundle.entry.push({
            fullUrl: documentUuid,
            resource: documentReference
        });

        return bundle;
    }

    generateBundlePreview() {
        const bundlePreview = document.getElementById('bundlePreview');
        const validationStatus = document.getElementById('validationStatus');
        
        // Clear previous validation status
        validationStatus.innerHTML = '';
        
        try {
            // Validate mode selection
            if (!this.currentMode) {
                bundlePreview.value = 'Error: Debe seleccionar un modo (Aleatorio o Manual)';
                return;
            }

            // Generate bundle
            const bundle = this.generateBundle();
            
            // Display formatted JSON
            bundlePreview.value = JSON.stringify(bundle, null, 2);
            
        } catch (error) {
            bundlePreview.value = 'Error al generar bundle: ' + error.message;
        }
    }

    async validateBundle() {
        const bundlePreview = document.getElementById('bundlePreview');
        const validationStatus = document.getElementById('validationStatus');
        const serverUrl = document.getElementById('fhirServer').value;
        
        // Check if we have a bundle to validate
        if (!bundlePreview.value || bundlePreview.value.includes('Error')) {
            validationStatus.innerHTML = '<div class="status-error">✗ Error: Debe generar un bundle primero</div>';
            return;
        }

        try {
            validationStatus.innerHTML = '<div class="loading-spinner"></div> Validando bundle...';
            
            // Parse the bundle from the preview
            const bundle = JSON.parse(bundlePreview.value);
            
            // Send validation request
            const response = await fetch(serverUrl + '/Bundle/$validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/fhir+json',
                    'Accept': 'application/fhir+json'
                },
                body: JSON.stringify(bundle)
            });

            if (response.ok) {
                const result = await response.json();
                
                if (result.issue && result.issue.length > 0) {
                    // Validation warnings or errors
                    let issuesHtml = '<div class="status-warning">⚠ Bundle válido con advertencias:</div><ul>';
                    result.issue.forEach(issue => {
                        const severity = issue.severity === 'error' ? '❌' : '⚠️';
                        issuesHtml += `<li>${severity} ${issue.diagnostics || issue.code?.text || 'Problema de validación'}</li>`;
                    });
                    issuesHtml += '</ul>';
                    validationStatus.innerHTML = issuesHtml;
                } else {
                    validationStatus.innerHTML = '<div class="status-success">✓ Bundle válido sin problemas</div>';
                }
            } else {
                const errorText = await response.text();
                validationStatus.innerHTML = '<div class="status-error">✗ Error de validación: ' + errorText + '</div>';
            }
        } catch (error) {
            validationStatus.innerHTML = '<div class="status-error">✗ Error al validar: ' + error.message + '</div>';
        }
    }

    async generateAndSendBundle() {
        const generationStatus = document.getElementById('generationStatus');
        const resultsSection = document.getElementById('resultsSection');
        const resultsContent = document.getElementById('resultsContent');

        // Validate mode selection
        if (!this.currentMode) {
            generationStatus.innerHTML = '<div class="status-error">✗ Error: Debe seleccionar un modo (Aleatorio o Manual)</div>';
            return;
        }

        try {
            generationStatus.innerHTML = '<div class="loading-spinner"></div> Generando bundle...';
            
            // Generate bundle
            const bundle = this.generateBundle();
            
            generationStatus.innerHTML = '<div class="loading-spinner"></div> Enviando al servidor FHIR...';
            
            // Send to FHIR server
            const response = await fetch(this.fhirServer + '/Bundle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/fhir+json',
                    'Accept': 'application/fhir+json'
                },
                body: JSON.stringify(bundle)
            });

            if (response.ok) {
                const result = await response.json();
                generationStatus.innerHTML = '<div class="status-success">✓ Bundle enviado exitosamente</div>';
                
                resultsSection.style.display = 'block';
                resultsContent.innerHTML = `
                    <div class="result-item result-success">
                        <h6>Bundle Generado y Enviado</h6>
                        <p><strong>ID del Bundle:</strong> ${bundle.id}</p>
                        <p><strong>Paciente:</strong> ${this.currentSelection.patient.name}</p>
                        <p><strong>Prestaciones:</strong> ${this.currentSelection.procedures.length}</p>
                        <p><strong>Servidor:</strong> ${this.fhirServer}</p>
                        <p><strong>Respuesta del servidor:</strong> ${result.resourceType} ${result.id}</p>
                    </div>
                `;
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            generationStatus.innerHTML = '<div class="status-error">✗ Error: ' + error.message + '</div>';
            
            resultsSection.style.display = 'block';
            resultsContent.innerHTML = `
                <div class="result-item result-error">
                    <h6>Error al enviar Bundle</h6>
                    <p><strong>Error:</strong> ${error.message}</p>
                </div>
            `;
        }
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new RecuperoWebApp();
}); 