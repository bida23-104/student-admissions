// ============================================
// DTT&TE Admissions Portal - Main JavaScript
// ============================================

// Grade to Points Mapping
const gradePoints = {
    'A': 8, 'B': 7, 'C': 6, 'D': 5, 'E': 4, 'F': 3, 'G': 0,
    'a': 8, 'b': 7, 'c': 6, 'd': 5, 'e': 4, 'f': 3, 'g': 0
};

// Programme Requirements
const programmeRequirements = {
    "Fashion Design": {
        subjects: ["English", "Fashion & Fabrics"],
        minGrade: "E",
        minPoints: 28,
        senMinPoints: 26,
        description: "Learn fashion design, pattern making, garment construction, and textile technology."
    },
    "Beauty Therapy": {
        subjects: ["English", "Biology"],
        minGrade: "D",
        minPoints: 28,
        senMinPoints: 26,
        description: "Professional beauty therapy including skincare, makeup, nail technology and wellness treatments."
    },
    "Travel Management": {
        subjects: ["English", "Mathematics"],
        minGrade: "D",
        minPoints: 28,
        senMinPoints: 26,
        description: "Tourism operations, travel agency management, tour guiding and hospitality services."
    },
    "Hospitality Management": {
        subjects: ["English", "Food & Nutrition"],
        minGrade: "D",
        minPoints: 28,
        senMinPoints: 26,
        description: "Hotel operations, food & beverage management, customer service and event management."
    },
    "Culinary Arts": {
        subjects: ["English", "Food & Nutrition"],
        minGrade: "D",
        minPoints: 28,
        senMinPoints: 26,
        description: "Professional cookery, food production, kitchen management and international cuisine."
    },
    "Computer Networking": {
        subjects: ["Mathematics", "English"],
        minGrade: "D",
        minPoints: 28,
        senMinPoints: 26,
        description: "Network infrastructure, cybersecurity, cloud computing and IT systems administration."
    },
    "Systems Administration": {
        subjects: ["Mathematics", "English"],
        minGrade: "D",
        minPoints: 28,
        senMinPoints: 26,
        description: "Server management, system security, database administration and IT support."
    },
    "Health and Wellness": {
        subjects: ["English", "Physical Education"],
        minGrade: "D",
        minPoints: 28,
        senMinPoints: 26,
        description: "Health promotion, fitness training, wellness coaching and community health education."
    }
};

// Subjects List
const subjectsList = [
    "English Language", "Setswana", "Mathematics", "Science Single Award", 
    "Science Double Award", "Chemistry", "Physics", "Biology", 
    "Human & Social Biology", "History", "Geography", "Social Studies",
    "Development Studies", "Religious Education", "Literature in English",
    "Commerce", "Accounting", "Business Studies", "Computer Studies",
    "Design & Technology", "Music", "Physical Education", "Hospitality & Tourism",
    "Food & Nutrition", "Fashion & Fabrics", "Home Management",
    "Animal Production", "Field Crop Production", "Horticulture", "Agriculture"
];

let currentModalRef = null;
let swiperInstance = null;

// Initialize Tailwind
function initializeTailwind() {
    // Tailwind is loaded via CDN
}

// Initialize Subjects Table
function initializeSubjectsTable() {
    const tbody = document.getElementById('subjects-table');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    for (let i = 0; i < subjectsList.length; i += 2) {
        const row = document.createElement('tr');
        row.className = 'subject-row';
        
        let html = `
            <td class="px-4 py-3 text-slate-700 font-medium">${subjectsList[i]}</td>
            <td class="px-2 py-3">
                <input type="text" maxlength="1" 
                       class="grade-input border border-slate-300 rounded-xl px-2 py-1.5 text-center font-bold focus:border-blue-600"
                       data-subject="${subjectsList[i]}" oninput="calculatePoints()">
            </td>
            <td class="px-2 py-3 text-center">
                <span class="points-display font-extrabold text-blue-700" data-subject="${subjectsList[i]}">0</span>
            </td>
        `;
        
        if (subjectsList[i + 1]) {
            html += `
                <td class="px-4 py-3 text-slate-700 font-medium border-l">${subjectsList[i + 1]}</td>
                <td class="px-2 py-3">
                    <input type="text" maxlength="1" 
                           class="grade-input border border-slate-300 rounded-xl px-2 py-1.5 text-center font-bold focus:border-blue-600"
                           data-subject="${subjectsList[i + 1]}" oninput="calculatePoints()">
                </td>
                <td class="px-2 py-3 text-center">
                    <span class="points-display font-extrabold text-blue-700" data-subject="${subjectsList[i + 1]}">0</span>
                </td>
            `;
        } else {
            html += `<td class="px-4 py-3 border-l"></td><td></td><td></td>`;
        }
        
        row.innerHTML = html;
        tbody.appendChild(row);
    }
}

// Calculate Points
function calculatePoints() {
    const pointDisplays = document.querySelectorAll('.points-display');
    const gradeInputs = document.querySelectorAll('.grade-input');
    
    pointDisplays.forEach(display => {
        const subject = display.dataset.subject;
        const input = document.querySelector(`.grade-input[data-subject="${subject}"]`);
        const grade = input ? input.value.toUpperCase() : '';
        const points = gradePoints[grade] || 0;
        
        display.textContent = points;
        display.classList.toggle('text-emerald-600', points > 0);
        display.classList.toggle('text-blue-700', points === 0);
    });
    
    // Best 6 Calculation
    let allPoints = [];
    gradeInputs.forEach(input => {
        const grade = input.value.toUpperCase();
        if (gradePoints[grade] !== undefined) {
            allPoints.push(gradePoints[grade]);
        }
    });
    
    allPoints.sort((a, b) => b - a);
    const bestSix = allPoints.slice(0, 6);
    const bestSixTotal = bestSix.reduce((sum, p) => sum + p, 0);
    
    const bestEl = document.getElementById('best-six-points');
    const totalEl = document.getElementById('total-points');
    
    if (bestEl) bestEl.textContent = bestSixTotal;
    if (totalEl) totalEl.textContent = bestSixTotal;
    
    // Update prerequisites if programme selected
    const programme = document.getElementById('programme')?.value;
    if (programme) {
        checkPrerequisites(programme);
    }
}

// Update Prerequisite Section
function updatePrerequisiteFields() {
    const programme = document.getElementById('programme').value;
    const section = document.getElementById('prerequisite-section');
    
    if (!programme) {
        section.innerHTML = `<div class="text-slate-500 italic">Select a programme above to view requirements.</div>`;
        return;
    }
    
    const req = programmeRequirements[programme];
    if (!req) {
        section.innerHTML = `<div class="text-amber-600">No specific data available for this programme.</div>`;
        return;
    }
    
    section.innerHTML = `
        <div class="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <div class="font-bold text-blue-800 mb-3 flex items-center gap-x-2">
                <i class="fa-solid fa-info-circle"></i>
                <span>${programme} Requirements</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-3 text-sm">
                <div>
                    <span class="font-semibold text-slate-700">Minimum Points:</span><br>
                    <span class="text-2xl font-extrabold text-blue-900">${req.minPoints}</span>
                    <span class="text-xs text-slate-500">(SEN/OVC: ${req.senMinPoints})</span>
                </div>
                <div>
                    <span class="font-semibold text-slate-700">Required Subjects (Min Grade ${req.minGrade}):</span><br>
                    <span class="font-bold text-emerald-700">${req.subjects.join(' + ')}</span>
                </div>
            </div>
        </div>
    `;
    
    setTimeout(() => checkPrerequisites(programme), 200);
}

// Check Prerequisites
function checkPrerequisites(programme) {
    const req = programmeRequirements[programme];
    if (!req) return;
    
    const bestSix = parseInt(document.getElementById('best-six-points').textContent) || 0;
    const senStatus = document.getElementById('sen-ovc').value;
    const isSEN = senStatus !== 'No';
    const minPoints = isSEN ? req.senMinPoints : req.minPoints;
    
    const meetsPoints = bestSix >= minPoints;
    
    let meetsSubjects = true;
    let subjectStatusHTML = '';
    
    req.subjects.forEach(subjectName => {
        const inputs = document.querySelectorAll('.grade-input');
        let foundGrade = null;
        
        inputs.forEach(input => {
            if (input.dataset.subject.toLowerCase().includes(subjectName.toLowerCase().split(' ')[0])) {
                foundGrade = input.value.toUpperCase();
            }
        });
        
        const gradeValue = gradePoints[foundGrade] || 0;
        const minGradeValue = gradePoints[req.minGrade] || 0;
        const passed = gradeValue >= minGradeValue;
        
        if (!passed) meetsSubjects = false;
        
        subjectStatusHTML += `
            <div class="flex items-center gap-x-2 text-xs">
                <span class="${passed ? 'text-emerald-600' : 'text-red-600 font-bold'}">${subjectName}:</span> 
                <span class="font-mono font-bold">${foundGrade || '—'}</span>
                ${passed ? '<i class="fa-solid fa-check text-emerald-500"></i>' : '<i class="fa-solid fa-times text-red-500"></i>'}
            </div>
        `;
    });
    
    const section = document.getElementById('prerequisite-section');
    
    if (meetsPoints && meetsSubjects) {
        section.innerHTML = `
            <div class="flex items-center gap-x-4 bg-emerald-100 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-2xl">
                <i class="fa-solid fa-check-circle text-3xl"></i>
                <div>
                    <div class="font-extrabold text-lg">Prerequisites Fully Met</div>
                    <div class="text-xs">Applicant meets all requirements for this programme.</div>
                </div>
            </div>
        `;
    } else {
        section.innerHTML = `
            <div class="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <div class="flex items-center gap-x-2 text-amber-700 font-bold mb-3">
                    <i class="fa-solid fa-exclamation-triangle"></i>
                    <span>Prerequisites Not Fully Met</span>
                </div>
                <div class="pl-1 space-y-1 text-xs">
                    ${!meetsPoints ? `<div>• Points: <span class="font-bold">${bestSix}</span> (minimum required: ${minPoints})</div>` : ''}
                    ${subjectStatusHTML}
                </div>
            </div>
        `;
    }
}

// Validate Identity Number
function validateIdentityNumber() {
    const idInput = document.getElementById('identity-number');
    const genderSelect = document.getElementById('gender');
    const errorEl = document.getElementById('id-error');
    
    if (!idInput || !errorEl) return true;
    
    const id = idInput.value.trim();
    const gender = genderSelect ? genderSelect.value : '';
    
    errorEl.classList.add('hidden');
    idInput.classList.remove('border-red-400', 'border-emerald-400');
    
    if (!id) return true;
    
    if (!/^\d{9}$/.test(id)) {
        errorEl.textContent = 'Identity Number must be exactly 9 digits.';
        errorEl.classList.remove('hidden');
        idInput.classList.add('border-red-400');
        return false;
    }
    
    if (gender) {
        const fifthDigit = id.charAt(4);
        const expected = (gender === 'Male') ? '1' : '2';
        
        if (fifthDigit !== expected) {
            errorEl.textContent = `For ${gender}, the 5th digit must be ${expected}.`;
            errorEl.classList.remove('hidden');
            idInput.classList.add('border-red-400');
            return false;
        }
    }
    
    idInput.classList.add('border-emerald-400');
    return true;
}

// Submit Application
function submitApplication(e) {
    e.preventDefault();
    
    if (!validateIdentityNumber()) {
        alert("Please correct the Identity Number before submitting.");
        return;
    }
    
    const programme = document.getElementById('programme').value;
    if (!programme) {
        alert("Please select a programme.");
        return;
    }
    
    const application = {
        id: Date.now(),
        ref: 'REC-' + Date.now().toString().slice(-6),
        date: new Date().toISOString(),
        programme: programme,
        surname: document.getElementById('surname').value,
        firstName: document.getElementById('first-name').value,
        otherNames: document.getElementById('other-names').value || '',
        dob: document.getElementById('dob').value,
        gender: document.getElementById('gender').value,
        identityNumber: document.getElementById('identity-number').value,
        senOvc: document.getElementById('sen-ovc').value,
        workExperience: parseInt(document.getElementById('work-experience').value) || 0,
        bestSixPoints: parseInt(document.getElementById('best-six-points').textContent) || 0,
        status: 'Pending Review'
    };
    
    // Determine status
    const req = programmeRequirements[programme];
    const isSEN = application.senOvc !== 'No';
    const minPoints = isSEN ? req.senMinPoints : req.minPoints;
    
    application.status = (application.bestSixPoints >= minPoints) ? 'Qualified' : 'Not Qualified';
    
    // Save
    let applications = JSON.parse(localStorage.getItem('admissions') || '[]');
    applications.unshift(application);
    localStorage.setItem('admissions', JSON.stringify(applications));
    
    // Success UI
    const btn = e.target.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = `<i class="fa-solid fa-check"></i> <span>SUBMITTED!</span>`;
    btn.disabled = true;
    
    setTimeout(() => {
        alert(`Application ${application.ref} submitted successfully!`);
        resetForm();
        updateAppCount();
        showTab('all-applications');
        renderApplicationsTable();
        btn.innerHTML = originalHTML;
        btn.disabled = false;
    }, 900);
}

// Reset Form
function resetForm() {
    const form = document.getElementById('admission-form');
    if (form) form.reset();
    
    const bestEl = document.getElementById('best-six-points');
    const totalEl = document.getElementById('total-points');
    if (bestEl) bestEl.textContent = '0';
    if (totalEl) totalEl.textContent = '0';
    
    document.querySelectorAll('.grade-input').forEach(i => i.value = '');
    document.querySelectorAll('.points-display').forEach(el => el.textContent = '0');
    
    const prereq = document.getElementById('prerequisite-section');
    if (prereq) prereq.innerHTML = `<div class="text-slate-500 italic">Select a programme above to view requirements.</div>`;
    
    const receipt = document.getElementById('receipt-number');
    if (receipt) receipt.value = 'REC-2026-' + Date.now().toString().slice(-5);
}

// Render Applications Table
function renderApplicationsTable() {
    const tbody = document.getElementById('applications-table-body');
    const noApps = document.getElementById('no-applications');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    let applications = JSON.parse(localStorage.getItem('admissions') || '[]');
    
    if (applications.length === 0) {
        if (noApps) noApps.classList.remove('hidden');
        return;
    } else {
        if (noApps) noApps.classList.add('hidden');
    }
    
    applications.forEach(app => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-slate-50 cursor-pointer transition-colors';
        
        const statusClass = app.status === 'Qualified' ? 'status-qualified' : 'status-not-qualified';
        
        row.innerHTML = `
            <td class="px-6 py-4 font-mono text-xs text-slate-500">${app.ref}</td>
            <td class="px-6 py-4">
                <div class="font-semibold">${app.surname}, ${app.firstName}</div>
                <div class="text-xs text-slate-500">${app.gender} • ${app.identityNumber}</div>
            </td>
            <td class="px-6 py-4 text-sm">${app.programme}</td>
            <td class="px-6 py-4 text-center">
                <span class="font-extrabold text-2xl tabular-nums text-slate-800">${app.bestSixPoints}</span>
            </td>
            <td class="px-6 py-4 text-center">
                <span class="${statusClass}">${app.status}</span>
            </td>
            <td class="px-6 py-4 text-center text-xs text-slate-500">
                ${new Date(app.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </td>
            <td class="px-6 py-4 text-center">
                <button onclick="viewApplication(${app.id}); event.stopImmediatePropagation();" 
                        class="text-blue-600 hover:text-blue-800 p-2 transition-colors">
                    <i class="fa-solid fa-eye text-lg"></i>
                </button>
            </td>
        `;
        
        row.onclick = () => viewApplication(app.id);
        tbody.appendChild(row);
    });
    
    const countEl = document.getElementById('app-count');
    if (countEl) countEl.textContent = applications.length;
}

// View Application Modal
function viewApplication(id) {
    let applications = JSON.parse(localStorage.getItem('admissions') || '[]');
    const app = applications.find(a => a.id === id);
    if (!app) return;
    
    currentModalRef = id;
    
    document.getElementById('modal-ref').textContent = app.ref;
    document.getElementById('modal-name').textContent = `${app.surname}, ${app.firstName} ${app.otherNames || ''}`;
    
    const statusEl = document.getElementById('modal-status-badge');
    statusEl.innerHTML = `<span class="${app.status === 'Qualified' ? 'status-qualified' : 'status-not-qualified'} px-5 py-1 text-sm">${app.status}</span>`;
    
    const content = document.getElementById('modal-content');
    content.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-sm">
            <div>
                <div class="text-xs uppercase tracking-[1px] text-slate-500 mb-1">Programme</div>
                <div class="font-extrabold text-xl">${app.programme}</div>
            </div>
            <div>
                <div class="text-xs uppercase tracking-[1px] text-slate-500 mb-1">Submitted</div>
                <div class="font-semibold">${new Date(app.date).toLocaleString()}</div>
            </div>
            
            <div>
                <div class="text-xs uppercase tracking-[1px] text-slate-500 mb-1">Gender &amp; ID Number</div>
                <div class="font-semibold">${app.gender} &nbsp; <span class="font-mono">${app.identityNumber}</span></div>
            </div>
            <div>
                <div class="text-xs uppercase tracking-[1px] text-slate-500 mb-1">Date of Birth</div>
                <div class="font-semibold">${app.dob}</div>
            </div>
            
            <div>
                <div class="text-xs uppercase tracking-[1px] text-slate-500 mb-1">Special Category</div>
                <div class="font-semibold">${app.senOvc}</div>
            </div>
            <div>
                <div class="text-xs uppercase tracking-[1px] text-slate-500 mb-1">Work Experience</div>
                <div class="font-semibold">${app.workExperience} months</div>
            </div>
            
            <div class="col-span-2 pt-5 border-t mt-2">
                <div class="flex items-end gap-x-4">
                    <div>
                        <div class="text-xs uppercase tracking-[1px] text-slate-500">Best 6 Points</div>
                        <div class="text-7xl font-black text-blue-800 tabular-nums leading-none">${app.bestSixPoints}</div>
                    </div>
                    <div class="text-sm pb-3 text-slate-500">/ 48 max</div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('detail-modal').classList.remove('hidden');
    document.getElementById('detail-modal').classList.add('flex');
}

// Hide Modal
function hideModal() {
    const modal = document.getElementById('detail-modal');
    modal.classList.remove('flex');
    modal.classList.add('hidden');
}

// Delete Current Application
function deleteCurrentApplication() {
    if (!currentModalRef || !confirm('Delete this application permanently?')) return;
    
    let applications = JSON.parse(localStorage.getItem('admissions') || '[]');
    applications = applications.filter(a => a.id !== currentModalRef);
    localStorage.setItem('admissions', JSON.stringify(applications));
    
    hideModal();
    renderApplicationsTable();
    updateAppCount();
}

// Export to CSV
function exportToCSV() {
    let applications = JSON.parse(localStorage.getItem('admissions') || '[]');
    if (applications.length === 0) {
        alert("No applications to export.");
        return;
    }
    
    let csv = 'Reference,Date,Programme,Surname,First Name,Gender,Identity Number,Points,Status,SEN/OVC,Work Experience\n';
    
    applications.forEach(app => {
        csv += `"${app.ref}","${app.date}","${app.programme}","${app.surname}","${app.firstName}","${app.gender}","${app.identityNumber}",${app.bestSixPoints},"${app.status}","${app.senOvc}",${app.workExperience}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DTTTE_Admissions_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

// Clear All Applications
function clearAllApplications() {
    if (!confirm('This will permanently delete ALL applications. Are you sure?')) return;
    localStorage.removeItem('admissions');
    renderApplicationsTable();
    updateAppCount();
}

// Update App Count
function updateAppCount() {
    let applications = JSON.parse(localStorage.getItem('admissions') || '[]');
    const countEl = document.getElementById('app-count');
    if (countEl) countEl.textContent = applications.length;
}

// Show Tab
function showTab(tab) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(tab).classList.remove('hidden');
    
    document.querySelectorAll('.nav-tab').forEach(el => {
        el.classList.remove('active', 'bg-blue-800', 'text-white');
        el.classList.add('text-slate-600');
    });
    
    const activeTab = document.getElementById('tab-' + tab);
    if (activeTab) {
        activeTab.classList.add('active', 'bg-blue-800', 'text-white');
        activeTab.classList.remove('text-slate-600');
    }
    
    if (tab === 'all-applications') {
        renderApplicationsTable();
    }
    
    if (tab === 'programmes') {
        initProgrammeSliders();
    }
}

// Initialize Programme Sliders & Cards
function initProgrammeSliders() {
    const wrapper = document.querySelector('.swiper-wrapper');
    const cardsContainer = document.getElementById('programme-cards');
    
    if (!wrapper || !cardsContainer) return;
    
    wrapper.innerHTML = '';
    cardsContainer.innerHTML = '';
    
    const programmes = Object.keys(programmeRequirements);
    
    programmes.forEach((prog, index) => {
        const req = programmeRequirements[prog];
        
        // Create Swiper Slide
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `
            <div class="programme-card bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm h-full">
                <div class="relative h-56">
                    <img src="https://picsum.photos/id/${(index + 10) * 3}/800/600" 
                         class="w-full h-full object-cover" alt="${prog}">
                    <div class="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60"></div>
                    <div class="absolute bottom-4 left-5 text-white">
                        <div class="text-xs tracking-[2px] font-semibold opacity-75">DIPLOMA PROGRAMME</div>
                        <div class="text-2xl font-extrabold leading-tight">${prog}</div>
                    </div>
                </div>
                <div class="p-5">
                    <p class="text-sm text-slate-600 line-clamp-3">${req.description}</p>
                    <div class="mt-4 flex items-center justify-between text-xs">
                        <div>
                            <span class="font-bold text-blue-800">${req.minPoints}</span>
                            <span class="text-slate-500">min points</span>
                        </div>
                        <div class="px-3 py-1 bg-blue-50 text-blue-700 rounded-2xl font-semibold">
                            ${req.subjects.join(' + ')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        wrapper.appendChild(slide);
        
        // Create Card
        const card = document.createElement('div');
        card.className = 'programme-card bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm cursor-pointer';
        card.innerHTML = `
            <div class="relative h-40">
                <img src="https://picsum.photos/id/${(index + 10) * 3}/600/400" 
                     class="w-full h-full object-cover" alt="${prog}">
                <div class="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/70"></div>
                <div class="absolute bottom-3 left-4 text-white">
                    <div class="text-xl font-extrabold">${prog}</div>
                </div>
            </div>
            <div class="p-4">
                <p class="text-xs text-slate-600 line-clamp-2 mb-3">${req.description}</p>
                <div class="flex justify-between items-center text-xs">
                    <div><span class="font-extrabold text-blue-800">${req.minPoints}</span> <span class="text-slate-500">pts</span></div>
                    <div class="text-[10px] px-2.5 py-0.5 bg-slate-100 rounded-xl text-slate-600">${req.subjects[0]}</div>
                </div>
            </div>
        `;
        card.onclick = () => {
            showTab('new-application');
            setTimeout(() => {
                const select = document.getElementById('programme');
                if (select) {
                    select.value = prog;
                    updatePrerequisiteFields();
                }
            }, 300);
        };
        cardsContainer.appendChild(card);
    });
    
    // Initialize Swiper
    if (swiperInstance) {
        swiperInstance.destroy(true, true);
    }
    
    swiperInstance = new Swiper('.mySwiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
        },
        autoplay: {
            delay: 4500,
            disableOnInteraction: false,
        },
        loop: true
    });
}

// Initialize Application
function initializeApp() {
    initializeTailwind();
    initializeSubjectsTable();
    
    // Set receipt number
    const receipt = document.getElementById('receipt-number');
    if (receipt) receipt.value = 'REC-2026-' + Date.now().toString().slice(-5);
    
    // Initial points calculation
    setTimeout(() => calculatePoints(), 400);
    
    // Update count
    updateAppCount();
    
    // Show default tab
    document.getElementById('new-application').classList.remove('hidden');
    const firstTab = document.getElementById('tab-new-application');
    if (firstTab) firstTab.classList.add('active', 'bg-blue-800', 'text-white');
    
    // Keyboard support
    document.addEventListener('keypress', function(e) {
        if (e.target.classList.contains('grade-input') && e.key === 'Enter') {
            calculatePoints();
        }
    });
    
    // Seed demo data if empty (for first-time demo)
    if (!localStorage.getItem('admissions')) {
        // Uncomment below line if you want demo data on first load
        // seedDemoData();
    }
}

// Optional demo data
function seedDemoData() {
    const demo = [{
        id: Date.now() - 100000,
        ref: 'REC-884721',
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        programme: 'Fashion Design',
        surname: 'Mahlathini',
        firstName: 'Mpaphi',
        otherNames: '',
        dob: '1998-03-12',
        gender: 'Male',
        identityNumber: '123411234',
        senOvc: 'No',
        workExperience: 6,
        bestSixPoints: 34,
        status: 'Qualified'
    }];
    localStorage.setItem('admissions', JSON.stringify(demo));
}

// Boot
window.onload = initializeApp;
