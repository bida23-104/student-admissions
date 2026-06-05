////////////////////////////////////////////////////
// FCTVE ADMISSIONS SYSTEM - APPLICATION ENGINE
////////////////////////////////////////////////////

// =========================
// GLOBAL STATE
// =========================
let currentUser = null;
let applications = JSON.parse(localStorage.getItem("applications")) || [];
let programmes = [
    { name: "Computer Networking", capacity: 60, accepted: 0 },
    { name: "Systems Administration", capacity: 50, accepted: 0 },
    { name: "Hospitality Management", capacity: 40, accepted: 0 },
    { name: "Fashion Design", capacity: 30, accepted: 0 }
];

// =========================
// LOGIN SYSTEM
// =========================
const users = [
    { username: "admin", password: "admin123", role: "admin" },
    { username: "officer", password: "review123", role: "officer" }
];

document.getElementById("login-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const user = users.find(u =>
        u.username === username && u.password === password
    );

    if (user) {
        currentUser = user;
        localStorage.setItem("currentUser", JSON.stringify(user));

        document.getElementById("login-screen").classList.add("hidden");
        document.getElementById("app-container").classList.remove("hidden");

        document.getElementById("logged-user").innerText = user.username;

        updateDashboard();
    } else {
        alert("Invalid login details");
    }
});

function logout() {
    localStorage.removeItem("currentUser");
    location.reload();
}

// =========================
// NAVIGATION SYSTEM
// =========================
function showSection(sectionId) {
    document.querySelectorAll(".page-section").forEach(sec => {
        sec.classList.add("hidden");
    });

    document.getElementById(sectionId).classList.remove("hidden");
}

// =========================
// BEST 6 POINTS CALCULATION
// =========================
function calculatePoints(grades) {
    const gradePoints = {
        "A": 1,
        "B": 2,
        "C": 3,
        "D": 4,
        "E": 5,
        "F": 6,
        "G": 7
    };

    let points = grades.map(g => gradePoints[g] || 0);
    points.sort((a, b) => a - b);

    return points.slice(0, 6).reduce((a, b) => a + b, 0);
}

// =========================
// ELIGIBILITY ENGINE
// =========================
function checkEligibility(app, programme) {
    let points = app.points;

    if (programme.name === "Computer Networking" && points <= 18) {
        return true;
    }
    if (programme.name === "Systems Administration" && points <= 20) {
        return true;
    }
    if (programme.name === "Hospitality Management" && points <= 25) {
        return true;
    }
    if (programme.name === "Fashion Design" && points <= 28) {
        return true;
    }

    return false;
}

// =========================
// APPLICATION SUBMISSION
// =========================
document.getElementById("admissionForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const surname = document.getElementById("surname").value;
    const firstname = document.getElementById("firstname").value;
    const identity = document.getElementById("identity").value;

    const choice1 = document.getElementById("choice1").value;
    const choice2 = document.getElementById("choice2").value;
    const choice3 = document.getElementById("choice3").value;

    // Dummy grades for demo (replace later with real inputs)
    const grades = ["A","B","C","D","C","B","A"];

    const points = calculatePoints(grades);

    let app = {
        id: Date.now(),
        surname,
        firstname,
        identity,
        choices: [choice1, choice2, choice3],
        points,
        status: "Submitted"
    };

    applications.push(app);
    localStorage.setItem("applications", JSON.stringify(applications));

    alert("Application submitted successfully!");

    updateDashboard();
    renderApplications();
});

// =========================
// PROGRAMME CAPACITY LOGIC
// =========================
function allocateProgramme(app) {
    for (let choice of app.choices) {
        let programme = programmes.find(p => p.name === choice);

        if (programme && programme.accepted < programme.capacity) {
            if (checkEligibility(app, programme)) {
                programme.accepted++;
                app.status = "Accepted";
                return choice;
            }
        }
    }

    app.status = "Waitlisted";
    return null;
}

// =========================
// DASHBOARD UPDATES
// =========================
function updateDashboard() {

    document.getElementById("totalApplications").innerText = applications.length;

    let accepted = applications.filter(a => a.status === "Accepted").length;
    let rejected = applications.filter(a => a.status === "Rejected").length;
    let pending = applications.filter(a => a.status === "Submitted").length;

    document.getElementById("qualifiedApplicants").innerText = accepted;
    document.getElementById("rejectedApplicants").innerText = rejected;
    document.getElementById("pendingApplicants").innerText = pending;

    updateAnalytics();
}

// =========================
// ANALYTICS ENGINE
// =========================
function updateAnalytics() {

    let totalPoints = applications.reduce((sum, a) => sum + a.points, 0);
    let avg = applications.length ? totalPoints / applications.length : 0;

    document.getElementById("avgPoints").innerText = avg.toFixed(2);

    let acceptanceRate = applications.length
        ? (applications.filter(a => a.status === "Accepted").length / applications.length) * 100
        : 0;

    document.getElementById("acceptanceRate").innerText = acceptanceRate.toFixed(1) + "%";

    let programmeCount = {};
    applications.forEach(a => {
        a.choices.forEach(c => {
            programmeCount[c] = (programmeCount[c] || 0) + 1;
        });
    });

    let popular = Object.keys(programmeCount).reduce((a,b) =>
        programmeCount[a] > programmeCount[b] ? a : b, "-");

    document.getElementById("popularProgramme").innerText = popular;
}

// =========================
// RENDER APPLICATIONS TABLE
// =========================
function renderApplications() {

    const table = document.getElementById("applicationsTable");
    table.innerHTML = "";

    applications.forEach(app => {

        let row = `
        <tr>
            <td>${app.surname} ${app.firstname}</td>
            <td>${app.choices[0]}</td>
            <td>${app.points}</td>
            <td><span class="status pending">${app.status}</span></td>
            <td>
                <button onclick="viewApp(${app.id})">View</button>
            </td>
        </tr>
        `;

        table.innerHTML += row;
    });
}

// =========================
// SEARCH FUNCTION
// =========================
document.getElementById("searchInput")?.addEventListener("input", function(e) {
    let value = e.target.value.toLowerCase();

    let filtered = applications.filter(a =>
        a.surname.toLowerCase().includes(value) ||
        a.firstname.toLowerCase().includes(value) ||
        a.identity.includes(value)
    );

    renderFiltered(filtered);
});

function renderFiltered(data) {
    const table = document.getElementById("applicationsTable");
    table.innerHTML = "";

    data.forEach(app => {
        table.innerHTML += `
        <tr>
            <td>${app.surname} ${app.firstname}</td>
            <td>${app.choices[0]}</td>
            <td>${app.points}</td>
            <td>${app.status}</td>
            <td><button>View</button></td>
        </tr>`;
    });
}

// =========================
// EXPORT FUNCTIONS
// =========================
function exportCSV() {
    let csv = "Name,Programme,Points,Status\n";

    applications.forEach(a => {
        csv += `${a.surname} ${a.firstname},${a.choices[0]},${a.points},${a.status}\n`;
    });

    let blob = new Blob([csv], { type: "text/csv" });
    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = "applications.csv";
    a.click();
}

// =========================
// INIT
// =========================
function init() {
    renderApplications();
    updateDashboard();
}

init();
