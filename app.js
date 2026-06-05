// FCTVE Student Admissions Portal - Main Application Logic
// Complete functional implementation with criteria-based validation

// ==================== DATA DEFINITIONS ====================
const GRADE_POINTS = {
    'A': 8, 'B': 7, 'C': 6, 'D': 5, 'E': 4, 'F': 3, 'G': 0, '': 0, ' ': 0
};

const SUBJECTS = [
    // Core Compulsory
    { code: 'EN', name: 'English Language', category: 'Core' },
    { code: 'SE', name: 'Setswana', category: 'Core' },
    { code: 'MA', name: 'Mathematics', category: 'Core' },
    // Sciences
    { code: 'SA', name: 'Science Single Award', category: 'Sciences' },
    { code: 'SD', name: 'Science Double Award', category: 'Sciences' },
    { code: 'CH', name: 'Chemistry', category: 'Sciences' },
    { code: 'PH', name: 'Physics', category: 'Sciences' },
    { code: 'BI', name: 'Biology', category: 'Sciences' },
    { code: 'HS', name: 'Human & Social Biology', category: 'Sciences' },
    // Humanities
    { code: 'HI', name: 'History', category: 'Humanities' },
    { code: 'GE', name: 'Geography', category: 'Humanities' },
    { code: 'SS', name: 'Social Studies', category: 'Humanities' },
    { code: 'DS', name: 'Development Studies', category: 'Humanities' },
    { code: 'RE', name: 'Religious Education', category: 'Humanities' },
    { code: 'LE', name: 'Literature in English', category: 'Humanities' },
    // Business
    { code: 'CO', name: 'Commerce', category: 'Business' },
    { code: 'AC', name: 'Accounting', category: 'Business' },
    { code: 'BS', name: 'Business Studies', category: 'Business' },
    // Technical & Creative
    { code: 'CS', name: 'Computer Studies', category: 'Technical' },
    { code: 'AD', name: 'Art & Design', category: 'Technical' },
    { code: 'DT', name: 'Design & Technology', category: 'Technical' },
    { code: 'MU', name: 'Music', category: 'Technical' },
    { code: 'PE', name: 'Physical Education', category: 'Technical' },
    // Home Economics
    { code: 'HT', name: 'Hospitality & Tourism Studies', category: 'Home Economics' },
    { code: 'FN', name: 'Food & Nutrition', category: 'Home Economics' },
    { code: 'FF', name: 'Fashion & Fabric', category: 'Home Economics' },
    { code: 'HM', name: 'Home Management', category: 'Home Economics' },
    // Agriculture
    { code: 'AP', name: 'Animal Production', category: 'Agriculture' },
    { code: 'FC', name: 'Field Crop Production', category: 'Agriculture' },
    { code: 'HO', name: 'Horticulture', category: 'Agriculture' },
    { code: 'AG', name: 'Agriculture', category: 'Agriculture' }
];

const PROGRAMMES = [
    { value: 'Beauty Therapy', label: 'Diploma in Beauty Therapy' },
    { value: 'Travel Management', label: 'Diploma in Travel Management' },
    { value: 'Culinary Arts', label: 'Diploma in Culinary Arts' },
    { value: 'Hospitality Management', label: 'Diploma in Hospitality Management' },
    { value: 'Computer Networking', label: 'Diploma in Computer Networking' },
    { value: 'Systems Administration', label: 'Diploma in Systems Administration' },
    { value: 'Textile Design', label: 'Diploma in Textile Design' },
    { value: 'Fashion Design', label: 'Diploma in Fashion Design' },
    { value: 'CVET', label: 'Certificate in Technical and Vocational Education (CVET)' },
    { value: 'Health and Wellness', label: 'Diploma in Health and Wellness' }
];

// Detailed requirements based on programmes sheet criteria
const PROGRAMME_REQUIREMENTS = {
    'Beauty Therapy': {
        minPoints: 28,
        minPointsSpecial: 26,
        requiredSubjects: [
            { code: 'EN', minPoints: 5, name: 'English Language' },
            { code: 'BI', minPoints: 5, name: 'Biology' }
        ],
        relatedScience: ['SA', 'SD', 'CH', 'PH', 'HS'],
        note: 'Related Science subjects (SA/SD/CH/PH/HS) accepted in place of Biology.'
    },
    'Travel Management': {
        minPoints: 28,
        minPointsSpecial: 26,
        requiredSubjects: [
            { code: 'EN', minPoints: 5, name: 'English Language' },
            { code: 'MA', minPoints: 5, name: 'Mathematics' }
        ],
        addedAdvantage: ['Geography (GE)', 'History (HI)', 'Development Studies (DS)', '2+ years work experience'],
        altPathway: 'Foundation in Hospitality and Tourism or equivalent'
    },
    'Culinary Arts': {
        minPoints: 28,
        minPointsSpecial: 26,
        requiredSubjects: [
            { code: 'EN', minPoints: 5, name: 'English Language' },
            { code: 'FN', minPoints: 5, name: 'Food & Nutrition' }
        ],
        addedAdvantage: ['Food Studies / Hospitality (HT)', '2+ years relevant work experience'],
        altPathway: 'Foundation in Hospitality and Tourism or equivalent'
    },
    'Hospitality Management': {
        minPoints: 28,
        minPointsSpecial: 26,
        requiredSubjects: [
            { code: 'EN', minPoints: 5, name: 'English Language' },
            { code: 'FN', minPoints: 5, name: 'Food & Nutrition' }
        ],
        addedAdvantage: ['Tourism/Hospitality Studies (HT)', '2+ years work experience in related field'],
        altPathway: 'Foundation in Hospitality and Tourism or equivalent'
    },
    'Computer Networking': {
        minPoints: 28,
        minPointsSpecial: 26,
        requiredSubjects: [
            { code: 'MA', minPoints: 5, name: 'Mathematics' },
            { code: 'EN', minPoints: 4, name: 'English Language' }
        ],
        addedAdvantage: ['Computer Studies (CS) pass or better'],
        altPathway: 'BTEP Certificate in ICT or equivalent with merit in Integrated Project'
    },
    'Systems Administration': {
        minPoints: 28,
        minPointsSpecial: 26,
        requiredSubjects: [
            { code: 'MA', minPoints: 5, name: 'Mathematics' },
            { code: 'EN', minPoints: 4, name: 'English Language' }
        ],
        addedAdvantage: ['Computer Studies (CS)'],
        altPathway: 'BTEP Certificate in ICT or equivalent with merit in Integrated Project'
    },
    'Textile Design': {
        minPoints: 28,
        minPointsSpecial: 26,
        requiredSubjects: [
            { code: 'EN', minPoints: 5, name: 'English Language' }
        ],
        addedAdvantage: ['Art & Design (AD) or Fashion & Fabric (FF)'],
        altPathway: 'Level 5 Certificate in Textile Design or Trade Test B in Fabric/Dyeing/Printing'
    },
    'Fashion Design': {
        minPoints: 28,
        minPointsSpecial: 26,
        requiredSubjects: [
            { code: 'EN', minPoints: 4, name: 'English Language' },
            { code: 'FF', minPoints: 4, name: 'Fashion & Fabric' }
        ],
        addedAdvantage: ['Art & Design (AD)', 'Home Management (HM)'],
        note: 'SEN/OVC/RAD pathway available with lower threshold.'
    },
    'CVET': {
        minPoints: 0,
        minPointsSpecial: 0,
        requiredSubjects: [],
        note: 'Requires National Craft Certificate (NCC), Diploma or Higher National Diploma in any Vocational/Technical field. Programme is usually self-sponsored.'
    },
    'Health and Wellness': {
        minPoints: 28,
        minPointsSpecial: 26,
        requiredSubjects: [
            { code: 'EN', minPoints: 5, name: 'English Language' },
            { code: 'MA', minPoints: 5, name: 'Mathematics' },
            { code: 'BI', minPoints: 5, name: 'Biology' },
            { code: 'PE', minPoints: 4, name: 'Physical Education' }
        ],
        note: 'At least two of PE, English, Math, Biology/Science required for special category pathway.'
    }
};

// ==================== STATE ====================
let applications = [];
let currentModalRef = null;
let swiperInstance = null;
let draftTimer = null;

// ==================== INITIALIZATION ====================
function init() {
    // Load applications from localStorage
    loadApplications();
    
    // Populate subjects table
    populateSubjectsTable();
    
    // Attach event listeners for live calculations
    attachFormListeners();
    
    // Initialize dark mode icon (already handled in HTML)
    updateDarkModeIcon(document.documentElement.classList.contains('dark'));
    
    // Init Swiper for programmes tab
    initSwiper();
    
    // Populate programme cards grid
    populateProgrammeCards();
    
    // Update app count badge
    updateAppCount();
    
    // Restore draft if exists
    restoreDraft();
    
    // Demo data for first-time users (comment out in production if needed)
    initDemoDataIfNeeded();
    
    // Initial prereq placeholder
    const prereqSection = document.getElementById('prerequisite-section');
    if (prereqSection) {
        prereqSection.innerHTML = '<div class="text-slate-500 italic text-sm">Select your programme choice(s) above and enter BGCSE results to see real-time prerequisite assessment.</div>';
    }
    
    // Show welcome toast on first load
    if (!localStorage.getItem('hasVisitedAdmissions')) {
        setTimeout(() => {
            showToast('Welcome to FCTVE Admissions Portal • 2026/2027', 'info');
            localStorage.setItem('hasVisitedAdmissions', 'true');
        }, 1200);
    }
    
    console.log('%c[FCTVE Admissions] Portal initialized successfully', 'color:#64748b');
}

// Attach listeners for dynamic updates
function attachFormListeners() {
    const form = document.getElementById('admission-form');
    if (!form) return;
    
    // Live points calculation on any grade input
    form.addEventListener('input', (e) => {
        if (e.target.classList.contains('grade-input') || e.target.id === 'sen-ovc' || 
            e.target.id.startsWith('choice') || e.target.id === 'work-experience' || 
            e.target.id === 'vocational-qualification') {
            calculateAndUpdatePoints();
            updatePrerequisiteFields();
            autoSaveDraft();
        }
    });
    
    // DOB -> age hint (optional display)
    const dobInput = document.getElementById('dob');
    if (dobInput) {
        dobInput.addEventListener('change', () => {
            const age = calculateAge(dobInput.value);
            if (age) {
                dobInput.title = `Age: ${age} years`;
            }
        });
    }
    
    // Identity validation
    const idInput = document.getElementById('identity-number');
    if (idInput) {
        idInput.addEventListener('input', validateIdentityNumber);
    }
    
    // Gender change re-validate ID
    const genderSelect = document.getElementById('gender');
    if (genderSelect) {
        genderSelect.addEventListener('change', validateIdentityNumber);
    }
    
    // Auto-save on key fields
    const autoSaveFields = ['surname', 'first-name', 'receipt-number'];
    autoSaveFields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', () => autoSaveDraft());
    });
}

// Calculate age from DOB
function calculateAge(dobStr) {
    if (!dobStr) return null;
    const birth = new Date(dobStr);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
}

// ==================== SUBJECTS TABLE ====================
function populateSubjectsTable() {
    const tbody = document.getElementById('subjects-table');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // Create two columns layout (left + right)
    const half = Math.ceil(SUBJECTS.length / 2);
    const leftSubjects = SUBJECTS.slice(0, half);
    const rightSubjects = SUBJECTS.slice(half);
    
    for (let i = 0; i < Math.max(leftSubjects.length, rightSubjects.length); i++) {
        const row = document.createElement('tr');
        row.className = 'hover:bg-slate-50 dark:hover:bg-slate-800/50';
        
        // Left subject
        const left = leftSubjects[i];
        let leftCell = '';
        if (left) {
            leftCell = `
                <td class="py-2.5 px-4 text-sm font-medium text-slate-700 dark:text-slate-200">${left.name}</td>
                <td class="py-2.5 px-2 text-center">
                    <select class="grade-input form-input px-2 py-1.5 border border-slate-300 rounded-xl text-sm font-bold" 
                            data-code="${left.code}" onchange="calculateAndUpdatePoints(); updatePrerequisiteFields()">
                        <option value="">-</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                        <option value="F">F</option>
                        <option value="G">G</option>
                    </select>
                </td>
                <td class="py-2.5 px-2 text-center">
                    <span class="points-display text-sm font-bold text-slate-500 tabular-nums" data-code="${left.code}">0</span>
                </td>
            `;
        } else {
            leftCell = '<td colspan="3"></td>';
        }
        
        // Right subject
        const right = rightSubjects[i];
        let rightCell = '';
        if (right) {
            rightCell = `
                <td class="py-2.5 px-4 text-sm font-medium text-slate-700 dark:text-slate-200 border-l border-slate-100 dark:border-slate-700">${right.name}</td>
                <td class="py-2.5 px-2 text-center">
                    <select class="grade-input form-input px-2 py-1.5 border border-slate-300 rounded-xl text-sm font-bold" 
                            data-code="${right.code}" onchange="calculateAndUpdatePoints(); updatePrerequisiteFields()">
                        <option value="">-</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                        <option value="F">F</option>
                        <option value="G">G</option>
                    </select>
                </td>
                <td class="py-2.5 px-2 text-center">
                    <span class="points-display text-sm font-bold text-slate-500 tabular-nums" data-code="${right.code}">0</span>
                </td>
            `;
        } else {
            rightCell = '<td colspan="3"></td>';
        }
        
        row.innerHTML = leftCell + rightCell;
        tbody.appendChild(row);
    }
}

// Calculate points from grades + update UI
function calculateAndUpdatePoints() {
    const selects = document.querySelectorAll('.grade-input');
    let totalPoints = 0;
    let subjectPoints = {};
    
    selects.forEach(sel => {
        const code = sel.dataset.code;
        const grade = sel.value.toUpperCase().trim();
        const pts = GRADE_POINTS[grade] || 0;
        subjectPoints[code] = pts;
        totalPoints += pts;
        
        // Update the points display next to it
        const display = document.querySelector(`.points-display[data-code="${code}"]`);
        if (display) {
            display.textContent = pts;
            display.className = `points-display text-sm font-bold tabular-nums ${pts >= 6 ? 'text-emerald-600' : pts >= 4 ? 'text-blue-600' : 'text-slate-500'}`;
        }
    });
    
    // Best 6 calculation
    const allPoints = Object.values(subjectPoints).sort((a, b) => b - a);
    const bestSix = allPoints.slice(0, 6).reduce((sum, p) => sum + p, 0);
    
    // Update UI
    const bestEl = document.getElementById('best-six-points');
    const totalEl = document.getElementById('total-points');
    
    if (bestEl) bestEl.textContent = bestSix;
    if (totalEl) totalEl.textContent = totalPoints;
    
    // Store for later use
    window.currentBestSix = bestSix;
    window.currentTotalPoints = totalPoints;
    window.currentSubjectPoints = subjectPoints;
    
    return { bestSix, totalPoints, subjectPoints };
}

// ==================== IDENTITY VALIDATION ====================
function validateIdentityNumber() {
    const idInput = document.getElementById('identity-number');
    const genderSelect = document.getElementById('gender');
    const errorEl = document.getElementById('id-error');
    
    if (!idInput || !errorEl) return true;
    
    const val = idInput.value.trim().toUpperCase();
    errorEl.classList.add('hidden');
    idInput.classList.remove('border-red-500', 'focus:border-red-500');
    
    if (!val) return true;
    
    // Passport format (starts with letter) or 9-digit Omang
    const isPassport = /^[A-Z][A-Z0-9]{5,10}$/.test(val);
    const isOmang = /^\d{9}$/.test(val);
    
    if (!isPassport && !isOmang) {
        errorEl.textContent = 'Must be 9-digit Omang or valid Passport number';
        errorEl.classList.remove('hidden');
        idInput.classList.add('border-red-500');
        return false;
    }
    
    // Gender cross-check for Omang (common convention: 5th digit odd=Male, even=Female or similar)
    if (isOmang && genderSelect && genderSelect.value) {
        const fifthDigit = parseInt(val[4], 10);
        const isMaleById = fifthDigit % 2 === 1; // typical pattern in some national IDs
        const selectedGender = genderSelect.value;
        
        if ((selectedGender === 'Male' && !isMaleById) || (selectedGender === 'Female' && isMaleById)) {
            errorEl.textContent = `Gender mismatch: 5th digit suggests ${isMaleById ? 'Male' : 'Female'}`;
            errorEl.classList.remove('hidden');
            idInput.classList.add('border-red-500');
            return false;
        }
    }
    
    return true;
}

// ==================== CHOICES VALIDATION (no duplicates) ====================
function validateChoices() {
    const c1 = document.getElementById('choice1')?.value;
    const c2 = document.getElementById('choice2')?.value;
    const c3 = document.getElementById('choice3')?.value;
    const errorEl = document.getElementById('choices-error');
    
    if (!errorEl) return true;
    
    errorEl.classList.add('hidden');
    const selected = [c1, c2, c3].filter(Boolean);
    const unique = new Set(selected);
    
    if (unique.size !== selected.length) {
        errorEl.textContent = 'Duplicate programme choices are not allowed. Please select different programmes.';
        errorEl.classList.remove('hidden');
        return false;
    }
    return true;
}

// ==================== PREREQUISITE / ELIGIBILITY CHECK ====================
function updatePrerequisiteFields() {
    const section = document.getElementById('prerequisite-section');
    if (!section) return;
    
    const c1 = document.getElementById('choice1')?.value;
    const c2 = document.getElementById('choice2')?.value;
    const c3 = document.getElementById('choice3')?.value;
    
    const choices = [
        { rank: 1, value: c1 },
        { rank: 2, value: c2 },
        { rank: 3, value: c3 }
    ].filter(c => c.value);
    
    if (choices.length === 0) {
        section.innerHTML = '<div class="text-slate-500 italic text-sm">Select your programme choice(s) above and enter BGCSE results to see real-time prerequisite assessment.</div>';
        return;
    }
    
    // Get current form data
    const formData = getFormDataForValidation();
    
    let html = '<div class="space-y-4">';
    
    choices.forEach(({ rank, value }) => {
        const result = checkEligibility(value, formData);
        const cardClass = result.eligible ? 'eligible' : (result.meetsPoints && result.meetsSubjects === false ? 'partial' : 'not-eligible');
        const icon = result.eligible ? 'fa-check-circle text-emerald-600' : (result.meetsPoints ? 'fa-exclamation-triangle text-amber-500' : 'fa-times-circle text-red-600');
        
        html += `
            <div class="prereq-card ${cardClass} bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
                <div class="flex items-start justify-between mb-3">
                    <div>
                        <div class="flex items-center gap-x-2">
                            <span class="px-2.5 py-0.5 text-[10px] font-bold rounded-full ${rank === 1 ? 'bg-blue-800 text-white' : 'bg-slate-500 text-white'}">${rank}${rank === 1 ? 'st' : rank === 2 ? 'nd' : 'rd'} CHOICE</span>
                            <span class="font-bold text-lg text-slate-900 dark:text-white">${PROGRAMME_REQUIREMENTS[value]?.label || value}</span>
                        </div>
                    </div>
                    <div class="text-right">
                        <i class="fa-solid ${icon} text-2xl"></i>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div class="flex items-center gap-x-2">
                        <span class="font-semibold text-slate-600 dark:text-slate-400 w-24">Points:</span>
                        <span class="font-bold tabular-nums ${result.meetsPoints ? 'text-emerald-600' : 'text-red-600'}">${formData.bestSix} / ${result.threshold}</span>
                        ${result.meetsPoints ? '<i class="fa-solid fa-check text-emerald-500 ml-1"></i>' : '<i class="fa-solid fa-times text-red-500 ml-1"></i>'}
                    </div>
                    
                    <div class="flex items-center gap-x-2">
                        <span class="font-semibold text-slate-600 dark:text-slate-400 w-24">Category:</span>
                        <span class="font-medium">${formData.isSpecial ? formData.senOvc + ' (Special)' : 'Standard'}</span>
                    </div>
                </div>
                
                ${result.subjectIssues && result.subjectIssues.length > 0 ? `
                    <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                        <div class="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">SUBJECT REQUIREMENTS:</div>
                        <ul class="text-xs text-slate-600 dark:text-slate-300 space-y-0.5">
                            ${result.subjectIssues.map(issue => `<li class="flex items-start gap-x-1.5"><i class="fa-solid fa-info-circle mt-0.5 text-amber-500"></i> ${issue}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                ${result.meetsAlt ? `
                    <div class="mt-2 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-xl inline-flex items-center gap-x-1">
                        <i class="fa-solid fa-check-double"></i> <span>Meets alternative pathway (vocational/work exp)</span>
                    </div>
                ` : ''}
                
                <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <div class="text-sm font-bold ${result.eligible ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}">
                        ${result.status}
                    </div>
                    ${result.note ? `<div class="text-[10px] text-slate-500 max-w-[220px] text-right">${result.note}</div>` : ''}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    section.innerHTML = html;
}

function getFormDataForValidation() {
    const bestSix = window.currentBestSix || 0;
    const senOvc = document.getElementById('sen-ovc')?.value || 'No';
    const isSpecial = ['SEN', 'OVC', 'RAD'].includes(senOvc);
    const workMonths = parseInt(document.getElementById('work-experience')?.value) || 0;
    const vocational = document.getElementById('vocational-qualification')?.value?.trim() || '';
    
    return {
        bestSix,
        isSpecial,
        senOvc,
        workMonths,
        hasVocational: !!vocational,
        vocationalName: vocational,
        subjectPoints: window.currentSubjectPoints || {}
    };
}

function checkEligibility(progValue, formData) {
    const req = PROGRAMME_REQUIREMENTS[progValue];
    if (!req) {
        return { eligible: false, status: 'Unknown Programme', meetsPoints: false, meetsSubjects: false, subjectIssues: [], threshold: 0 };
    }
    
    const threshold = formData.isSpecial && req.minPointsSpecial ? req.minPointsSpecial : req.minPoints;
    const meetsPoints = formData.bestSix >= threshold;
    
    let meetsSubjects = true;
    let subjectIssues = [];
    
    if (req.requiredSubjects && req.requiredSubjects.length > 0) {
        for (const r of req.requiredSubjects) {
            const pts = formData.subjectPoints[r.code] || 0;
            if (pts < r.minPoints) {
                meetsSubjects = false;
                const neededGrade = Object.keys(GRADE_POINTS).find(g => GRADE_POINTS[g] === r.minPoints) || 'D';
                const hasGrade = Object.keys(GRADE_POINTS).find(g => GRADE_POINTS[g] === pts) || '-';
                subjectIssues.push(`${r.name} needs ${neededGrade} or better (current: ${hasGrade})`);
            }
        }
    }
    
    // Alternative pathway check (simplified)
    let meetsAlt = false;
    if (req.altPathway && formData.hasVocational) {
        meetsAlt = true;
    }
    if (['Travel Management', 'Culinary Arts', 'Hospitality Management', 'Textile Design'].includes(progValue) && formData.workMonths >= 24) {
        meetsAlt = true;
    }
    
    // Special logic for CVET
    let eligible = false;
    if (progValue === 'CVET') {
        eligible = formData.hasVocational || (formData.bestSix >= 20); // loose for demo
    } else {
        eligible = meetsPoints && (meetsSubjects || meetsAlt);
    }
    
    let status = 'Not Qualified';
    if (eligible) {
        status = formData.isSpecial ? 'Qualified (Special Category Advantage)' : 'Qualified';
    } else if (meetsPoints && !meetsSubjects && !meetsAlt) {
        status = 'Review Recommended (points met, subjects pending)';
    }
    
    return {
        eligible,
        status,
        meetsPoints,
        meetsSubjects,
        meetsAlt,
        subjectIssues,
        threshold,
        note: req.note || (req.addedAdvantage ? 'Added advantage subjects: ' + req.addedAdvantage.join(', ') : '')
    };
}

// ==================== FORM SUBMISSION ====================
function submitApplication(e) {
    e.preventDefault();
    
    if (!validateChoices()) {
        showToast('Please fix duplicate programme choices', 'error');
        return;
    }
    
    const idValid = validateIdentityNumber();
    if (!idValid) {
        showToast('Please fix Identity Number / Gender mismatch', 'error');
        return;
    }
    
    const formData = gatherFullFormData();
    if (!formData.surname || !formData.firstName || !formData.choice1) {
        showToast('Please complete all required fields (Surname, First Name, 1st Choice)', 'error');
        return;
    }
    
    // Compute eligibility for primary choice
    const primaryCheck = checkEligibility(formData.choice1, {
        bestSix: formData.bestSix,
        isSpecial: formData.isSpecial,
        senOvc: formData.senOvc,
        workMonths: formData.workExpMonths,
        hasVocational: !!formData.vocationalQualification,
        subjectPoints: formData.grades
    });
    
    // Build application object
    const app = {
        id: Date.now(),
        ref: 'APP-' + new Date().getFullYear() + '-' + String(applications.length + 101).padStart(4, '0'),
        submittedAt: new Date().toISOString(),
        personal: {
            surname: formData.surname,
            firstName: formData.firstName,
            otherNames: formData.otherNames,
            dob: formData.dob,
            gender: formData.gender,
            identityNumber: formData.identityNumber,
            nationality: formData.nationality
        },
        nextOfKin: {
            name: formData.kinName,
            relationship: formData.kinRelationship,
            phone: formData.kinPhone,
            email: formData.kinEmail
        },
        choices: [
            { rank: 1, programme: formData.choice1, eligibility: checkEligibility(formData.choice1, {bestSix: formData.bestSix, isSpecial: formData.isSpecial, senOvc: formData.senOvc, workMonths: formData.workExpMonths, hasVocational: !!formData.vocationalQualification, subjectPoints: formData.grades}) },
            formData.choice2 ? { rank: 2, programme: formData.choice2, eligibility: checkEligibility(formData.choice2, {bestSix: formData.bestSix, isSpecial: formData.isSpecial, senOvc: formData.senOvc, workMonths: formData.workExpMonths, hasVocational: !!formData.vocationalQualification, subjectPoints: formData.grades}) } : null,
            formData.choice3 ? { rank: 3, programme: formData.choice3, eligibility: checkEligibility(formData.choice3, {bestSix: formData.bestSix, isSpecial: formData.isSpecial, senOvc: formData.senOvc, workMonths: formData.workExpMonths, hasVocational: !!formData.vocationalQualification, subjectPoints: formData.grades}) } : null
        ].filter(Boolean),
        education: {
            grades: formData.grades,
            bestSixPoints: formData.bestSix,
            totalPoints: formData.totalPoints
        },
        specialCategory: formData.senOvc,
        workExperienceMonths: formData.workExpMonths,
        vocationalQualification: formData.vocationalQualification ? {
            name: formData.vocationalQualification,
            institution: formData.vocationalInstitution,
            year: formData.vocationalYear,
            durationMonths: formData.vocationalDuration
        } : null,
        otherQualifications: formData.otherQualifications,
        documents: formData.documents,
        receiptNumber: formData.receiptNumber,
        overallStatus: primaryCheck.status,
        primaryProgramme: formData.choice1
    };
    
    // Save
    applications.unshift(app);
    localStorage.setItem('fctveApplications', JSON.stringify(applications));
    
    // Update UI
    updateAppCount();
    renderApplicationsTable();
    
    // Success feedback
    showToast(`Application ${app.ref} submitted successfully!`, 'success');
    
    // Clear form + draft
    document.getElementById('admission-form').reset();
    localStorage.removeItem('admissionsDraft');
    window.currentBestSix = 0;
    window.currentSubjectPoints = {};
    
    // Reset points display
    document.querySelectorAll('.points-display').forEach(el => el.textContent = '0');
    document.getElementById('best-six-points').textContent = '0';
    document.getElementById('total-points').textContent = '0';
    
    // Refresh prereq section
    document.getElementById('prerequisite-section').innerHTML = '<div class="text-emerald-600 italic">Application submitted. You can submit another or view in All Applications tab.</div>';
    
    // Switch to All Applications tab after short delay
    setTimeout(() => {
        showTab('all-applications');
    }, 900);
}

// Gather all form values
function gatherFullFormData() {
    const getVal = id => document.getElementById(id)?.value?.trim() || '';
    const getChecked = id => document.getElementById(id)?.checked || false;
    
    const { bestSix, totalPoints, subjectPoints } = calculateAndUpdatePoints();
    
    return {
        choice1: getVal('choice1'),
        choice2: getVal('choice2'),
        choice3: getVal('choice3'),
        receiptNumber: getVal('receipt-number'),
        surname: getVal('surname'),
        firstName: getVal('first-name'),
        otherNames: getVal('other-names'),
        dob: getVal('dob'),
        gender: getVal('gender'),
        identityNumber: getVal('identity-number'),
        nationality: getVal('nationality'),
        kinName: getVal('kin-name'),
        kinRelationship: getVal('kin-relationship'),
        kinPhone: getVal('kin-phone'),
        kinEmail: getVal('kin-email'),
        senOvc: getVal('sen-ovc'),
        isSpecial: ['SEN','OVC','RAD'].includes(getVal('sen-ovc')),
        workExpMonths: parseInt(getVal('work-experience')) || 0,
        vocationalQualification: getVal('vocational-qualification'),
        vocationalInstitution: getVal('vocational-institution'),
        vocationalYear: getVal('vocational-year'),
        vocationalDuration: getVal('vocational-duration'),
        otherQualifications: getVal('other-qualifications'),
        documents: {
            id: getChecked('doc-id'),
            bgcse: getChecked('doc-bgcse'),
            kin: getChecked('doc-kin'),
            vocational: getChecked('doc-vocational'),
            sponsor: getChecked('doc-sponsor'),
            medical: getChecked('doc-medical')
        },
        grades: subjectPoints,
        bestSix,
        totalPoints
    };
}

// ==================== APPLICATIONS STORAGE & RENDER ====================
function loadApplications() {
    const saved = localStorage.getItem('fctveApplications');
    applications = saved ? JSON.parse(saved) : [];
}

function saveApplications() {
    localStorage.setItem('fctveApplications', JSON.stringify(applications));
}

function updateAppCount() {
    const badge = document.getElementById('app-count');
    if (badge) badge.textContent = applications.length;
}

function renderApplicationsTable(filteredApps = null) {
    const tbody = document.getElementById('applications-table-body');
    const noApps = document.getElementById('no-applications');
    if (!tbody) return;
    
    const list = filteredApps || applications;
    
    if (list.length === 0) {
        tbody.innerHTML = '';
        if (noApps) noApps.classList.remove('hidden');
        return;
    }
    
    if (noApps) noApps.classList.add('hidden');
    
    tbody.innerHTML = list.map(app => {
        const statusClass = app.overallStatus.includes('Qualified') ? 'status-qualified' : 
                           app.overallStatus.includes('Review') ? 'status-review' : 'status-not-qualified';
        
        const primary = app.choices?.[0]?.programme || app.primaryProgramme || 'N/A';
        
        return `
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer" onclick="showApplicationDetail('${app.ref}')">
                <td class="px-6 py-4 font-mono text-xs text-slate-500">${app.ref}</td>
                <td class="px-6 py-4">
                    <div class="font-semibold">${app.personal.surname}, ${app.personal.firstName}</div>
                    <div class="text-xs text-slate-500">${app.personal.identityNumber || ''}</div>
                </td>
                <td class="px-6 py-4 text-sm">${primary}</td>
                <td class="px-6 py-4 text-center">
                    <span class="font-bold tabular-nums text-lg">${app.education?.bestSixPoints || 0}</span>
                    <span class="text-xs text-slate-500 block -mt-1">pts</span>
                </td>
                <td class="px-6 py-4 text-center">
                    <span class="status-badge ${statusClass}">${app.overallStatus}</span>
                </td>
                <td class="px-6 py-4 text-center text-xs text-slate-500">
                    ${new Date(app.submittedAt).toLocaleDateString('en-GB', {day:'2-digit', month:'short'})}
                </td>
                <td class="px-6 py-4 text-center">
                    <button onclick="event.stopImmediatePropagation(); showApplicationDetail('${app.ref}');" 
                            class="px-3 py-1 text-xs font-semibold bg-white border border-slate-300 hover:bg-blue-50 rounded-xl transition-colors">
                        <i class="fa-solid fa-eye mr-1"></i> View
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function showApplicationDetail(ref) {
    const app = applications.find(a => a.ref === ref);
    if (!app) return;
    
    currentModalRef = ref;
    
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('modal-content');
    const nameEl = document.getElementById('modal-name');
    const refEl = document.getElementById('modal-ref');
    const statusEl = document.getElementById('modal-status-badge');
    
    if (!modal || !content) return;
    
    refEl.textContent = app.ref;
    nameEl.textContent = `${app.personal.surname}, ${app.personal.firstName} ${app.personal.otherNames || ''}`;
    
    const statusClass = app.overallStatus.includes('Qualified') ? 'status-qualified' : 
                       app.overallStatus.includes('Review') ? 'status-review' : 'status-not-qualified';
    statusEl.innerHTML = `<span class="status-badge ${statusClass} px-4 py-1 text-sm">${app.overallStatus}</span>`;
    
    let html = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <!-- Personal -->
            <div class="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5">
                <div class="font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-x-2"><i class="fa-solid fa-user text-blue-600"></i> Personal Details</div>
                <div class="space-y-1.5 text-slate-600 dark:text-slate-300">
                    <div><span class="font-medium w-28 inline-block">Full Name:</span> ${app.personal.surname}, ${app.personal.firstName} ${app.personal.otherNames || ''}</div>
                    <div><span class="font-medium w-28 inline-block">DOB / Age:</span> ${app.personal.dob || 'N/A'} ${app.personal.dob ? '(' + calculateAge(app.personal.dob) + ' yrs)' : ''}</div>
                    <div><span class="font-medium w-28 inline-block">Gender:</span> ${app.personal.gender || 'N/A'}</div>
                    <div><span class="font-medium w-28 inline-block">ID / Passport:</span> <span class="font-mono">${app.personal.identityNumber}</span></div>
                    <div><span class="font-medium w-28 inline-block">Nationality:</span> ${app.personal.nationality}</div>
                </div>
            </div>
            
            <!-- Next of Kin -->
            <div class="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5">
                <div class="font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-x-2"><i class="fa-solid fa-users text-blue-600"></i> Next of Kin</div>
                <div class="space-y-1.5 text-slate-600 dark:text-slate-300">
                    <div><span class="font-medium w-28 inline-block">Name:</span> ${app.nextOfKin?.name || 'Not provided'}</div>
                    <div><span class="font-medium w-28 inline-block">Relationship:</span> ${app.nextOfKin?.relationship || '-'}</div>
                    <div><span class="font-medium w-28 inline-block">Phone:</span> ${app.nextOfKin?.phone || '-'}</div>
                    <div><span class="font-medium w-28 inline-block">Email:</span> ${app.nextOfKin?.email || '-'}</div>
                </div>
            </div>
        </div>
        
        <!-- Choices & Status -->
        <div class="mt-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
            <div class="font-bold text-slate-700 dark:text-slate-200 mb-3">Programme Choices & Assessment</div>
            <div class="space-y-3">
    `;
    
    app.choices.forEach((ch, idx) => {
        const el = ch.eligibility || {};
        const badge = el.eligible ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700';
        html += `
            <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div class="flex items-center gap-x-3">
                    <span class="font-mono text-xs px-2 py-0.5 bg-slate-200 dark:bg-slate-600 rounded">${ch.rank}${ch.rank===1?'st':ch.rank===2?'nd':'rd'}</span>
                    <span class="font-semibold">${ch.programme}</span>
                </div>
                <div class="flex items-center gap-x-3">
                    <span class="text-xs px-3 py-1 rounded-full font-bold ${badge}">${el.status || (el.eligible ? 'Qualified' : 'Not Qualified')}</span>
                    <span class="text-xs text-slate-500">Points: <span class="font-bold text-slate-700 dark:text-white">${app.education.bestSixPoints}</span></span>
                </div>
            </div>
        `;
    });
    
    html += `</div></div>`;
    
    // Education summary
    html += `
        <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center">
                <div class="text-xs text-slate-500">BEST 6 POINTS</div>
                <div class="text-4xl font-extrabold text-blue-700 dark:text-blue-400 tabular-nums">${app.education?.bestSixPoints || 0}</div>
            </div>
            <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center">
                <div class="text-xs text-slate-500">TOTAL POINTS (ALL)</div>
                <div class="text-4xl font-extrabold text-slate-700 dark:text-slate-300 tabular-nums">${app.education?.totalPoints || 0}</div>
            </div>
            <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
                <div class="text-xs text-slate-500 mb-1">SPECIAL CATEGORY</div>
                <div class="font-bold">${app.specialCategory || 'None'}</div>
                <div class="text-xs mt-2 text-slate-500">Work Exp: ${app.workExperienceMonths || 0} months</div>
            </div>
        </div>
    `;
    
    // Documents & other
    if (app.documents) {
        html += `<div class="mt-6 text-xs text-slate-500">Documents confirmed: ${Object.keys(app.documents).filter(k => app.documents[k]).map(k => k.toUpperCase()).join(', ') || 'None checked'}</div>`;
    }
    
    content.innerHTML = html;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function hideModal() {
    const modal = document.getElementById('detail-modal');
    if (modal) {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }
    currentModalRef = null;
}

function deleteCurrentApplication() {
    if (!currentModalRef) return;
    if (!confirm('Delete this application permanently?')) return;
    
    applications = applications.filter(a => a.ref !== currentModalRef);
    saveApplications();
    updateAppCount();
    renderApplicationsTable();
    hideModal();
    showToast('Application deleted', 'info');
}

// ==================== EXPORT & CLEAR ====================
function exportToCSV() {
    if (applications.length === 0) {
        showToast('No applications to export', 'info');
        return;
    }
    
    const headers = ['Reference', 'Surname', 'First Name', 'Primary Programme', 'Best 6 Points', 'Status', 'Submitted', 'Special Category', 'Work Exp (months)'];
    
    const rows = applications.map(app => [
        app.ref,
        app.personal.surname,
        app.personal.firstName,
        app.primaryProgramme || (app.choices?.[0]?.programme || ''),
        app.education?.bestSixPoints || 0,
        app.overallStatus,
        new Date(app.submittedAt).toLocaleDateString('en-GB'),
        app.specialCategory || '',
        app.workExperienceMonths || 0
    ]);
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FCTVE_Admissions_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    showToast('CSV exported successfully', 'success');
}

function clearAllApplications() {
    if (applications.length === 0) return;
    if (!confirm('This will permanently delete ALL applications. Continue?')) return;
    
    applications = [];
    localStorage.removeItem('fctveApplications');
    updateAppCount();
    renderApplicationsTable();
    showToast('All applications cleared', 'info');
}

// ==================== TABS ====================
function showTab(tabId) {
    // Hide all
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    
    // Show target
    const target = document.getElementById(tabId);
    if (target) target.classList.remove('hidden');
    
    // Update active tab style
    document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.classList.remove('active', 'bg-blue-800', 'text-white');
        btn.classList.add('text-slate-600');
        if (btn.id === `tab-${tabId}`) {
            btn.classList.add('active', 'bg-blue-800', 'text-white');
            btn.classList.remove('text-slate-600');
        }
    });
    
    // Special actions per tab
    if (tabId === 'all-applications') {
        renderApplicationsTable();
    }
    if (tabId === 'programmes' && swiperInstance) {
        setTimeout(() => swiperInstance.update(), 100);
    }
}

// ==================== SWIPER & PROGRAMME CARDS ====================
function initSwiper() {
    const swiperEl = document.querySelector('.mySwiper');
    if (!swiperEl || typeof Swiper === 'undefined') return;
    
    swiperInstance = new Swiper('.mySwiper', {
        slidesPerView: 1,
        spaceBetween: 16,
        pagination: { el: '.swiper-pagination', clickable: true },
        breakpoints: {
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
        }
    });
    
    // Populate slides
    const wrapper = swiperEl.querySelector('.swiper-wrapper');
    if (!wrapper) return;
    wrapper.innerHTML = '';
    
    PROGRAMMES.forEach(prog => {
        const req = PROGRAMME_REQUIREMENTS[prog.value] || {};
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `
            <div class="programme-card bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 h-full flex flex-col">
                <div class="flex items-center gap-x-3 mb-4">
                    <div class="w-11 h-11 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                        <i class="fa-solid fa-graduation-cap text-blue-700 dark:text-blue-400 text-xl"></i>
                    </div>
                    <div class="font-bold text-lg leading-tight">${prog.label}</div>
                </div>
                <div class="text-sm text-slate-600 dark:text-slate-300 flex-1">
                    ${req.note || 'Technical and vocational training with industry-relevant skills.'}
                    ${req.minPoints ? `<div class="mt-3 text-xs"><span class="font-semibold">Min Points:</span> ${req.minPoints} (Standard) / ${req.minPointsSpecial || req.minPoints} (SEN/OVC/RAD)</div>` : ''}
                </div>
                <button onclick="quickApply('${prog.value}'); event.stopImmediatePropagation();" 
                        class="mt-5 w-full py-2.5 text-sm font-semibold bg-blue-800 hover:bg-blue-900 text-white rounded-2xl transition-colors">
                    Apply for this Programme
                </button>
            </div>
        `;
        wrapper.appendChild(slide);
    });
}

function populateProgrammeCards() {
    const grid = document.getElementById('programme-cards');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    PROGRAMMES.forEach(prog => {
        const req = PROGRAMME_REQUIREMENTS[prog.value] || {};
        const card = document.createElement('div');
        card.className = 'programme-card bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 flex flex-col h-full';
        card.innerHTML = `
            <div class="flex-1">
                <div class="font-extrabold text-xl mb-2 leading-tight">${prog.label}</div>
                <div class="text-xs uppercase tracking-widest text-blue-600 dark:text-blue-400 font-bold mb-3">DTT&TE • FCTVE</div>
                <div class="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
                    ${req.note || 'Industry-aligned technical diploma with practical training and strong employment outcomes.'}
                </div>
                ${req.minPoints ? `
                    <div class="inline-flex items-center gap-x-2 text-xs bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-2xl mb-2">
                        <span class="font-bold">Entry:</span> 
                        <span class="font-mono">${req.minPoints} pts</span>
                    </div>
                ` : ''}
            </div>
            <button onclick="quickApply('${prog.value}')" 
                    class="mt-auto w-full py-3 text-sm font-bold bg-white border-2 border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white rounded-2xl transition-all active:scale-[0.985]">
                SELECT THIS PROGRAMME
            </button>
        `;
        grid.appendChild(card);
    });
}

function quickApply(progValue) {
    // Switch to new application and prefill 1st choice
    showTab('new-application');
    
    setTimeout(() => {
        const choice1 = document.getElementById('choice1');
        if (choice1) {
            choice1.value = progValue;
            validateChoices();
            updatePrerequisiteFields();
            // Scroll to form top
            document.getElementById('new-application').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 150);
}

// ==================== DRAFT & DEMO ====================
function autoSaveDraft() {
    clearTimeout(draftTimer);
    draftTimer = setTimeout(() => {
        const form = document.getElementById('admission-form');
        if (!form) return;
        
        const draft = {
            choice1: document.getElementById('choice1')?.value,
            choice2: document.getElementById('choice2')?.value,
            choice3: document.getElementById('choice3')?.value,
            receiptNumber: document.getElementById('receipt-number')?.value,
            surname: document.getElementById('surname')?.value,
            firstName: document.getElementById('first-name')?.value,
            // add more as needed
            timestamp: Date.now()
        };
        localStorage.setItem('admissionsDraft', JSON.stringify(draft));
    }, 800);
}

function restoreDraft() {
    const draftStr = localStorage.getItem('admissionsDraft');
    if (!draftStr) return;
    
    try {
        const draft = JSON.parse(draftStr);
        if (Date.now() - draft.timestamp > 1000 * 60 * 60 * 6) { // 6h expiry
            localStorage.removeItem('admissionsDraft');
            return;
        }
        
        // Restore key fields
        const map = {
            'choice1': draft.choice1,
            'choice2': draft.choice2,
            'choice3': draft.choice3,
            'receipt-number': draft.receiptNumber,
            'surname': draft.surname,
            'first-name': draft.firstName
        };
        
        Object.keys(map).forEach(id => {
            const el = document.getElementById(id);
            if (el && map[id]) el.value = map[id];
        });
        
        // Recalc after restore
        setTimeout(() => {
            calculateAndUpdatePoints();
            updatePrerequisiteFields();
        }, 300);
        
        console.log('%c[DRAFT] Restored previous form progress', 'color:#64748b');
    } catch (e) {}
}

function initDemoDataIfNeeded() {
    if (applications.length > 0) return;
    
    // Add 2-3 realistic demo applications so the All Applications tab is not empty on first use
    const demo1 = {
        id: Date.now() - 86400000 * 2,
        ref: 'APP-2026-0101',
        submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        personal: { surname: 'Molefe', firstName: 'Thabo', otherNames: 'James', dob: '2005-03-12', gender: 'Male', identityNumber: '050312345', nationality: 'Botswana' },
        nextOfKin: { name: 'Molefe Sarah', relationship: 'Parent', phone: '+267 71 234 567', email: 'sarah.molefe@email.com' },
        choices: [
            { rank: 1, programme: 'Computer Networking', eligibility: { eligible: true, status: 'Qualified' } },
            { rank: 2, programme: 'Systems Administration', eligibility: { eligible: true, status: 'Qualified' } }
        ],
        education: { grades: { EN: 6, MA: 7, CS: 6, BI: 5 }, bestSixPoints: 32, totalPoints: 41 },
        specialCategory: 'No',
        workExperienceMonths: 0,
        vocationalQualification: null,
        documents: { id: true, bgcse: true, kin: true, vocational: false, sponsor: false, medical: false },
        receiptNumber: 'REC-2026-00442',
        overallStatus: 'Qualified',
        primaryProgramme: 'Computer Networking'
    };
    
    const demo2 = {
        id: Date.now() - 86400000,
        ref: 'APP-2026-0102',
        submittedAt: new Date(Date.now() - 86400000).toISOString(),
        personal: { surname: 'Dlamini', firstName: 'Lerato', otherNames: '', dob: '2006-08-22', gender: 'Female', identityNumber: '060822789', nationality: 'Botswana' },
        nextOfKin: { name: 'Dlamini Joseph', relationship: 'Guardian', phone: '+267 76 555 123', email: '' },
        choices: [ { rank: 1, programme: 'Fashion Design', eligibility: { eligible: false, status: 'Not Qualified' } } ],
        education: { grades: { EN: 4, FF: 3, AD: 5 }, bestSixPoints: 24, totalPoints: 29 },
        specialCategory: 'OVC',
        workExperienceMonths: 8,
        vocationalQualification: { name: 'NC in Fashion Design', institution: 'FCTVE', year: '2025', durationMonths: 12 },
        documents: { id: true, bgcse: true, kin: true, vocational: true, sponsor: false, medical: false },
        receiptNumber: 'REC-2026-00451',
        overallStatus: 'Review Recommended (points met, subjects pending)',
        primaryProgramme: 'Fashion Design'
    };
    
    applications = [demo1, demo2];
    localStorage.setItem('fctveApplications', JSON.stringify(applications));
    updateAppCount();
}

// ==================== UTILITIES ====================
function showToast(message, type = 'success') {
    const container = document.body;
    
    const toast = document.createElement('div');
    toast.className = `toast fixed bottom-6 right-6 z-[100] px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-x-3 text-sm font-medium max-w-sm
        ${type === 'success' ? 'bg-emerald-600 text-white' : type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-800 text-white'}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    toast.innerHTML = `
        <i class="fa-solid ${icon} text-lg"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transition = 'all 0.3s ease';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3800);
}

function updateDarkModeIcon(isDark) {
    const icon = document.getElementById('dark-mode-icon');
    if (!icon) return;
    if (isDark) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Make key functions global for inline handlers
window.showTab = showTab;
window.submitApplication = submitApplication;
window.updatePrerequisiteFields = updatePrerequisiteFields;
window.validateIdentityNumber = validateIdentityNumber;
window.validateChoices = validateChoices;
window.showApplicationDetail = showApplicationDetail;
window.hideModal = hideModal;
window.deleteCurrentApplication = deleteCurrentApplication;
window.exportToCSV = exportToCSV;
window.clearAllApplications = clearAllApplications;
window.quickApply = quickApply;

// Boot
document.addEventListener('DOMContentLoaded', init);
