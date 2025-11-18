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

function loadClients() {
    const clients = getStorageData(STORAGE_KEYS.clients);
    const clientsList = document.getElementById('clients-list');
    
    if (clients.length === 0) {
        clientsList.innerHTML = '<p class="text-gray-500 text-center py-8">Geen cliënten gevonden. Voeg uw eerste cliënt toe.</p>';
        return;
    }
    
    clientsList.innerHTML = `
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Naam</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefoon</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${clients.map(client => `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${client.firstName} ${client.lastName}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${client.email}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${client.phone}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 py-1 text-xs rounded-full ${getClientTypeColor(client.clientType)}">${client.clientType}</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(client.createdDate)}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button onclick="viewClient('${client.id}')" class="text-zaans-blue hover:text-blue-900 mr-3">Bekijk</button>
                                <button onclick="editClient('${client.id}')" class="text-indigo-600 hover:text-indigo-900 mr-3">Bewerk</button>
                                <button onclick="deleteClient('${client.id}')" class="text-red-600 hover:text-red-900">Verwijder</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function getClientTypeColor(type) {
    const colors = {
        'Particulier': 'bg-blue-100 text-blue-800',
        'Bedrijf': 'bg-green-100 text-green-800',
        'ZZP': 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
}

function showClientForm(clientId = null) {
    const isEdit = clientId !== null;
    let clientData = null;
    
    if (isEdit) {
        const clients = getStorageData(STORAGE_KEYS.clients);
        clientData = clients.find(c => c.id === clientId);
        currentEditItem = clientData;
        currentEditType = 'client';
    }
    
    const formContent = `
        <form id="client-form" class="space-y-6">
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Voornaam *</label>
                    <input type="text" id="client-first-name" value="${clientData?.firstName || ''}" required 
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zaans-blue focus:border-transparent" 
                           placeholder="Jan">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Achternaam *</label>
                    <input type="text" id="client-last-name" value="${clientData?.lastName || ''}" required 
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zaans-blue focus:border-transparent" 
                           placeholder="de Vries">
                </div>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">E-mail *</label>
                    <input type="email" id="client-email" value="${clientData?.email || ''}" required 
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zaans-blue focus:border-transparent" 
                           placeholder="jan.devries@voorbeeld.nl">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Telefoon *</label>
                    <input type="tel" id="client-phone" value="${clientData?.phone || ''}" required 
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zaans-blue focus:border-transparent" 
                           placeholder="06-12345678">
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Type cliënt *</label>
                <select id="client-type" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zaans-blue focus:border-transparent">
                    <option value="">Selecteer type cliënt</option>
                    <option value="Particulier" ${clientData?.clientType === 'Particulier' ? 'selected' : ''}>Particulier</option>
                    <option value="Bedrijf" ${clientData?.clientType === 'Bedrijf' ? 'selected' : ''}>Bedrijf</option>
                    <option value="ZZP" ${clientData?.clientType === 'ZZP' ? 'selected' : ''}>ZZP</option>
                </select>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                    <input type="text" id="client-address" value="${clientData?.address || ''}"
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zaans-blue focus:border-transparent" 
                           placeholder="Straatnaam 123">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Postcode & Plaats</label>
                    <input type="text" id="client-city" value="${clientData?.city || ''}"
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zaans-blue focus:border-transparent" 
                           placeholder="1234 AB Amsterdam">
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Notities</label>
                <textarea id="client-notes" rows="3" 
                          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zaans-blue focus:border-transparent" 
                          placeholder="Aanvullende informatie over de cliënt...">${clientData?.notes || ''}</textarea>
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
    
    showModal(isEdit ? 'Cliënt bewerken' : 'Nieuwe cliënt toevoegen', formContent);
    
    document.getElementById('client-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveClient();
    });
}

function saveClient() {
    const formData = {
        id: currentEditItem?.id || generateId(),
        firstName: document.getElementById('client-first-name').value,
        lastName: document.getElementById('client-last-name').value,
        email: document.getElementById('client-email').value,
        phone: document.getElementById('client-phone').value,
        clientType: document.getElementById('client-type').value,
        address: document.getElementById('client-address').value,
        city: document.getElementById('client-city').value,
        notes: document.getElementById('client-notes').value,
        createdDate: currentEditItem?.createdDate || new Date().toISOString(),
        updatedDate: new Date().toISOString()
    };
    
    const clients = getStorageData(STORAGE_KEYS.clients);
    
    if (currentEditItem) {
        // Update existing client
        const index = clients.findIndex(c => c.id === currentEditItem.id);
        clients[index] = formData;
    } else {
        // Add new client
        clients.push(formData);
    }
    
    setStorageData(STORAGE_KEYS.clients, clients);
    loadClients();
    closeModal();
}

function viewClient(clientId) {
    const clients = getStorageData(STORAGE_KEYS.clients);
    const clientData = clients.find(c => c.id === clientId);
    
    const viewContent = `
        <div class="space-y-4">
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Voornaam</label>
                    <p class="mt-1 text-sm text-gray-900">${clientData.firstName}</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Achternaam</label>
                    <p class="mt-1 text-sm text-gray-900">${clientData.lastName}</p>
                </div>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">E-mail</label>
                    <p class="mt-1 text-sm text-gray-900">${clientData.email}</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Telefoon</label>
                    <p class="mt-1 text-sm text-gray-900">${clientData.phone}</p>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Type cliënt</label>
                <span class="mt-1 px-2 py-1 text-xs rounded-full ${getClientTypeColor(clientData.clientType)}">${clientData.clientType}</span>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Adres</label>
                    <p class="mt-1 text-sm text-gray-900">${clientData.address || 'Niet opgegeven'}</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Postcode & Plaats</label>
                    <p class="mt-1 text-sm text-gray-900">${clientData.city || 'Niet opgegeven'}</p>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Notities</label>
                <p class="mt-1 text-sm text-gray-900">${clientData.notes || 'Geen notities opgegeven'}</p>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Aangemaakt</label>
                    <p class="mt-1 text-sm text-gray-900">${formatDate(clientData.createdDate)}</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Laatst bijgewerkt</label>
                    <p class="mt-1 text-sm text-gray-900">${formatDate(clientData.updatedDate)}</p>
                </div>
            </div>
            <div class="flex justify-end space-x-4 pt-4">
                <button onclick="closeModal()" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Sluiten
                </button>
                <button onclick="closeModal(); editClient('${clientData.id}')" class="px-6 py-2 bg-zaans-blue text-white rounded-lg hover:bg-blue-900">
                    Bewerken
                </button>
            </div>
        </div>
    `;
    
    showModal('Cliënt details', viewContent);
}

function editClient(clientId) {
    showClientForm(clientId);
}

function deleteClient(clientId) {
    if (confirm('Weet u zeker dat u deze cliënt wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.')) {
        const clients = getStorageData(STORAGE_KEYS.clients);
        const filteredClients = clients.filter(c => c.id !== clientId);
        setStorageData(STORAGE_KEYS.clients, filteredClients);
        loadClients();
    }
}

// === APPOINTMENTS CRUD ===

function loadAppointments() {
    const appointments = getStorageData(STORAGE_KEYS.appointments);
    const appointmentsList = document.getElementById('appointments-list');
    
    if (appointments.length === 0) {
        appointmentsList.innerHTML = '<p class="text-gray-500 text-center py-8">Geen afspraken gevonden. Voeg uw eerste afspraak toe.</p>';
        return;
    }
    
    appointmentsList.innerHTML = `
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliënt</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tijd</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rechtsgebied</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${appointments.map(appointment => `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${appointment.firstName} ${appointment.lastName}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(appointment.appointmentDate)}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${appointment.appointmentTime}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${appointment.appointmentType}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${appointment.legalArea}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 py-1 text-xs rounded-full ${getAppointmentStatusColor(appointment.status)}">${appointment.status}</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button onclick="viewAppointment('${appointment.id}')" class="text-zaans-blue hover:text-blue-900 mr-3">Bekijk</button>
                                <button onclick="editAppointment('${appointment.id}')" class="text-indigo-600 hover:text-indigo-900 mr-3">Bewerk</button>
                                <button onclick="deleteAppointment('${appointment.id}')" class="text-red-600 hover:text-red-900">Verwijder</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function getAppointmentStatusColor(status) {
    const colors = {
        'Gepland': 'bg-blue-100 text-blue-800',
        'Bevestigd': 'bg-green-100 text-green-800',
        'Afgerond': 'bg-gray-100 text-gray-800',
        'Geannuleerd': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}

function showAppointmentForm(appointmentId = null) {
    const isEdit = appointmentId !== null;
    let appointmentData = null;
    
    if (isEdit) {
        const appointments = getStorageData(STORAGE_KEYS.appointments);
        appointmentData = appointments.find(a => a.id === appointmentId);
        currentEditItem = appointmentData;
        currentEditType = 'appointment';
    }
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    
    const formContent = `
        <form id="appointment-form" class="space-y-6">
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Voornaam *</label>
                    <input type="text" id="appointment-first-name" value="${appointmentData?.firstName || ''}" required 
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zaans-blue focus:border-transparent" 
                           placeholder="Jan">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Achternaam *</label>
                    <input type="text" id="appointment-last-name" value="${appointmentData?.lastName || ''}" required 
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zaans-blue focus:border-transparent" 
                           placeholder="de Vries">
                </div>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">E-mail *</label>
                    <input type="email" id="appointment-email" value="${appointmentData?.email || ''}" required 
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zaans-blue focus:border-transparent" 
                           placeholder="jan.devries@voorbeeld.nl">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Telefoon *</label>
                    <input type="tel" id="appointment-phone" value="${appointmentData?.phone || ''}" required 
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zaans-blue focus:border-transparent" 
                           placeholder="06-12345678">
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Rechtsgebied *</label>
                <select id="appointment-legal-area" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zaans-blue focus:border-transparent">
                    <option value="">Selecteer een rechtsgebied</option>
                    <option value="Ondernemingsrecht" ${appointmentData?.legalArea === 'Ondernemingsrecht' ? 'selected' : ''}>Ondernemingsrecht</option>
                    <option value="Familierecht" ${appointmentData?.legalArea === 'Familierecht' ? 'selected' : ''}>Familierecht</option>
                    <option value="Arbeidsrecht" ${appointmentData?.legalArea === 'Arbeidsrecht' ? 'selected' : ''}>Arbeidsrecht</option>
                    <option value="Bestuursrecht" ${appointmentData?.legalArea === 'Bestuursrecht' ? 'selected' : ''}>Bestuursrecht</option>
                    <option value="Verbintenissenrecht" ${appointmentData?.legalArea === 'Verbintenissenrecht' ? 'selected' : ''}>Verbintenissenrecht</option>
                    <option value="Overig" ${appointmentData?.legalArea === 'Overig' ? 'selected' : ''}>Overig</option>
                </select>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Datum *</label>
                    <input type="date" id="appointment-date" value="${appointmentData?.appointmentDate || ''}" required 
                           min="${today}" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zaans-blue focus:border-transparent">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Tijd *</label>
                    <select id="appointment-time" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zaans-blue focus:border-transparent">
                        <option value="">Selecteer een tijd</option>
                        <option value="09:00" ${appointmentData?.appointmentTime === '09:00' ? 'selected' : ''}>09:00</option>
                        <option value="10:00" ${appointmentData?.appointmentTime === '10:00' ? 'selected' : ''}>10:00</option>
                        <option value="11:00" ${appointmentData?.appointmentTime === '11:00' ? 'selected' : ''}>11:00</option>
                        <option value="13:00" ${appointmentData?.appointmentTime === '13:00' ? 'selected' : ''}>13:00</option>
                        <option value="14:00" ${appointmentData?.appointmentTime === '14:00' ? 'selected' : ''}>14:00</option>
                        <option value="15:00" ${appointmentData?.appointmentTime === '15:00' ? 'selected' : ''}>15:00</option>
                        <option value="16:00" ${appointmentData?.appointmentTime === '16:00' ? 'selected' : ''}>16:00</option>
                    </select>
                </div>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Type afspraak *</label>
                    <select id="appointment-type" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zaans-blue focus:border-transparent">
                        <option value="">Selecteer type</option>
                        <option value="Kantoorbezoek" ${appointmentData?.appointmentType === 'Kantoorbezoek' ? 'selected' : ''}>Kantoorbezoek</option>
                        <option value="Videobellen" ${appointmentData?.appointmentType === 'Videobellen' ? 'selected' : ''}>Videobellen</option>
                        <option value="Telefonisch" ${appointmentData?.appointmentType === 'Telefonisch' ? 'selected' : ''}>Telefonisch</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                    <select id="appointment-status" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zaans-blue focus:border-transparent">
                        <option value="Gepland" ${appointmentData?.status === 'Gepland' ? 'selected' : ''}>Gepland</option>
                        <option value="Bevestigd" ${appointmentData?.status === 'Bevestigd' ? 'selected' : ''}>Bevestigd</option>
                        <option value="Afgerond" ${appointmentData?.status === 'Afgerond' ? 'selected' : ''}>Afgerond</option>
                        <option value="Geannuleerd" ${appointmentData?.status === 'Geannuleerd' ? 'selected' : ''}>Geannuleerd</option>
                    </select>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Beschrijving vraag *</label>
                <textarea id="appointment-description" rows="3" required 
                          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zaans-blue focus:border-transparent" 
                          placeholder="Beschrijf kort waar u hulp bij nodig heeft...">${appointmentData?.description || ''}</textarea>
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
    
    showModal(isEdit ? 'Afspraak bewerken' : 'Nieuwe afspraak toevoegen', formContent);
    
    document.getElementById('appointment-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveAppointment();
    });
}

function saveAppointment() {
    const formData = {
        id: currentEditItem?.id || generateId(),
        firstName: document.getElementById('appointment-first-name').value,
        lastName: document.getElementById('appointment-last-name').value,
        email: document.getElementById('appointment-email').value,
        phone: document.getElementById('appointment-phone').value,
        legalArea: document.getElementById('appointment-legal-area').value,
        appointmentDate: document.getElementById('appointment-date').value,
        appointmentTime: document.getElementById('appointment-time').value,
        appointmentType: document.getElementById('appointment-type').value,
        status: document.getElementById('appointment-status').value,
        description: document.getElementById('appointment-description').value,
        createdDate: currentEditItem?.createdDate || new Date().toISOString(),
        updatedDate: new Date().toISOString()
    };
    
    const appointments = getStorageData(STORAGE_KEYS.appointments);
    
    if (currentEditItem) {
        // Update existing appointment
        const index = appointments.findIndex(a => a.id === currentEditItem.id);
        appointments[index] = formData;
    } else {
        // Add new appointment
        appointments.push(formData);
    }
    
    setStorageData(STORAGE_KEYS.appointments, appointments);
    loadAppointments();
    closeModal();
}

function viewAppointment(appointmentId) {
    const appointments = getStorageData(STORAGE_KEYS.appointments);
    const appointmentData = appointments.find(a => a.id === appointmentId);
    
    const viewContent = `
        <div class="space-y-4">
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Cliënt</label>
                    <p class="mt-1 text-sm text-gray-900">${appointmentData.firstName} ${appointmentData.lastName}</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Status</label>
                    <span class="mt-1 px-2 py-1 text-xs rounded-full ${getAppointmentStatusColor(appointmentData.status)}">${appointmentData.status}</span>
                </div>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">E-mail</label>
                    <p class="mt-1 text-sm text-gray-900">${appointmentData.email}</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Telefoon</label>
                    <p class="mt-1 text-sm text-gray-900">${appointmentData.phone}</p>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Rechtsgebied</label>
                <p class="mt-1 text-sm text-gray-900">${appointmentData.legalArea}</p>
            </div>
            <div class="grid md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Datum</label>
                    <p class="mt-1 text-sm text-gray-900">${formatDate(appointmentData.appointmentDate)}</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Tijd</label>
                    <p class="mt-1 text-sm text-gray-900">${appointmentData.appointmentTime}</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Type</label>
                    <p class="mt-1 text-sm text-gray-900">${appointmentData.appointmentType}</p>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Beschrijving vraag</label>
                <p class="mt-1 text-sm text-gray-900">${appointmentData.description}</p>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Aangemaakt</label>
                    <p class="mt-1 text-sm text-gray-900">${formatDate(appointmentData.createdDate)}</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Laatst bijgewerkt</label>
                    <p class="mt-1 text-sm text-gray-900">${formatDate(appointmentData.updatedDate)}</p>
                </div>
            </div>
            <div class="flex justify-end space-x-4 pt-4">
                <button onclick="closeModal()" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Sluiten
                </button>
                <button onclick="closeModal(); editAppointment('${appointmentData.id}')" class="px-6 py-2 bg-zaans-blue text-white rounded-lg hover:bg-blue-900">
                    Bewerken
                </button>
            </div>
        </div>
    `;
    
    showModal('Afspraak details', viewContent);
}

function editAppointment(appointmentId) {
    showAppointmentForm(appointmentId);
}

function deleteAppointment(appointmentId) {
    if (confirm('Weet u zeker dat u deze afspraak wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.')) {
        const appointments = getStorageData(STORAGE_KEYS.appointments);
        const filteredAppointments = appointments.filter(a => a.id !== appointmentId);
        setStorageData(STORAGE_KEYS.appointments, filteredAppointments);
        loadAppointments();
    }
}

// === DOCUMENTS CRUD ===

function loadDocuments() {
    const documents = getStorageData(STORAGE_KEYS.documents);
    const documentsList = document.getElementById('documents-list');
    
    if (documents.length === 0) {
        documentsList.innerHTML = '<p class="text-gray-500 text-center py-8">Geen documenten gevonden. Voeg uw eerste document toe.</p>';
        return;
    }
    
    documentsList.innerHTML = `
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Naam</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gerelateerde zaak</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliënt</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${documents.map(document => `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${document.name}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 py-1 text-xs rounded-full ${getDocumentTypeColor(document.type)}">${document.type}</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${document.relatedCase || 'Geen'}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${document.clientName || 'Geen'}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(document.createdDate)}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button onclick="viewDocument('${document.id}')" class="text-zaans-blue hover:text-blue-900 mr-3">Bekijk</button>
                                <button onclick="editDocument('${document.id}')" class="text-indigo-600 hover:text-indigo-900 mr-3">Bewerk</button>
                                <button onclick="deleteDocument('${document.id}')" class="text-red-600 hover:text-red-900">Verwijder</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function getDocumentTypeColor(type) {
    const colors = {
        'Contract': 'bg-blue-100 text-blue-800',
        'Vonnis': 'bg-red-100 text-red-800',
        'Correspondentie': 'bg-green-100 text-green-800',
        'Factuur': 'bg-yellow-100 text-yellow-800',
        'Rapportage': 'bg-purple-100 text-purple-800',
        'Overig': 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
}

function showDocumentForm(documentId = null) {
    const isEdit = documentId !== null;
    let documentData = null;
    
    if (isEdit) {
        const documents = getStorageData(STORAGE_KEYS.documents);
        documentData = documents.find(d => d.id === documentId);
        currentEditItem = documentData;
        currentEditType = 'document';
    }
    
    // Get available cases and clients for dropdowns
    const cases = getStorageData(STORAGE_KEYS.cases);
    const clients = getStorageData(STORAGE_KEYS.clients);
    
    const formContent = `
        <form id="document-form" class="space-y-6">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Document naam *</label>
                <input type="text" id="document-name" value="${documentData?.name || ''}" required 
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zaans-blue focus:border-transparent" 
                       placeholder="Arbeidscontract Maria Jansen">
            </div>
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Type document *</label>
                    <select id="document-type" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zaans-blue focus:border-transparent">
                        <option value="">Selecteer type</option>
                        <option value="Contract" ${documentData?.type === 'Contract' ? 'selected' : ''}>Contract</option>
                        <option value="Vonnis" ${documentData?.type === 'Vonnis' ? 'selected' : ''}>Vonnis</option>
                        <option value="Correspondentie" ${documentData?.type === 'Correspondentie' ? 'selected' : ''}>Correspondentie</option>
                        <option value="Factuur" ${documentData?.type === 'Factuur' ? 'selected' : ''}>Factuur</option>
                        <option value="Rapportage" ${documentData?.type === 'Rapportage' ? 'selected' : ''}>Rapportage</option>
                        <option value="Overig" ${documentData?.type === 'Overig' ? 'selected' : ''}>Overig</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Bestandsextensie</label>
                    <select id="document-extension" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zaans-blue focus:border-transparent">
                        <option value="">Geen</option>
                        <option value="PDF" ${documentData?.extension === 'PDF' ? 'selected' : ''}>PDF</option>
                        <option value="DOCX" ${documentData?.extension === 'DOCX' ? 'selected' : ''}>DOCX</option>
                        <option value="TXT" ${documentData?.extension === 'TXT' ? 'selected' : ''}>TXT</option>
                        <option value="JPG" ${documentData?.extension === 'JPG' ? 'selected' : ''}>JPG</option>
                        <option value="PNG" ${documentData?.extension === 'PNG' ? 'selected' : ''}>PNG</option>
                    </select>
                </div>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Gerelateerde zaak</label>
                    <select id="document-case" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zaans-blue focus:border-transparent">
                        <option value="">Geen zaak gekoppeld</option>
                        ${cases.map(caseItem => `
                            <option value="${caseItem.caseNumber}" ${documentData?.relatedCase === caseItem.caseNumber ? 'selected' : ''}>
                                ${caseItem.caseNumber} - ${caseItem.subject}
                            </option>
                        `).join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Cliënt</label>
                    <select id="document-client" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zaans-blue focus:border-transparent">
                        <option value="">Geen cliënt gekoppeld</option>
                        ${clients.map(client => `
                            <option value="${client.firstName} ${client.lastName}" ${documentData?.clientName === `${client.firstName} ${client.lastName}` ? 'selected' : ''}>
                                ${client.firstName} ${client.lastName}
                            </option>
                        `).join('')}
                    </select>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Beschrijving</label>
                <textarea id="document-description" rows="3" 
                          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zaans-blue focus:border-transparent" 
                          placeholder="Beschrijving van het document...">${documentData?.description || ''}</textarea>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Tags (gescheiden door komma's)</label>
                <input type="text" id="document-tags" value="${documentData?.tags || ''}"
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zaans-blue focus:border-transparent" 
                       placeholder="urgent, arbeidsrecht, ontslag">
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
    
    showModal(isEdit ? 'Document bewerken' : 'Nieuw document toevoegen', formContent);
    
    document.getElementById('document-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveDocument();
    });
}

function saveDocument() {
    const formData = {
        id: currentEditItem?.id || generateId(),
        name: document.getElementById('document-name').value,
        type: document.getElementById('document-type').value,
        extension: document.getElementById('document-extension').value,
        relatedCase: document.getElementById('document-case').value,
        clientName: document.getElementById('document-client').value,
        description: document.getElementById('document-description').value,
        tags: document.getElementById('document-tags').value,
        createdDate: currentEditItem?.createdDate || new Date().toISOString(),
        updatedDate: new Date().toISOString()
    };
    
    const documents = getStorageData(STORAGE_KEYS.documents);
    
    if (currentEditItem) {
        // Update existing document
        const index = documents.findIndex(d => d.id === currentEditItem.id);
        documents[index] = formData;
    } else {
        // Add new document
        documents.push(formData);
    }
    
    setStorageData(STORAGE_KEYS.documents, documents);
    loadDocuments();
    closeModal();
}

function viewDocument(documentId) {
    const documents = getStorageData(STORAGE_KEYS.documents);
    const documentData = documents.find(d => d.id === documentId);
    
    const viewContent = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700">Document naam</label>
                <p class="mt-1 text-sm text-gray-900">${documentData.name}</p>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Type</label>
                    <span class="mt-1 px-2 py-1 text-xs rounded-full ${getDocumentTypeColor(documentData.type)}">${documentData.type}</span>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Bestandsextensie</label>
                    <p class="mt-1 text-sm text-gray-900">${documentData.extension || 'Niet opgegeven'}</p>
                </div>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Gerelateerde zaak</label>
                    <p class="mt-1 text-sm text-gray-900">${documentData.relatedCase || 'Geen zaak gekoppeld'}</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Cliënt</label>
                    <p class="mt-1 text-sm text-gray-900">${documentData.clientName || 'Geen cliënt gekoppeld'}</p>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Beschrijving</label>
                <p class="mt-1 text-sm text-gray-900">${documentData.description || 'Geen beschrijving opgegeven'}</p>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Tags</label>
                <p class="mt-1 text-sm text-gray-900">${documentData.tags || 'Geen tags opgegeven'}</p>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Aangemaakt</label>
                    <p class="mt-1 text-sm text-gray-900">${formatDate(documentData.createdDate)}</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Laatst bijgewerkt</label>
                    <p class="mt-1 text-sm text-gray-900">${formatDate(documentData.updatedDate)}</p>
                </div>
            </div>
            <div class="flex justify-end space-x-4 pt-4">
                <button onclick="closeModal()" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Sluiten
                </button>
                <button onclick="closeModal(); editDocument('${documentData.id}')" class="px-6 py-2 bg-zaans-blue text-white rounded-lg hover:bg-blue-900">
                    Bewerken
                </button>
            </div>
        </div>
    `;
    
    showModal('Document details', viewContent);
}

function editDocument(documentId) {
    showDocumentForm(documentId);
}

function deleteDocument(documentId) {
    if (confirm('Weet u zeker dat u dit document wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.')) {
        const documents = getStorageData(STORAGE_KEYS.documents);
        const filteredDocuments = documents.filter(d => d.id !== documentId);
        setStorageData(STORAGE_KEYS.documents, filteredDocuments);
        loadDocuments();
    }
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