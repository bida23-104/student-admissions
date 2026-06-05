////////////////////////////////////////////////////
// FINAL POLISH - FCTVE ADMISSIONS SYSTEM
////////////////////////////////////////////////////

// =========================
// STATE
// =========================
let applications = JSON.parse(localStorage.getItem("applications")) || [];

let programmes = [
    { name: "Computer Networking", capacity: 60, accepted: 0 },
    { name: "Systems Administration", capacity: 50, accepted: 0 },
    { name: "Hospitality Management", capacity: 40, accepted: 0 },
    { name: "Fashion Design", capacity: 30, accepted: 0 }
];

// =========================
// LOGIN (SIMPLE DEMO)
// =========================
const users = [
    { username: "admin", password: "admin123", role: "admin" },
    { username: "officer", password: "review123", role: "officer" }
];

document.getElementById("login-form").addEventListener("submit", e => {
    e.preventDefault();

    const u = username.value;
    const p = password.value;

    let user = users.find(x => x.username === u && x.password === p);

    if (!user) return alert("Invalid login");

    localStorage.setItem("user", JSON.stringify(user));

    login-screen.classList.add("hidden");
    app-container.classList.remove("hidden");

    updateDashboard();
    renderApplications();
});

// =========================
// NAVIGATION
// =========================
function showSection(id) {
    document.querySelectorAll(".page-section")
        .forEach(s => s.classList.add("hidden"));

    document.getElementById(id).classList.remove("hidden");
}

// =========================
// BEST 6 POINTS
// =========================
function calcPoints(grades) {
    const map = {A:1,B:2,C:3,D:4,E:5,F:6,G:7};

    let pts = grades.map(g => map[g] || 7);
    pts.sort((a,b)=>a-b);

    return pts.slice(0,6).reduce((a,b)=>a+b,0);
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
// RANKED CHOICE ENGINE (KEY FEATURE)
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

    alert("Application processed successfully!");
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
// CHARTS (POLISHED)
// =========================
let programmeChart, statusChart;

function updateCharts() {

    let programmeCount = {};
    let statusCount = {};

    applications.forEach(a => {

        programmeCount[a.programme || "None"] =
            (programmeCount[a.programme || "None"] || 0) + 1;

        statusCount[a.status] =
            (statusCount[a.status] || 0) + 1;
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
// RENDER TABLE
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
// ADMISSION LETTER (BIG MARKS FEATURE)
// =========================
function generateLetter(app) {

    let text = `
    LETTER OF ADMISSION

    Dear ${app.firstname} ${app.surname},

    You have been ${app.status} into:
    ${app.programme || "N/A"}

    Congratulations.
    `;

    let win = window.open();
    win.document.write(`<pre>${text}</pre>`);
    win.print();
}

// =========================
// INIT
// =========================
function init() {
    renderApplications();
    updateDashboard();
}

init();
