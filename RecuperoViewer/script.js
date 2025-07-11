// RecuperoViewer JavaScript

let currentBundles = [];
let selectedBundle = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set default date to today
    const today = new Date();
    const dateString = today.toISOString().slice(0, 16);
    document.getElementById('dateFilter').value = dateString;
});

// Search bundles from FHIR server
async function searchBundles() {
    const serverUrl = document.getElementById('serverUrl').value;
    const dateFilter = document.getElementById('dateFilter').value;
    
    if (!serverUrl) {
        showError('Por favor ingrese una URL del servidor FHIR');
        return;
    }
    
    if (!dateFilter) {
        showError('Por favor seleccione un filtro de fecha');
        return;
    }
    
    showLoading(true);
    hideError();
    
    try {
        // Format date for FHIR query
        const date = new Date(dateFilter);
        const formattedDate = date.toISOString().replace('Z', '-03:00');
        const queryUrl = `${serverUrl}?timestamp=ge${formattedDate}`;
        
        console.log('Querying:', queryUrl);
        
        const response = await fetch(queryUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/fhir+json',
                'Content-Type': 'application/fhir+json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        currentBundles = data.entry || [];
        
        displayBundleList();
        showLoading(false);
        
        if (currentBundles.length === 0) {
            showError('No se encontraron bundles para el rango de fechas seleccionado');
        }
        
    } catch (error) {
        console.error('Error al obtener bundles:', error);
        showError(`Error al obtener bundles: ${error.message}`);
        showLoading(false);
    }
}

// Display bundle list
function displayBundleList() {
    const bundleList = document.getElementById('bundleList');
    
    if (currentBundles.length === 0) {
        bundleList.innerHTML = '<div class="text-muted text-center">No se encontraron bundles</div>';
        return;
    }
    
    bundleList.innerHTML = currentBundles.map((entry, index) => {
        const bundle = entry.resource;
        const timestamp = bundle.timestamp ? new Date(bundle.timestamp).toLocaleString() : 'N/A';
        const identifier = bundle.identifier?.value || bundle.id || `Bundle-${index + 1}`;
        
        return `
            <div class="list-group-item bundle-item" onclick="selectBundle(${index})">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <div class="bundle-id">${identifier}</div>
                        <div class="bundle-date">${timestamp}</div>
                    </div>
                    <div class="bundle-type">${bundle.type || 'collection'}</div>
                </div>
            </div>
        `;
    }).join('');
}

// Select a bundle and display its details
function selectBundle(index) {
    // Remove previous selection
    document.querySelectorAll('.bundle-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Add selection to clicked item
    document.querySelectorAll('.bundle-item')[index].classList.add('selected');
    
    selectedBundle = currentBundles[index].resource;
    displayBundleDetails(selectedBundle);
}

// Display detailed bundle information
function displayBundleDetails(bundle) {
    document.getElementById('bundleDetails').style.display = 'block';
    
    // Find resources in the bundle
    const patient = findResourceByType(bundle, 'Patient');
    const claim = findResourceByType(bundle, 'Claim');
    const serviceRequest = findResourceByType(bundle, 'ServiceRequest');
    const practitioners = findAllResourcesByType(bundle, 'Practitioner');
    const organization = findResourceByType(bundle, 'Organization');
    const documentReference = findResourceByType(bundle, 'DocumentReference');
    const encounter = findResourceByType(bundle, 'Encounter');
    
    // Display Patient Demographics
    displayPatientDemographics(patient);
    
    // Display Service Details
    displayServiceDetails(claim, serviceRequest, encounter);
    
    // Display Coverage
    displayCoverage(claim);
    
    // Display Requesting Clinician
    displayRequestingClinician(serviceRequest, practitioners);
    
    // Display Performing Clinician
    displayPerformingClinician(claim, practitioners);
    
    // Display Insurance
    displayInsurance(claim, organization);
    
    // Display Attachments
    displayAttachments(documentReference);
}

// Find resource by type in bundle
function findResourceByType(bundle, resourceType) {
    if (!bundle.entry) return null;
    const entry = bundle.entry.find(e => e.resource?.resourceType === resourceType);
    return entry ? entry.resource : null;
}

// Find all resources by type in bundle
function findAllResourcesByType(bundle, resourceType) {
    if (!bundle.entry) return [];
    return bundle.entry
        .filter(e => e.resource?.resourceType === resourceType)
        .map(e => e.resource);
}

// Display Patient Demographics
function displayPatientDemographics(patient) {
    const container = document.getElementById('patientDemographics');
    
    if (!patient) {
        container.innerHTML = '<div class="text-muted">No hay información del paciente disponible</div>';
        return;
    }
    
    const name = patient.name?.[0];
    const fullName = name ? `${name.given?.join(' ') || ''} ${name.family || ''}`.trim() : 'N/A';
    
    let html = `
        <div class="data-row">
            <span class="data-label">Nombre Completo:</span>
            <span class="data-value">${fullName}</span>
        </div>
        <div class="data-row">
            <span class="data-label">Fecha de Nacimiento:</span>
            <span class="data-value">${patient.birthDate || 'N/A'}</span>
        </div>
        <div class="data-row">
            <span class="data-label">Género:</span>
            <span class="data-value">${patient.gender || 'N/A'}</span>
        </div>
    `;
    
    // Display all patient identifiers
    if (patient.identifier && patient.identifier.length > 0) {
        html += '<div class="mt-3"><strong>Identificadores:</strong></div>';
        patient.identifier.forEach((identifier, index) => {
            html += `
                <div class="data-row">
                    <span class="data-label">Identificador ${index + 1}:</span>
                    <span class="data-value">${identifier.value || 'N/A'} (${identifier.system || 'Sin sistema'})</span>
                </div>
            `;
        });
    }
    
    container.innerHTML = html;
}

// Display Service Details
function displayServiceDetails(claim, serviceRequest, encounter) {
    const container = document.getElementById('serviceDetails');
    
    if (!claim && !serviceRequest) {
        container.innerHTML = '<div class="text-muted">No hay información del servicio disponible</div>';
        return;
    }
    
    let html = '';
    
    // Claim information
    if (claim) {
        html += `
            <div class="data-row">
                <span class="data-label">ID del Reclamo:</span>
                <span class="data-value">${claim.id || 'N/A'}</span>
            </div>
            <div class="data-row">
                <span class="data-label">Estado del Reclamo:</span>
                <span class="data-value">${claim.status || 'N/A'}</span>
            </div>
            <div class="data-row">
                <span class="data-label">Fecha de Creación:</span>
                <span class="data-value">${claim.created ? new Date(claim.created).toLocaleString() : 'N/A'}</span>
            </div>
        `;
        
        // Facility information
        if (claim.facility) {
            html += `
                <div class="data-row">
                    <span class="data-label">Servicio:</span>
                    <span class="data-value">${claim.facility.display || 'N/A'}</span>
                </div>
            `;
        }
        
        // Procedures
        if (claim.procedure && claim.procedure.length > 0) {
            html += '<div class="mt-3"><strong>Procedimientos:</strong></div>';
            claim.procedure.forEach(proc => {
                const coding = proc.procedureCodeableConcept?.coding?.[0];
                html += `
                    <div class="procedure-item">
                        <div class="procedure-code">${coding?.code || 'N/A'}</div>
                        <div class="procedure-description">${coding?.display || 'N/A'}</div>
                        <div class="procedure-date">Fecha: ${proc.date || 'N/A'}</div>
                    </div>
                `;
            });
        }
        
        // Diagnoses
        if (claim.diagnosis && claim.diagnosis.length > 0) {
            html += '<div class="mt-3"><strong>Diagnósticos:</strong></div>';
            claim.diagnosis.forEach(diag => {
                const coding = diag.diagnosisCodeableConcept?.coding?.[0];
                html += `
                    <div class="procedure-item" style="border-left-color: #dc3545;">
                        <div class="procedure-code">${coding?.code || 'N/A'}</div>
                        <div class="procedure-description">${coding?.display || 'N/A'}</div>
                    </div>
                `;
            });
        }
    }
    
    // Encounter information
    if (encounter) {
        html += `
            <div class="data-row">
                <span class="data-label">Número de Encuentro:</span>
                <span class="data-value">${encounter.id || 'N/A'}</span>
            </div>
            <div class="data-row">
                <span class="data-label">Estado del Encuentro:</span>
                <span class="data-value">${encounter.status || 'N/A'}</span>
            </div>
        `;
        
        if (encounter.class) {
            html += `
                <div class="data-row">
                    <span class="data-label">Tipo de Encuentro:</span>
                    <span class="data-value">${encounter.class.display || encounter.class.code || 'N/A'}</span>
                </div>
            `;
        }
    }
    
    // ServiceRequest information
    if (serviceRequest) {
        html += `
            <div class="data-row">
                <span class="data-label">ID de Solicitud de Servicio:</span>
                <span class="data-value">${serviceRequest.id || 'N/A'}</span>
            </div>
            <div class="data-row">
                <span class="data-label">Estado:</span>
                <span class="data-value">${serviceRequest.status || 'N/A'}</span>
            </div>
            <div class="data-row">
                <span class="data-label">Intención:</span>
                <span class="data-value">${serviceRequest.intent || 'N/A'}</span>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// Display Coverage
function displayCoverage(claim) {
    const container = document.getElementById('coverageDetails');
    
    if (!claim || !claim.insurance) {
        container.innerHTML = '<div class="text-muted">No hay información de cobertura disponible</div>';
        return;
    }
    
    let html = '';
    claim.insurance.forEach((ins, index) => {
        html += `
            <div class="data-row">
                <span class="data-label">Seguro ${index + 1}:</span>
                <span class="data-value">${ins.coverage?.display || ins.coverage?.identifier?.value || 'N/A'}</span>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Display Requesting Clinician
function displayRequestingClinician(serviceRequest, practitioners) {
    const container = document.getElementById('requestingClinician');
    
    if (!serviceRequest) {
        container.innerHTML = '<div class="text-muted">No hay información del médico solicitante disponible</div>';
        return;
    }
    
    const requester = serviceRequest.requester;
    let html = `
        <div class="data-row">
            <span class="data-label">Referencia del Solicitante:</span>
            <span class="data-value">${requester?.reference || 'N/A'}</span>
        </div>
    `;
    
    // Find the practitioner that matches the requester reference
    const requestingPractitioner = practitioners.find(p => 
        requester?.reference?.includes(p.id) || 
        requester?.reference?.includes(p.identifier?.[0]?.value)
    );
    
    if (requestingPractitioner) {
        const name = requestingPractitioner.name?.[0];
        const fullName = name ? `${name.given?.join(' ') || ''} ${name.family || ''}`.trim() : 'N/A';
        
        html += `
            <div class="data-row">
                <span class="data-label">Nombre del Médico:</span>
                <span class="data-value">${fullName}</span>
            </div>
        `;
        
        // Display practitioner identifier
        if (requestingPractitioner.identifier && requestingPractitioner.identifier.length > 0) {
            html += `
                <div class="data-row">
                    <span class="data-label">Identificador:</span>
                    <span class="data-value">${requestingPractitioner.identifier[0]?.value || 'N/A'}</span>
                </div>
            `;
        }
        
        // Display practitioner qualification
        if (requestingPractitioner.qualification && requestingPractitioner.qualification.length > 0) {
            const qualification = requestingPractitioner.qualification[0];
            html += `
                <div class="data-row">
                    <span class="data-label">Especialidad:</span>
                    <span class="data-value">${qualification.code?.display || qualification.code?.code || 'N/A'}</span>
                </div>
            `;
        }
    }
    
    container.innerHTML = html;
}

// Display Performing Clinician
function displayPerformingClinician(claim, practitioners) {
    const container = document.getElementById('performingClinician');
    
    if (!claim) {
        container.innerHTML = '<div class="text-muted">No hay información del médico ejecutante disponible</div>';
        return;
    }
    
    let html = '<div class="text-muted">Información no disponible en la estructura actual del bundle</div>';
    
    // Try to find performing practitioner from claim information
    // This might be in claim.provider, claim.careTeam, or other fields
    if (claim.provider) {
        const performingPractitioner = practitioners.find(p => 
            claim.provider?.reference?.includes(p.id) || 
            claim.provider?.reference?.includes(p.identifier?.[0]?.value)
        );
        
        if (performingPractitioner) {
            const name = performingPractitioner.name?.[0];
            const fullName = name ? `${name.given?.join(' ') || ''} ${name.family || ''}`.trim() : 'N/A';
            
            html = `
                <div class="data-row">
                    <span class="data-label">Nombre del Médico:</span>
                    <span class="data-value">${fullName}</span>
                </div>
            `;
            
            // Display practitioner identifier
            if (performingPractitioner.identifier && performingPractitioner.identifier.length > 0) {
                html += `
                    <div class="data-row">
                        <span class="data-label">Identificador:</span>
                        <span class="data-value">${performingPractitioner.identifier[0]?.value || 'N/A'}</span>
                    </div>
                `;
            }
            
            // Display practitioner qualification
            if (performingPractitioner.qualification && performingPractitioner.qualification.length > 0) {
                const qualification = performingPractitioner.qualification[0];
                html += `
                    <div class="data-row">
                        <span class="data-label">Especialidad:</span>
                        <span class="data-value">${qualification.code?.display || qualification.code?.code || 'N/A'}</span>
                    </div>
                `;
            }
        }
    }
    
    container.innerHTML = html;
}

// Display Insurance
function displayInsurance(claim, organization) {
    const container = document.getElementById('insuranceDetails');
    
    if (!claim || !claim.insurance) {
        container.innerHTML = '<div class="text-muted">No hay información de seguro disponible</div>';
        return;
    }
    
    let html = '';
    claim.insurance.forEach((ins, index) => {
        const coverage = ins.coverage;
        html += `
            <div class="data-row">
                <span class="data-label">ID del Seguro ${index + 1}:</span>
                <span class="data-value">${coverage?.identifier?.value || 'N/A'}</span>
            </div>
            <div class="data-row">
                <span class="data-label">Sistema del Seguro ${index + 1}:</span>
                <span class="data-value">${coverage?.identifier?.system || 'N/A'}</span>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Display Attachments
function displayAttachments(documentReference) {
    const container = document.getElementById('attachments');
    
    if (!documentReference) {
        container.innerHTML = '<div class="text-muted">No hay adjuntos disponibles</div>';
        return;
    }
    
    let html = `
        <div class="data-row">
            <span class="data-label">ID del Documento:</span>
            <span class="data-value">${documentReference.id || 'N/A'}</span>
        </div>
        <div class="data-row">
            <span class="data-label">Estado del Documento:</span>
            <span class="data-value">${documentReference.status || 'N/A'}</span>
        </div>
        <div class="data-row">
            <span class="data-label">Fecha del Documento:</span>
            <span class="data-value">${documentReference.date ? new Date(documentReference.date).toLocaleString() : 'N/A'}</span>
        </div>
    `;
    
    // Add attachment links if available
    if (documentReference.content && documentReference.content.length > 0) {
        html += '<div class="mt-3"><strong>Adjuntos:</strong></div>';
        documentReference.content.forEach((content, index) => {
            const attachment = content.attachment;
            if (attachment && attachment.url) {
                html += `
                    <div class="mt-2">
                        <a href="${attachment.url}" target="_blank" class="attachment-link">
                            <i class="bi bi-file-earmark-pdf"></i> 
                            Ver Adjunto ${index + 1}
                        </a>
                    </div>
                `;
            }
        });
    }
    
    container.innerHTML = html;
}

// Export current bundle as JSON
function exportBundle() {
    if (!selectedBundle) {
        showError('No hay bundle seleccionado para exportar');
        return;
    }
    
    const dataStr = JSON.stringify(selectedBundle, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `bundle-${selectedBundle.id || 'export'}.json`;
    link.click();
}

// Utility functions
function showLoading(show) {
    document.getElementById('loadingSpinner').style.display = show ? 'block' : 'none';
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideError() {
    document.getElementById('errorMessage').style.display = 'none';
} 