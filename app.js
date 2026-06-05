////////////////////////////////////////////////////
// FCTVE ADMISSIONS SYSTEM - CLEAN VERSION (NO LOGIN)
////////////////////////////////////////////////////

// =========================
// GLOBAL STATE
// =========================
let applications = JSON.parse(localStorage.getItem("applications")) || [];

let programmes = [
    { name: "Computer Networking", capacity: 60, accepted: 0 },
    { name: "Systems Administration", capacity: 50, accepted: 0 },
    { name: "Hospitality Management", capacity: 40, accepted: 0 },
    { name: "Fashion Design", capacity: 30, accepted: 0 }
];

// =========================
// NAVIGATION
// =========================
function showSection(id) {
    document.querySelectorAll(".page-section")
        .forEach(sec => sec.classList.add("hidden"));

    document.getElementById(id).classList.remove("hidden");
}

// =========================
// BEST 6 POINTS CALCULATION
// =========================
function calcPoints(grades) {
    const map = { A:1, B:2, C:3, D:4, E:5, F:6, G:7 };

    let points = grades.map(g => map[g] || 7);
    points.sort((a,b)=>a-b);

    return points.slice(0,6).reduce((a,b)=>a+b,0);
}

// =========================
// ELIGIBILITY RULES
// =========================
function eligible(points, programme) {

    const rules = {
        "Computer Networking": 18,
        "Systems Administration": 20,
        "Hospitality Management": 25,
        "Fashion Design": 28
    };

    return points <= (rules[programme] || 30);
}

// =========================
// RANKED CHOICE ALLOCATION
// =========================
function allocate(app) {

    for (let choice of app.choices) {

        let prog = programmes.find(p => p.name === choice);

        if (!prog) continue;

        if (prog.accepted >= prog.capacity) continue;

        if (!eligible(app.points, prog.name)) continue;

        prog.accepted++;
        return { status: "Accepted", programme: prog.name };
    }

    return { status: "Waitlisted", programme: null };
}

// =========================
// SUBMIT APPLICATION
// =========================
document.getElementById("admissionForm").addEventListener("submit", e => {
    e.preventDefault();

    let app = {
        id: Date.now(),
        surname: surname.value,
        firstname: firstname.value,
        identity: identity.value,
        choices: [choice1.value, choice2.value, choice3.value],

        // demo grades (you can replace with real inputs later)
        points: calcPoints(["A","B","C","D","C","B","A"]),

        status: "Submitted",
        programme: null
    };

    let result = allocate(app);

    app.status = result.status;
    app.programme = result.programme;

    applications.push(app);
    localStorage.setItem("applications", JSON.stringify(applications));

    updateDashboard();
    renderApplications();

    alert("Application submitted successfully!");
});

// =========================
// DASHBOARD
// =========================
function updateDashboard() {

    totalApplications.innerText = applications.length;

    qualifiedApplicants.innerText =
        applications.filter(a => a.status === "Accepted").length;

    rejectedApplicants.innerText =
        applications.filter(a => a.status === "Rejected").length;

    pendingApplicants.innerText =
        applications.filter(a => a.status === "Submitted").length;

    updateCharts();
}

// =========================
// ANALYTICS + CHARTS
// =========================
let programmeChart, statusChart;

function updateCharts() {

    let programmeCount = {};
    let statusCount = {};

    applications.forEach(a => {

        let prog = a.programme || "Unassigned";
        programmeCount[prog] = (programmeCount[prog] || 0) + 1;

        statusCount[a.status] = (statusCount[a.status] || 0) + 1;
    });

    if (programmeChart) programmeChart.destroy();
    if (statusChart) statusChart.destroy();

    programmeChart = new Chart(programmeChartCanvas, {
        type: "bar",
        data: {
            labels: Object.keys(programmeCount),
            datasets: [{
                label: "Applications",
                data: Object.values(programmeCount)
            }]
        }
    });

    statusChart = new Chart(statusChartCanvas, {
        type: "pie",
        data: {
            labels: Object.keys(statusCount),
            datasets: [{
                data: Object.values(statusCount)
            }]
        }
    });
}

// =========================
// TABLE RENDER
// =========================
function renderApplications() {

    applicationsTable.innerHTML = "";

    applications.forEach(a => {

        applicationsTable.innerHTML += `
        <tr>
            <td>${a.surname} ${a.firstname}</td>
            <td>${a.programme || "-"}</td>
            <td>${a.points}</td>
            <td>${a.status}</td>
            <td>
                <button onclick="viewApp(${a.id})">
                    View
                </button>
            </td>
        </tr>`;
    });
}

// =========================
// SEARCH
// =========================
document.getElementById("searchInput")?.addEventListener("input", e => {

    let value = e.target.value.toLowerCase();

    let filtered = applications.filter(a =>
        a.surname.toLowerCase().includes(value) ||
        a.firstname.toLowerCase().includes(value) ||
        a.identity.includes(value)
    );

    renderFiltered(filtered);
});

function renderFiltered(data) {

    applicationsTable.innerHTML = "";

    data.forEach(a => {

        applicationsTable.innerHTML += `
        <tr>
            <td>${a.surname} ${a.firstname}</td>
            <td>${a.programme || "-"}</td>
            <td>${a.points}</td>
            <td>${a.status}</td>
            <td><button>View</button></td>
        </tr>`;
    });
}

// =========================
// EXPORT CSV
// =========================
function exportCSV() {

    let csv = "Name,Programme,Points,Status\n";

    applications.forEach(a => {
        csv += `${a.surname} ${a.firstname},${a.programme},${a.points},${a.status}\n`;
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
