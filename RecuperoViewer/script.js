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
            showError('No se encontraron solicitudes para el rango de fechas seleccionado');
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
        bundleList.innerHTML = '<div class="text-muted text-center">No se encontraron solicitudes</div>';
        return;
    }
    
    bundleList.innerHTML = currentBundles.map((entry, index) => {
        const bundle = entry.resource;
        const timestamp = bundle.timestamp ? new Date(bundle.timestamp).toLocaleString() : 'N/A';
        const identifier = bundle.identifier?.value || bundle.id || `Solicitud-${index + 1}`;
        
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
    const documentReference = findResourceByType(bundle, 'DocumentReference');
    const encounter = findResourceByType(bundle, 'Encounter');
    
    // Display Patient Demographics
    displayPatientDemographics(patient);
    
    // Display Service Details (Claim, ServiceRequest, Encounter)
    displayServiceDetails(claim, serviceRequest, encounter);
    
    // Display Insurance (from Claim.insurance)
    displayInsurance(claim);
    
    // Display Requesting Clinician (from ServiceRequest.requester)
    displayRequestingClinician(serviceRequest, practitioners, bundle);
    
    // Display Performing Clinician (from ServiceRequest.performer)
    displayPerformingClinician(serviceRequest, practitioners, bundle);
    
    // Display Attachments (from DocumentReference)
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
    
    // ServiceRequest information (primary service details)
    if (serviceRequest) {
        html += `
            <div class="data-row">
                <span class="data-label">Fecha de Solicitud:</span>
                <span class="data-value">${serviceRequest.authoredOn ? new Date(serviceRequest.authoredOn).toLocaleString() : 'N/A'}</span>
            </div>
            <div class="data-row">
                <span class="data-label">Fecha de Servicio:</span>
                <span class="data-value">${serviceRequest.occurrenceDateTime ? new Date(serviceRequest.occurrenceDateTime).toLocaleString() : 'N/A'}</span>
            </div>
        `;
    }
    
    // Claim information (billing details)
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
        
        // Provider information
        if (claim.provider) {
            html += `
                <div class="data-row">
                    <span class="data-label">Proveedor:</span>
                    <span class="data-value">${claim.provider.display || 'N/A'}</span>
                </div>
            `;
        }
        
        // Facility information
        if (claim.facility) {
            html += `
                <div class="data-row">
                    <span class="data-label">Institución:</span>
                    <span class="data-value">${claim.facility.display || 'N/A'}</span>
                </div>
            `;
        }
        
        // Diagnosis
        if (claim.diagnosis && claim.diagnosis.length > 0) {
            html += '<div class="mt-3"><strong>Diagnósticos:</strong></div>';
            claim.diagnosis.forEach(diag => {
                const coding = diag.diagnosisCodeableConcept?.coding?.[0];
                html += `
                    <div class="diagnosis-item">
                        <div class="diagnosis-code">${coding?.code || 'N/A'}</div>
                        <div class="diagnosis-description">${coding?.display || 'N/A'}</div>
                    </div>
                `;
            });
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
        

    }
    
    // Encounter information
    if (encounter) {
        html += `
            <div class="data-row">
                <span class="data-label">Número de Encuentro:</span>
                <span class="data-value">${encounter.identifier?.[0]?.value || encounter.id || 'N/A'}</span>
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
    
    container.innerHTML = html;
}



// Display Requesting Clinician
function displayRequestingClinician(serviceRequest, practitioners, bundle) {
    const container = document.getElementById('requestingClinician');
    
    if (!serviceRequest) {
        container.innerHTML = '<div class="text-muted">No hay información del médico solicitante disponible</div>';
        return;
    }
    
    const requester = serviceRequest.requester;
    let html = '';
    
    // Find the practitioner by matching the reference UUID with the bundle entry fullUrl
    let requestingPractitioner = null;
    if (requester?.reference && bundle?.entry) {
        const referenceUUID = requester.reference.replace('urn:uuid:', '');
        const practitionerEntry = bundle.entry.find(entry => 
            entry.fullUrl && entry.fullUrl.includes(referenceUUID)
        );
        if (practitionerEntry && practitionerEntry.resource?.resourceType === 'Practitioner') {
            requestingPractitioner = practitionerEntry.resource;
        }
    }
    
    if (requestingPractitioner) {
        const name = requestingPractitioner.name?.[0];
        // Handle both structured name (given/family) and text name
        let fullName = 'N/A';
        if (name) {
            if (name.text) {
                fullName = name.text;
            } else {
                fullName = `${name.given?.join(' ') || ''} ${name.family || ''}`.trim();
            }
        }
        
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
            const coding = qualification.code?.coding?.[0];
            html += `
                <div class="data-row">
                    <span class="data-label">Especialidad:</span>
                    <span class="data-value">${coding?.display || coding?.code || 'N/A'}</span>
                </div>
            `;
        }
    }
    
    container.innerHTML = html;
}

// Display Performing Clinician
function displayPerformingClinician(serviceRequest, practitioners, bundle) {
    const container = document.getElementById('performingClinician');
    
    if (!serviceRequest) {
        container.innerHTML = '<div class="text-muted">No hay información del médico ejecutante disponible</div>';
        return;
    }
    
    let html = '';
    
    // Try to find performing practitioner from service request performer
    if (serviceRequest.performer && serviceRequest.performer.length > 0) {
        const performer = serviceRequest.performer[0]; // Get first performer
        
        // Find the practitioner by matching the reference UUID with the bundle entry fullUrl
        let performingPractitioner = null;
        if (performer?.reference && bundle?.entry) {
            const referenceUUID = performer.reference.replace('urn:uuid:', '');
            const practitionerEntry = bundle.entry.find(entry => 
                entry.fullUrl && entry.fullUrl.includes(referenceUUID)
            );
            if (practitionerEntry && practitionerEntry.resource?.resourceType === 'Practitioner') {
                performingPractitioner = practitionerEntry.resource;
            }
        }
        
        if (performingPractitioner) {
            const name = performingPractitioner.name?.[0];
            // Handle both structured name (given/family) and text name
            let fullName = 'N/A';
            if (name) {
                if (name.text) {
                    fullName = name.text;
                } else {
                    fullName = `${name.given?.join(' ') || ''} ${name.family || ''}`.trim();
                }
            }
            
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
                const coding = qualification.code?.coding?.[0];
                html += `
                    <div class="data-row">
                        <span class="data-label">Especialidad:</span>
                        <span class="data-value">${coding?.display || coding?.code || 'N/A'}</span>
                    </div>
                `;
            }
        }
    }
    
    container.innerHTML = html;
}

// Display Insurance
function displayInsurance(claim) {
    const container = document.getElementById('insuranceDetails');
    
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
    
    // Add attachment buttons if available
    if (documentReference.content && documentReference.content.length > 0) {
        html += '<div class="mt-3"><strong>Adjuntos:</strong></div>';
        documentReference.content.forEach((content, index) => {
            const attachment = content.attachment;
            if (attachment && attachment.data) {
                html += `
                    <div class="mt-2">
                        <button class="btn btn-outline-primary btn-sm" onclick="viewPDF('${attachment.data}', '${attachment.contentType || 'application/pdf'}')">
                            <i class="bi bi-file-earmark-pdf"></i> Ver PDF
                        </button>
                    </div>
                `;
            }
        });
    }
    
    container.innerHTML = html;
}

// View PDF from base64 data
function viewPDF(base64Data, contentType) {
    try {
        // Convert base64 to blob
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: contentType });
        
        // Create URL for the blob
        const url = URL.createObjectURL(blob);
        
        // Open PDF in new window/tab
        window.open(url, '_blank');
        
        // Clean up the URL after a delay
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);
        
    } catch (error) {
        console.error('Error viewing PDF:', error);
        alert('Error al mostrar el PDF. Verifique que los datos sean válidos.');
    }
}

// Show JSON in modal
function showJSON() {
    if (!selectedBundle) {
        showError('No hay solicitud seleccionada para mostrar');
        return;
    }
    
    const jsonTextarea = document.getElementById('jsonTextarea');
    const formattedJSON = JSON.stringify(selectedBundle, null, 2);
    jsonTextarea.value = formattedJSON;
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('jsonModal'));
    modal.show();
}

// Copy JSON to clipboard
function copyJSON() {
    const jsonTextarea = document.getElementById('jsonTextarea');
    jsonTextarea.select();
    jsonTextarea.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        document.execCommand('copy');
        // Show success message
        const copyButton = document.querySelector('#jsonModal .btn-primary');
        const originalText = copyButton.textContent;
        copyButton.textContent = '¡Copiado!';
        copyButton.classList.remove('btn-primary');
        copyButton.classList.add('btn-success');
        
        setTimeout(() => {
            copyButton.textContent = originalText;
            copyButton.classList.remove('btn-success');
            copyButton.classList.add('btn-primary');
        }, 2000);
    } catch (err) {
        console.error('Error copying to clipboard:', err);
    }
}

// Export current bundle as JSON
function exportBundle() {
    if (!selectedBundle) {
        showError('No hay solicitud seleccionada para exportar');
        return;
    }
    
    const dataStr = JSON.stringify(selectedBundle, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `solicitud-${selectedBundle.id || 'export'}.json`;
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