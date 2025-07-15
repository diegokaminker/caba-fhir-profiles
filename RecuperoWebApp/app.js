// Recupero Web App - Main JavaScript File

class RecuperoWebApp {
    constructor() {
        this.currentMode = null; // Will be set by user selection
        this.fhirServer = 'https://fhirserver.hl7fundamentals.org/fhir';
        this.currentSelection = {};
        this.selectedProcedures = [];
        this.uploadedPDFFile = null; // Store uploaded PDF file
        
        // Master Lists (will be populated from FHIR server)
        this.masterLists = {
            coberturas: [],
            diagnosticos: [],
            procedimientos: [],
            tiposDocumento: [],
            tiposMatricula: [],
            profesiones: []
        };

        // CodeSystem URLs for fetching from FHIR server
        this.codeSystemUrls = {
            coberturas: 'http://recuperocaba.gob.ar/CodeSystem/coberturas-codesystem',
            diagnosticos: 'http://recuperocaba.gob.ar/CodeSystem/diagnosticos-codesystem',
            procedimientos: 'http://recuperocaba.gob.ar/CodeSystem/procedimientos-codesystem',
            tiposDocumento: 'http://recuperocaba.gob.ar/CodeSystem/tipos-documento-codesystem',
            tiposMatricula: 'http://recuperocaba.gob.ar/CodeSystem/tipos-matricula-codesystem',
            profesiones: 'http://recuperocaba.gob.ar/CodeSystem/profesiones-codesystem',
            profesionesEfectores: 'http://recuperocaba.gob.ar/CodeSystem/profesiones-efectores-codesystem'
        };

        // Entity Lists
        this.entityLists = {
            patients: [
                { 
                    givenNames: ['María', 'Elena'], 
                    familyName: 'González Silva', 
                    fathersFamilyName: 'González', 
                    mothersFamilyName: 'Silva', 
                    usualName: 'María',
                    birthDate: '1985-03-15', 
                    gender: 'female', 
                    dni: '12345678', 
                    internalId: 'P001' 
                },
                { 
                    givenNames: ['Carlos', 'Alberto'], 
                    familyName: 'Rodríguez Pérez', 
                    fathersFamilyName: 'Rodríguez', 
                    mothersFamilyName: 'Pérez', 
                    usualName: 'Carlos',
                    birthDate: '1978-07-22', 
                    gender: 'male', 
                    dni: '23456789', 
                    internalId: 'P002' 
                },
                { 
                    givenNames: ['Ana', 'Sofía'], 
                    familyName: 'Martínez López', 
                    fathersFamilyName: 'Martínez', 
                    mothersFamilyName: 'López', 
                    usualName: 'Ana',
                    birthDate: '1992-11-08', 
                    gender: 'female', 
                    dni: '34567890', 
                    internalId: 'P003' 
                },
                { 
                    givenNames: ['Luis', 'Miguel'], 
                    familyName: 'Fernández Castro', 
                    fathersFamilyName: 'Fernández', 
                    mothersFamilyName: 'Castro', 
                    usualName: 'Luis',
                    birthDate: '1965-04-30', 
                    gender: 'male', 
                    dni: '45678901', 
                    internalId: 'P004' 
                },
                { 
                    givenNames: ['Sofía', 'Isabella'], 
                    familyName: 'López Torres', 
                    fathersFamilyName: 'López', 
                    mothersFamilyName: 'Torres', 
                    usualName: 'Sofía',
                    birthDate: '1989-09-12', 
                    gender: 'female', 
                    dni: '56789012', 
                    internalId: 'P005' 
                },
                { 
                    givenNames: ['Diego', 'Alejandro'], 
                    familyName: 'Pérez Ruiz', 
                    fathersFamilyName: 'Pérez', 
                    mothersFamilyName: 'Ruiz', 
                    usualName: 'Diego',
                    birthDate: '1982-12-25', 
                    gender: 'male', 
                    dni: '67890123', 
                    internalId: 'P006' 
                },
                { 
                    givenNames: ['Carmen', 'Rosa'], 
                    familyName: 'Silva Mendoza', 
                    fathersFamilyName: 'Silva', 
                    mothersFamilyName: 'Mendoza', 
                    usualName: 'Carmen',
                    birthDate: '1975-06-18', 
                    gender: 'female', 
                    dni: '78901234', 
                    internalId: 'P007' 
                },
                { 
                    givenNames: ['Roberto', 'Luis'], 
                    familyName: 'Torres Herrera', 
                    fathersFamilyName: 'Torres', 
                    mothersFamilyName: 'Herrera', 
                    usualName: 'Roberto',
                    birthDate: '1990-01-05', 
                    gender: 'male', 
                    dni: '89012345', 
                    internalId: 'P008' 
                },
                { 
                    givenNames: ['Elena', 'Patricia'], 
                    familyName: 'Ruiz Vega', 
                    fathersFamilyName: 'Ruiz', 
                    mothersFamilyName: 'Vega', 
                    usualName: 'Elena',
                    birthDate: '1987-08-14', 
                    gender: 'female', 
                    dni: '90123456', 
                    internalId: 'P009' 
                },
                { 
                    givenNames: ['Miguel', 'Ángel'], 
                    familyName: 'Castro Díaz', 
                    fathersFamilyName: 'Castro', 
                    mothersFamilyName: 'Díaz', 
                    usualName: 'Miguel',
                    birthDate: '1973-10-28', 
                    gender: 'male', 
                    dni: '01234567', 
                    internalId: 'P010' 
                }
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

        this.init().catch(error => {
            console.error('Error initializing app:', error);
        });
    }

    async fetchCodeSystem(codesystemUrl) {
        try {
            const response = await fetch(`${this.fhirServer}/CodeSystem/?url=${encodeURIComponent(codesystemUrl)}`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            if (result.entry && result.entry.length > 0) {
                const codeSystem = result.entry[0].resource;
                if (codeSystem.concept) {
                    return codeSystem.concept.map(concept => ({
                        code: concept.code,
                        display: concept.display
                    }));
                }
            }
            
            return [];
        } catch (error) {
            console.error(`Error fetching CodeSystem ${codesystemUrl}:`, error);
            return [];
        }
    }

    async loadAllCodeSystems() {
        console.log('Loading CodeSystems from FHIR server...');
        
        // Fetch all CodeSystems in parallel
        const promises = Object.entries(this.codeSystemUrls).map(async ([key, url]) => {
            const codes = await this.fetchCodeSystem(url);
            this.masterLists[key] = codes;
            console.log(`Loaded ${codes.length} codes for ${key}`);
            return { key, codes };
        });
        
        try {
            await Promise.all(promises);
            console.log('All CodeSystems loaded successfully');
            this.populateDropdowns(); // Refresh dropdowns with new data
        } catch (error) {
            console.error('Error loading CodeSystems:', error);
        }
    }

    async init() {
        this.setupEventListeners();
        this.updateModeDisplay(); // Will show "Seleccionar Modo" initially
        this.testServerConnection();
        this.updateSendButtonState(); // Initialize button state
        
        // Load CodeSystems from FHIR server
        await this.loadAllCodeSystems();
    }

    setupEventListeners() {
        // Mode toggles - both switches control the same mode
        document.getElementById('modeToggleManual').addEventListener('change', (e) => {
            this.currentMode = e.target.checked ? 'manual' : 'random';
            this.updateModeDisplay();
            this.updateSendButtonState(); // Update button state when mode changes
        });

        document.getElementById('modeToggleRandom').addEventListener('change', (e) => {
            this.currentMode = e.target.checked ? 'manual' : 'random';
            this.updateModeDisplay();
            this.updateSendButtonState(); // Update button state when mode changes
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

        document.getElementById('diagnosisSelect').addEventListener('change', (e) => {
            this.updateCurrentSelection('diagnosis', e.target.value);
        });

        document.getElementById('randomizeProcedures').addEventListener('click', () => {
            this.randomizeProcedures();
        });

        // New procedure management buttons
        document.getElementById('clearProcedures').addEventListener('click', () => {
            this.clearProcedures();
        });

        document.getElementById('selectProcedures').addEventListener('click', () => {
            this.openProcedureSelectionModal();
        });

        // Procedure selection modal events
        document.getElementById('procedureSearch').addEventListener('input', (e) => {
            this.filterProcedures(e.target.value);
        });

        document.getElementById('selectAllProcedures').addEventListener('change', (e) => {
            this.toggleSelectAllProcedures(e.target.checked);
        });

        document.getElementById('addSelectedProcedures').addEventListener('click', () => {
            this.addSelectedProcedures();
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

        // PDF file upload handling
        document.getElementById('pdfUpload').addEventListener('change', (e) => {
            this.handlePDFUpload(e.target.files[0]);
        });
    }

    updateModeDisplay() {
        const modeLabelManual = document.getElementById('modeLabelManual');
        const modeLabelRandom = document.getElementById('modeLabelRandom');
        const modeToggleManual = document.getElementById('modeToggleManual');
        const modeToggleRandom = document.getElementById('modeToggleRandom');
        const manualControls = document.getElementById('manualControls');
        const randomPanel = document.getElementById('randomPanel');

        if (this.currentMode === 'manual') {
            modeLabelManual.textContent = 'Modo Manual';
            modeLabelRandom.textContent = 'Modo Manual';
            modeToggleManual.checked = true;
            modeToggleRandom.checked = true;
            manualControls.style.display = 'block';
            randomPanel.style.display = 'none';
        } else if (this.currentMode === 'random') {
            modeLabelManual.textContent = 'Modo Aleatorio';
            modeLabelRandom.textContent = 'Modo Aleatorio';
            modeToggleManual.checked = false;
            modeToggleRandom.checked = false;
            manualControls.style.display = 'none';
            randomPanel.style.display = 'block';
        } else {
            // No mode selected yet - default to random mode
            this.currentMode = 'random';
            modeLabelManual.textContent = 'Modo Aleatorio';
            modeLabelRandom.textContent = 'Modo Aleatorio';
            modeToggleManual.checked = false;
            modeToggleRandom.checked = false;
            manualControls.style.display = 'none';
            randomPanel.style.display = 'block';
        }
    }

    populateDropdowns() {
        // Populate patient dropdown
        const patientSelect = document.getElementById('patientSelect');
        this.entityLists.patients.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient.internalId;
            const fullName = `${patient.givenNames.join(' ')} ${patient.familyName}`;
            option.textContent = `${fullName} (DNI: ${patient.dni})`;
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

        // Populate diagnosis dropdown
        const diagnosisSelect = document.getElementById('diagnosisSelect');
        this.masterLists.diagnosticos.forEach(diagnosis => {
            const option = document.createElement('option');
            option.value = diagnosis.code;
            option.textContent = `${diagnosis.code} - ${diagnosis.display}`;
            diagnosisSelect.appendChild(option);
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
        
        // Random diagnosis
        const randomDiagnosis = this.masterLists.diagnosticos[Math.floor(Math.random() * this.masterLists.diagnosticos.length)];
        
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
            diagnosis: randomDiagnosis,
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
        } else if (key === 'diagnosis') {
            this.currentSelection.diagnosis = this.masterLists.diagnosticos.find(d => d.code === value);
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
            const fullName = `${this.currentSelection.patient.givenNames.join(' ')} ${this.currentSelection.patient.familyName}`;
            html += `<div class="selection-item"><strong>Paciente:</strong> ${fullName} (DNI: ${this.currentSelection.patient.dni})</div>`;
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
        
        if (this.currentSelection.diagnosis) {
            html += `<div class="selection-item"><strong>Diagnóstico:</strong> ${this.currentSelection.diagnosis.code} - ${this.currentSelection.diagnosis.display}</div>`;
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

    clearProcedures() {
        this.selectedProcedures = [];
        this.currentSelection.procedures = [];
        this.updateProceduresDisplay();
        this.updateCurrentSelectionDisplay();
    }

    openProcedureSelectionModal() {
        this.loadProceduresInModal();
        const modal = new bootstrap.Modal(document.getElementById('procedureSelectionModal'));
        modal.show();
    }

    loadProceduresInModal() {
        const procedureList = document.getElementById('procedureList');
        procedureList.innerHTML = '';
        
        this.masterLists.procedimientos.forEach(procedure => {
            const div = document.createElement('div');
            div.className = 'procedure-option d-flex align-items-center p-2 border-bottom';
            div.innerHTML = `
                <div class="form-check me-3">
                    <input class="form-check-input procedure-checkbox" type="checkbox" 
                           value="${procedure.code}" data-display="${procedure.display}">
                </div>
                <div class="flex-grow-1">
                    <strong>${procedure.code}</strong> - ${procedure.display}
                </div>
            `;
            
            // Add click event to the entire row
            div.addEventListener('click', (e) => {
                if (e.target.type !== 'checkbox') {
                    const checkbox = div.querySelector('.procedure-checkbox');
                    checkbox.checked = !checkbox.checked;
                    this.updateSelectAllState();
                }
            });
            
            // Add change event to the checkbox
            const checkbox = div.querySelector('.procedure-checkbox');
            checkbox.addEventListener('change', () => {
                this.updateSelectAllState();
            });
            
            procedureList.appendChild(div);
        });
        
        // Initialize select all state
        this.updateSelectAllState();
    }

    filterProcedures(searchTerm) {
        const procedureOptions = document.querySelectorAll('.procedure-option');
        const searchLower = searchTerm.toLowerCase();
        
        procedureOptions.forEach(option => {
            const text = option.textContent.toLowerCase();
            if (text.includes(searchLower)) {
                option.style.display = 'block';
            } else {
                option.style.display = 'none';
            }
        });
        
        // Update select all checkbox state
        this.updateSelectAllState();
    }

    toggleSelectAllProcedures(checked) {
        const visibleCheckboxes = document.querySelectorAll('.procedure-checkbox:not([style*="display: none"])');
        visibleCheckboxes.forEach(checkbox => {
            checkbox.checked = checked;
        });
    }

    updateSelectAllState() {
        const visibleCheckboxes = document.querySelectorAll('.procedure-checkbox:not([style*="display: none"])');
        const checkedCheckboxes = document.querySelectorAll('.procedure-checkbox:not([style*="display: none"]):checked');
        const selectAllCheckbox = document.getElementById('selectAllProcedures');
        
        if (visibleCheckboxes.length === 0) {
            selectAllCheckbox.indeterminate = false;
            selectAllCheckbox.checked = false;
        } else if (checkedCheckboxes.length === visibleCheckboxes.length) {
            selectAllCheckbox.indeterminate = false;
            selectAllCheckbox.checked = true;
        } else if (checkedCheckboxes.length > 0) {
            selectAllCheckbox.indeterminate = true;
            selectAllCheckbox.checked = false;
        } else {
            selectAllCheckbox.indeterminate = false;
            selectAllCheckbox.checked = false;
        }
    }

    addSelectedProcedures() {
        const selectedCheckboxes = document.querySelectorAll('.procedure-checkbox:checked');
        const newProcedures = [];
        
        selectedCheckboxes.forEach(checkbox => {
            const code = checkbox.value;
            const display = checkbox.dataset.display;
            const procedure = this.masterLists.procedimientos.find(p => p.code === code);
            
            if (procedure && !this.selectedProcedures.some(p => p.code === code)) {
                newProcedures.push(procedure);
            }
        });
        
        // Add new procedures to the current list
        this.selectedProcedures = [...this.selectedProcedures, ...newProcedures];
        this.currentSelection.procedures = this.selectedProcedures;
        
        // Update displays
        this.updateProceduresDisplay();
        this.updateCurrentSelectionDisplay();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('procedureSelectionModal'));
        modal.hide();
        
        // Show feedback
        if (newProcedures.length > 0) {
            alert(`${newProcedures.length} prestación(es) agregada(s) exitosamente.`);
        } else {
            alert('No se agregaron nuevas prestaciones (posiblemente ya estaban seleccionadas).');
        }
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

    handlePDFUpload(file) {
        if (file) {
            console.log('PDF file uploaded:', file.name);
            this.uploadedPDFFile = file;
            // Show feedback to user
            const uploadInfo = document.createElement('div');
            uploadInfo.className = 'alert alert-success mt-2';
            uploadInfo.innerHTML = `<i class="fas fa-check"></i> PDF cargado: ${file.name} <button type="button" class="btn-close" onclick="this.parentElement.remove(); app.clearUploadedPDF();"></button>`;
            
            // Remove any existing upload info
            const existingInfo = document.querySelector('.alert-success');
            if (existingInfo) {
                existingInfo.remove();
            }
            
            document.getElementById('pdfUpload').parentNode.appendChild(uploadInfo);
        } else {
            this.clearUploadedPDF();
        }
    }

    clearUploadedPDF() {
        this.uploadedPDFFile = null;
        document.getElementById('pdfUpload').value = '';
        // Remove any existing upload info
        const existingInfo = document.querySelector('.alert-success');
        if (existingInfo) {
            existingInfo.remove();
        }
    }

    generatePDFData(patientName) {
        // Check if there's an uploaded PDF file
        if (this.uploadedPDFFile) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    // Get base64 string without data URL prefix
                    const base64 = reader.result.split(',')[1];
                    resolve(base64);
                };
                reader.onerror = reject;
                reader.readAsDataURL(this.uploadedPDFFile);
            });
        }
        
        // Fallback to generating a default PDF
        try {
            // Generate a proper PDF using jsPDF
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Add content to the PDF
            doc.setFontSize(16);
            doc.text('ATTACHMENT FOR ' + patientName, 20, 30);
            
            doc.setFontSize(12);
            doc.text('Generated on: ' + new Date().toLocaleDateString(), 20, 50);
            doc.text('Patient: ' + patientName, 20, 60);
            doc.text('Document Type: Laboratory Report', 20, 70);
            
            // Convert PDF to base64
            const pdfBlob = doc.output('blob');
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    // Get base64 string without data URL prefix
                    const base64 = reader.result.split(',')[1];
                    resolve(base64);
                };
                reader.onerror = reject;
                reader.readAsDataURL(pdfBlob);
            });
        } catch (error) {
            console.error('Error generating PDF:', error);
            // Fallback to a simple base64 PDF
            return Promise.resolve('JVBERi0xLjQKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9nCi9QYWdlcyAyIDAgUgo+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagozIDAgb2JqCjw8L1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA1OTUgODQyXQovQ29udGVudHMgNSAwIFIKL1Jlc291cmNlcyA8PC9Qcm9jU2V0IFsvUERGIC9UZXh0XQovRm9udCA8PC9GMSA0IDAgUj4+Cj4+Cj4+CmVuZG9iagozIDAgb2JqCjw8L1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA1OTUgODQyXQovQ29udGVudHMgNSAwIFIKL1Jlc291cmNlcyA8PC9Qcm9jU2V0IFsvUERGIC9UZXh0XQovRm9udCA8PC9GMSA0IDAgUj4+Cj4+Cj4+CmVuZG9iago0IDAgb2JqCjw8L1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9OYW1lIC9GMQovQmFzZUZvbnQgL0hlbHZldGljYQovRW5jb2RpbmcgL01hY1JvbWFuRW5jb2RpbmcKPj4KZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDUzCj4+CnN0cmVhbQpCVAovRjEgMjAgVGYKMjIwIDQwMCBUZAooQVRUQUNITUVOVCBGT1IgUEFUSUVOVCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYKMDAwMDAwMDAwOSAwMDAwMCBuCjAwMDAwMDAwNjMgMDAwMDAgbgowMDAwMDAwMTI0IDAwMDAwIG4KMDAwMDAwMDI3NyAwMDAwMCBuCjAwMDAwMDAzOTIgMDAwMDAgbgp0cmFpbGVyCjw8L1NpemUgNgovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDk1CiUlRU9G');
        }
    }

    async generateBundle() {
        if (!this.currentSelection.patient) {
            throw new Error('Debe seleccionar un paciente');
        }

        const now = new Date();
        // Remove bundleId and id field
        // const bundleId = 'bundle-' + Date.now();
        
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

        // Helper to generate UUID v4
        function generateUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        // Ensure performerSite.url ends with a slash
        let performerBaseUrl = this.currentSelection.performerSite.url;
        if (!performerBaseUrl.endsWith('/')) performerBaseUrl += '/';

        const bundle = {
            resourceType: 'Bundle',
            meta: {
                profile: ['http://recuperocaba.gob.ar/StructureDefinition/BundleCabaRecupero']
            },
            identifier: {
                system: performerBaseUrl + 'recuperos',
                value: generateUUID()
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
            text: {
                status: 'generated',
                div: `<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Claim</b></p><p><b>Status:</b> Active</p><p><b>Type:</b> Institutional</p><p><b>Patient:</b> ${this.currentSelection.patient.givenNames.join(' ')} ${this.currentSelection.patient.familyName}</p><p><b>Provider:</b> ${this.currentSelection.performerSite.name} - Laboratorio de Análisis Clínicos</p><p><b>Facility:</b> ${this.currentSelection.requesterSite.name} - Clínica Médica</p><p><b>Diagnosis:</b> ${this.currentSelection.diagnosis ? this.currentSelection.diagnosis.display : 'A010 - Fiebre tifoidea'}</p><p><b>Procedures:</b> ${this.currentSelection.procedures.map(p => p.display).join(', ')}</p><p><b>Insurance:</b> ${this.currentSelection.insurance.display}</p></div>`
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
                    system: 'http://terminology.hl7.org/CodeSystem/processpriority',
                    code: 'normal',
                    display: 'Normal'
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
                        system: 'http://recuperocaba.gob.ar/CodeSystem/diagnosticos-codesystem',
                        code: this.currentSelection.diagnosis ? this.currentSelection.diagnosis.code : 'A010',
                        display: this.currentSelection.diagnosis ? this.currentSelection.diagnosis.display : 'Fiebre tifoidea'
                    }]
                }
            }],
            procedure: this.currentSelection.procedures.map((procedure, index) => ({
                sequence: index + 1,
                date: serviceDate.toISOString().split('T')[0],
                procedureCodeableConcept: {
                    coding: [{
                        system: 'http://recuperocaba.gob.ar/CodeSystem/procedimientos-codesystem',
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
            text: {
                status: 'generated',
                div: `<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Patient</b></p><p><b>Name:</b> ${this.currentSelection.patient.givenNames.join(' ')} ${this.currentSelection.patient.familyName}</p><p><b>Usual Name:</b> ${this.currentSelection.patient.usualName}</p><p><b>Gender:</b> ${this.currentSelection.patient.gender}</p><p><b>Birth Date:</b> ${this.currentSelection.patient.birthDate}</p><p><b>Internal ID:</b> ${this.currentSelection.patient.internalId}</p><p><b>DNI:</b> ${this.currentSelection.patient.dni}</p></div>`
            },
            identifier: [{
                use: 'usual',
                system: this.currentSelection.performerSite.url.replace(/\/$/, '') + '/pacientes',
                value: this.currentSelection.patient.internalId
            },
            {
                use: 'official',
                system: 'http://renaper.gob.ar/dni',
                value: this.currentSelection.patient.dni
            }],
            name: [{
                use: 'official',
                family: this.currentSelection.patient.familyName,
                _family: {
                    extension: [{
                        url: 'http://recuperocaba.gob.ar/StructureDefinition/ExtensionFathersFamilyName',
                        valueString: this.currentSelection.patient.fathersFamilyName
                    },
                    {
                        url: 'http://recuperocaba.gob.ar/StructureDefinition/ExtensionMothersFamilyName',
                        valueString: this.currentSelection.patient.mothersFamilyName
                    }]
                },
                given: this.currentSelection.patient.givenNames
            },
            {
                use: 'usual',
                given: [this.currentSelection.patient.usualName]
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
            text: {
                status: 'generated',
                div: `<div xmlns="http://www.w3.org/1999/xhtml"><p><b>ServiceRequest</b></p><p><b>Status:</b> Completed</p><p><b>Intent:</b> Order</p><p><b>Category:</b> Laboratory Procedure</p><p><b>Subject:</b> ${this.currentSelection.patient.givenNames.join(' ')} ${this.currentSelection.patient.familyName}</p><p><b>Requester:</b> ${this.currentSelection.requester.name}</p><p><b>Performer:</b> ${this.currentSelection.performer.name}</p><p><b>Location:</b> Laboratorio de Análisis Clínicos</p><p><b>Occurrence:</b> ${serviceDate.toISOString()}</p><p><b>Authored On:</b> ${createdDate.toISOString()}</p></div>`
            },
            identifier: [{
                system: this.currentSelection.requesterSite.url.replace(/\/$/, '') + '/pedidos',
                value: generateUUID()
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
            text: {
                status: 'generated',
                div: `<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Encounter</b></p><p><b>Status:</b> Unknown</p><p><b>Class:</b> Ambulatory</p><p><b>Type:</b> Immunología</p><p><b>Subject:</b> ${this.currentSelection.patient.givenNames.join(' ')} ${this.currentSelection.patient.familyName}</p><p><b>Identifier:</b> 130145562</p></div>`
            },
            identifier: [{
                system: this.currentSelection.performerSite.url.replace(/\/$/, '') + '/episodios',
                value: '130145562'
            }],
            status: 'unknown',
            class: {
                system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
                code: 'AMB',
                display: 'ambulatory'
            },
            type: [{
                text: 'Immunología'
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
                profile: ['http://recuperocaba.gob.ar/StructureDefinition/PractitionerCabaFirmanteRecupero']
            },
            text: {
                status: 'generated',
                div: `<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Practitioner Firmante</b></p><p><b>Name:</b> ${this.currentSelection.performer.name}</p><p><b>Identifier:</b> ${this.currentSelection.performer.matricula}</p><p><b>Qualification:</b> ${this.currentSelection.performer.profession}</p></div>`
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
                        system: 'http://recuperocaba.gob.ar/CodeSystem/profesiones-efectores-codesystem',
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
                profile: ['http://recuperocaba.gob.ar/StructureDefinition/PractitionerCabaSolicitanteRecupero']
            },
            text: {
                status: 'generated',
                div: `<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Practitioner Solicitante</b></p><p><b>Name:</b> ${this.currentSelection.requester.name}</p><p><b>Identifier:</b> ${this.currentSelection.requester.matricula}</p><p><b>Qualification:</b> ${this.currentSelection.requester.profession}</p></div>`
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
                        system: 'http://recuperocaba.gob.ar/CodeSystem/profesiones-codesystem',
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
        const patientFullName = `${this.currentSelection.patient.givenNames.join(' ')} ${this.currentSelection.patient.familyName}`;
        const pdfData = await this.generatePDFData(patientFullName);
        const documentReference = {
            resourceType: 'DocumentReference',
            text: {
                status: 'generated',
                div: `<div xmlns="http://www.w3.org/1999/xhtml"><p><b>DocumentReference</b></p><p><b>Status:</b> Current</p><p><b>Type:</b> Laboratory Report</p><p><b>Subject:</b> ${patientFullName}</p><p><b>Date:</b> ${createdDate.toISOString().split('T')[0]}</p><p><b>Content:</b> PDF Report Attachment</p></div>`
            },
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
                    data: pdfData
                }
            }]
        };

        bundle.entry.push({
            fullUrl: documentUuid,
            resource: documentReference
        });

        return bundle;
    }

    async generateBundlePreview() {
        const bundlePreview = document.getElementById('bundlePreview');
        const validationStatus = document.getElementById('validationStatus');
        
        // Clear previous validation status
        validationStatus.innerHTML = '';
        
        try {
            // Validate mode selection
            if (!this.currentMode) {
                bundlePreview.value = 'Error: Debe seleccionar un modo (Aleatorio o Manual)';
                this.updateSendButtonState();
                return;
            }

            // Generate bundle
            const bundle = await this.generateBundle();
            
            // Display formatted JSON
            bundlePreview.value = JSON.stringify(bundle, null, 2);
            
            // Update send button state
            this.updateSendButtonState();
            
        } catch (error) {
            bundlePreview.value = 'Error al generar bundle: ' + error.message;
            this.updateSendButtonState();
        }
    }

    updateSendButtonState() {
        const bundlePreview = document.getElementById('bundlePreview');
        const sendButton = document.getElementById('generateAndSend');
        
        // Enable button if there's a valid bundle in the preview OR if we're in random mode
        const hasValidBundle = bundlePreview.value && 
                              !bundlePreview.value.includes('Error') && 
                              bundlePreview.value.trim() !== '';
        
        const isRandomMode = this.currentMode === 'random';
        
        sendButton.disabled = !hasValidBundle && !isRandomMode;
        
        // Update button text based on state
        if (hasValidBundle) {
            sendButton.textContent = 'Generar Bundle y Enviar al Servidor';
            sendButton.title = 'Enviar el bundle actual al servidor FHIR';
        } else if (isRandomMode) {
            sendButton.textContent = 'Generar Bundle y Enviar al Servidor';
            sendButton.title = 'Generar un bundle aleatorio y enviarlo al servidor FHIR';
        } else {
            sendButton.textContent = 'Generar Bundle y Enviar al Servidor';
            sendButton.title = 'Debe generar un bundle primero';
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
                
                // Check if there are any validation issues
                if (result.issue && result.issue.length > 0) {
                    // Check if all issues are just informational or if there are actual warnings/errors
                    const hasWarningsOrErrors = result.issue.some(issue => 
                        issue.severity === 'warning' || issue.severity === 'error'
                    );
                    
                    if (hasWarningsOrErrors) {
                        // Validation warnings or errors
                        let issuesHtml = '<div class="status-warning">⚠ Bundle válido con advertencias:</div><ul>';
                        result.issue.forEach(issue => {
                            if (issue.severity === 'warning' || issue.severity === 'error') {
                                const severity = issue.severity === 'error' ? '❌' : '⚠️';
                                issuesHtml += `<li>${severity} ${issue.diagnostics || issue.code?.text || 'Problema de validación'}</li>`;
                            }
                        });
                        issuesHtml += '</ul>';
                        validationStatus.innerHTML = issuesHtml;
                    } else {
                        // Only informational issues - bundle is completely valid
                        validationStatus.innerHTML = '<div class="status-success">✓ Bundle válido</div>';
                    }
                } else {
                    // No issues at all - bundle is completely valid
                    validationStatus.innerHTML = '<div class="status-success">✓ Bundle válido</div>';
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
        const bundlePreview = document.getElementById('bundlePreview');
        const generationStatus = document.getElementById('generationStatus');
        const resultsSection = document.getElementById('resultsSection');
        const resultsContent = document.getElementById('resultsContent');

        // Check if we have a valid bundle in the preview
        const hasValidBundle = bundlePreview.value && 
                              !bundlePreview.value.includes('Error') && 
                              bundlePreview.value.trim() !== '';

        if (!hasValidBundle && this.currentMode !== 'random') {
            generationStatus.innerHTML = '<div class="status-error">✗ Error: Debe generar un bundle primero</div>';
            return;
        }

        try {
            generationStatus.innerHTML = '<div class="loading-spinner"></div> Enviando bundle al servidor FHIR...';
            
            let bundle;
            
            if (hasValidBundle) {
                // Use the bundle from the preview
                bundle = JSON.parse(bundlePreview.value);
            } else if (this.currentMode === 'random') {
                // Generate a new random bundle for sending
                bundle = await this.generateBundle();
            } else {
                throw new Error('No se pudo generar el bundle');
            }
            
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
                
                // Extract bundle ID from Location header
                const locationHeader = response.headers.get('Location');
                let bundleId = 'N/A';
                if (locationHeader) {
                    // Extract ID from Location header (e.g., "https://server.com/Bundle/123" -> "123")
                    const match = locationHeader.match(/\/Bundle\/([^\/]+)$/);
                    if (match) {
                        bundleId = match[1];
                    } else {
                        bundleId = locationHeader;
                    }
                }
                
                // Extract patient name from Patient resource
                const patientEntry = bundle.entry?.find(entry => entry.resource.resourceType === 'Patient');
                let patientFullName = 'N/A';
                if (patientEntry && patientEntry.resource.name && patientEntry.resource.name.length > 0) {
                    const patientName = patientEntry.resource.name[0];
                    if (patientName.given && patientName.family) {
                        patientFullName = `${patientName.given.join(' ')} ${patientName.family}`;
                    } else if (patientName.text) {
                        patientFullName = patientName.text;
                    }
                }
                
                const proceduresCount = bundle.entry?.find(entry => entry.resource.resourceType === 'Claim')?.resource.procedure?.length || 0;
                
                resultsSection.style.display = 'block';
                resultsContent.innerHTML = `
                    <div class="result-item result-success">
                        <h6>Bundle Enviado</h6>
                        <p><strong>ID del Bundle:</strong> ${bundleId}</p>
                        <p><strong>Paciente:</strong> ${patientFullName}</p>
                        <p><strong>Prestaciones:</strong> ${proceduresCount}</p>
                        <p><strong>Servidor:</strong> ${this.fhirServer}</p>
                        <p><strong>Respuesta del servidor:</strong> ${result.resourceType} ${result.id || 'N/A'}</p>
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