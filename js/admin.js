// Admin Panel JavaScript for Zaans Recht
// Handles CRUD operations for Cases, Clients, Appointments, and Documents

// Data Storage Keys
const STORAGE_KEYS = {
    cases: 'zaansrecht_cases',
    clients: 'zaansrecht_clients', 
    appointments: 'zaansrecht_appointments',
    documents: 'zaansrecht_documents'
};

// Current editing item
let currentEditItem = null;
let currentEditType = null;

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    loadCases();
    loadClients();
    loadAppointments();
    loadDocuments();
});

// Section Management
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active', 'border-zaans-blue', 'text-zaans-blue');
        tab.classList.add('border-transparent', 'text-gray-500');
    });
    
    // Show selected section
    document.getElementById(sectionName + '-section').classList.remove('hidden');
    
    // Activate selected tab
    const activeTab = document.getElementById(sectionName + '-tab');
    activeTab.classList.add('active', 'border-zaans-blue', 'text-zaans-blue');
    activeTab.classList.remove('border-transparent', 'text-gray-500');
}

// Modal Management
function showModal(title, content) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-content').innerHTML = content;
    document.getElementById('admin-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('admin-modal').classList.add('hidden');
    currentEditItem = null;
    currentEditType = null;
}

// Utility Functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('nl-NL');
}

function getStorageData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

function setStorageData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// === CASES CRUD ===

function loadCases() {
    const cases = getStorageData(STORAGE_KEYS.cases);
    const casesList = document.getElementById('cases-list');
    
    if (cases.length === 0) {
        casesList.innerHTML = '<p class="text-gray-500 text-center py-8">Geen zaken gevonden. Voeg uw eerste zaak toe.</p>';
        return;
    }
    
    casesList.innerHTML = `
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zaaknummer</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliënt</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Onderwerp</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${cases.map(caseItem => `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${caseItem.caseNumber}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${caseItem.clientName}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${caseItem.subject}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 py-1 text-xs rounded-full ${getStatusColor(caseItem.status)}">${caseItem.status}</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(caseItem.createdDate)}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button onclick="viewCase('${caseItem.id}')" class="text-zaans-blue hover:text-blue-900 mr-3">Bekijk</button>
                                <button onclick="editCase('${caseItem.id}')" class="text-indigo-600 hover:text-indigo-900 mr-3">Bewerk</button>
                                <button onclick="deleteCase('${caseItem.id}')" class="text-red-600 hover:text-red-900">Verwijder</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function getStatusColor(status) {
    const colors = {
        'Nieuw': 'bg-blue-100 text-blue-800',
        'In behandeling': 'bg-yellow-100 text-yellow-800', 
        'Afgerond': 'bg-green-100 text-green-800',
        'Geannuleerd': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}

function showCaseForm(caseId = null) {
    const isEdit = caseId !== null;
    let caseData = null;
    
    if (isEdit) {
        const cases = getStorageData(STORAGE_KEYS.cases);
        caseData = cases.find(c => c.id === caseId);
        currentEditItem = caseData;
        currentEditType = 'case';
    }
    
    const formContent = `
        <form id="case-form" class="space-y-6">
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Zaaknummer *</label>
                    <input type="text" id="case-number" value="${caseData?.caseNumber || ''}" required 
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zaans-blue focus:border-transparent" 
                           placeholder="ZR-2025-001">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Cliënt naam *</label>
                    <input type="text" id="client-name" value="${caseData?.clientName || ''}" required 
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zaans-blue focus:border-transparent" 
                           placeholder="J. de Vries">
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Onderwerp *</label>
                <input type="text" id="case-subject" value="${caseData?.subject || ''}" required 
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zaans-blue focus:border-transparent" 
                       placeholder="Arbeidsconflict">
            </div>
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Rechtsgebied *</label>
                    <select id="case-category" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zaans-blue focus:border-transparent">
                        <option value="">Selecteer rechtsgebied</option>
                        <option value="Ondernemingsrecht" ${caseData?.category === 'Ondernemingsrecht' ? 'selected' : ''}>Ondernemingsrecht</option>
                        <option value="Familierecht" ${caseData?.category === 'Familierecht' ? 'selected' : ''}>Familierecht</option>
                        <option value="Arbeidsrecht" ${caseData?.category === 'Arbeidsrecht' ? 'selected' : ''}>Arbeidsrecht</option>
                        <option value="Bestuursrecht" ${caseData?.category === 'Bestuursrecht' ? 'selected' : ''}>Bestuursrecht</option>
                        <option value="Verbintenissenrecht" ${caseData?.category === 'Verbintenissenrecht' ? 'selected' : ''}>Verbintenissenrecht</option>
                        <option value="Overig" ${caseData?.category === 'Overig' ? 'selected' : ''}>Overig</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                    <select id="case-status" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zaans-blue focus:border-transparent">
                        <option value="Nieuw" ${caseData?.status === 'Nieuw' ? 'selected' : ''}>Nieuw</option>
                        <option value="In behandeling" ${caseData?.status === 'In behandeling' ? 'selected' : ''}>In behandeling</option>
                        <option value="Afgerond" ${caseData?.status === 'Afgerond' ? 'selected' : ''}>Afgerond</option>
                        <option value="Geannuleerd" ${caseData?.status === 'Geannuleerd' ? 'selected' : ''}>Geannuleerd</option>
                    </select>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Beschrijving</label>
                <textarea id="case-description" rows="4" 
                          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zaans-blue focus:border-transparent" 
                          placeholder="Beschrijving van de zaak...">${caseData?.description || ''}</textarea>
            </div>
            <div class="flex justify-end space-x-4">
                <button type="button" onclick="closeModal()" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Annuleren
                </button>
                <button type="submit" class="px-6 py-2 bg-zaans-blue text-white rounded-lg hover:bg-blue-900">
                    ${isEdit ? 'Bijwerken' : 'Toevoegen'}
                </button>
            </div>
        </form>
    `;
    
    showModal(isEdit ? 'Zaak bewerken' : 'Nieuwe zaak toevoegen', formContent);
    
    document.getElementById('case-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveCase();
    });
}

function saveCase() {
    const formData = {
        id: currentEditItem?.id || generateId(),
        caseNumber: document.getElementById('case-number').value,
        clientName: document.getElementById('client-name').value,
        subject: document.getElementById('case-subject').value,
        category: document.getElementById('case-category').value,
        status: document.getElementById('case-status').value,
        description: document.getElementById('case-description').value,
        createdDate: currentEditItem?.createdDate || new Date().toISOString(),
        updatedDate: new Date().toISOString()
    };
    
    const cases = getStorageData(STORAGE_KEYS.cases);
    
    if (currentEditItem) {
        // Update existing case
        const index = cases.findIndex(c => c.id === currentEditItem.id);
        cases[index] = formData;
    } else {
        // Add new case
        cases.push(formData);
    }
    
    setStorageData(STORAGE_KEYS.cases, cases);
    loadCases();
    closeModal();
}

function viewCase(caseId) {
    const cases = getStorageData(STORAGE_KEYS.cases);
    const caseData = cases.find(c => c.id === caseId);
    
    const viewContent = `
        <div class="space-y-4">
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Zaaknummer</label>
                    <p class="mt-1 text-sm text-gray-900">${caseData.caseNumber}</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Status</label>
                    <span class="mt-1 px-2 py-1 text-xs rounded-full ${getStatusColor(caseData.status)}">${caseData.status}</span>
                </div>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Cliënt</label>
                    <p class="mt-1 text-sm text-gray-900">${caseData.clientName}</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Rechtsgebied</label>
                    <p class="mt-1 text-sm text-gray-900">${caseData.category}</p>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Onderwerp</label>
                <p class="mt-1 text-sm text-gray-900">${caseData.subject}</p>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Beschrijving</label>
                <p class="mt-1 text-sm text-gray-900">${caseData.description || 'Geen beschrijving opgegeven'}</p>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Aangemaakt</label>
                    <p class="mt-1 text-sm text-gray-900">${formatDate(caseData.createdDate)}</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Laatst bijgewerkt</label>
                    <p class="mt-1 text-sm text-gray-900">${formatDate(caseData.updatedDate)}</p>
                </div>
            </div>
            <div class="flex justify-end space-x-4 pt-4">
                <button onclick="closeModal()" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Sluiten
                </button>
                <button onclick="closeModal(); editCase('${caseData.id}')" class="px-6 py-2 bg-zaans-blue text-white rounded-lg hover:bg-blue-900">
                    Bewerken
                </button>
            </div>
        </div>
    `;
    
    showModal('Zaak details', viewContent);
}

function editCase(caseId) {
    showCaseForm(caseId);
}

function deleteCase(caseId) {
    if (confirm('Weet u zeker dat u deze zaak wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.')) {
        const cases = getStorageData(STORAGE_KEYS.cases);
        const filteredCases = cases.filter(c => c.id !== caseId);
        setStorageData(STORAGE_KEYS.cases, filteredCases);
        loadCases();
    }
}

// === CLIENTS CRUD ===
// Placeholder functions - to be implemented
function loadClients() {
    const clientsList = document.getElementById('clients-list');
    clientsList.innerHTML = '<p class="text-gray-500 text-center py-8">Cliënten functionaliteit wordt binnenkort toegevoegd.</p>';
}

function showClientForm() {
    // To be implemented
}

// === APPOINTMENTS CRUD ===
// Placeholder functions - to be implemented  
function loadAppointments() {
    const appointmentsList = document.getElementById('appointments-list');
    appointmentsList.innerHTML = '<p class="text-gray-500 text-center py-8">Afspraken functionaliteit wordt binnenkort toegevoegd.</p>';
}

function showAppointmentForm() {
    // To be implemented
}

// === DOCUMENTS CRUD ===
// Placeholder functions - to be implemented
function loadDocuments() {
    const documentsList = document.getElementById('documents-list');
    documentsList.innerHTML = '<p class="text-gray-500 text-center py-8">Documenten functionaliteit wordt binnenkort toegevoegd.</p>';
}

function showDocumentForm() {
    // To be implemented
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.id === 'admin-modal') {
        closeModal();
    }
});

// Escape key to close modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});