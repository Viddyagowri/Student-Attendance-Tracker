let attendanceData =
    JSON.parse(localStorage.getItem("attendanceData")) || [];

let attendanceChart = null;

document.getElementById("todayDate").textContent =
    "Date: " + new Date().toLocaleDateString();

function saveData() {
    localStorage.setItem(
        "attendanceData",
        JSON.stringify(attendanceData)
    );
}

function markAttendance(status) {

    const name = document.getElementById("name").value.trim();
    const roll = document.getElementById("roll").value.trim();
    const department = document.getElementById("department").value;

    if (name === "" || roll === "" || department === "") {
        alert("Please enter Name, Roll Number and Department");
        return;
    }

    const student = {
        id: Date.now(),
        name: name,
        roll: roll,
        department: department,
        status: status
    };

    attendanceData.push(student);

    saveData();

    document.getElementById("name").value = "";
    document.getElementById("roll").value = "";
    document.getElementById("department").value = "";

    displayAttendance();

    alert("Attendance marked successfully!");
}

function displayAttendance() {

    const list = document.getElementById("attendanceList");

    const selectedDepartment =
        document.getElementById("departmentFilter").value;

    const searchRoll =
        document.getElementById("searchRoll").value.toLowerCase();

    list.innerHTML = "";

    const filteredData = attendanceData.filter(student => {

        const departmentMatch =
            selectedDepartment === "All" ||
            student.department === selectedDepartment;

        const rollMatch =
            student.roll.toLowerCase().includes(searchRoll);

        return departmentMatch && rollMatch;
    });

    filteredData.forEach(student => {

        const row = document.createElement("tr");

        const statusClass =
            student.status === "Present"
                ? "present-status"
                : "absent-status";

        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.roll}</td>
            <td>${student.department}</td>
            <td class="${statusClass}">
                ${student.status}
            </td>
            <td>
                <button
                    class="delete-btn"
                    onclick="deleteStudent(${student.id})">
                    Delete
                </button>
            </td>
        `;

        list.appendChild(row);
    });

    updateDashboard();
    updateChart();
}

function deleteStudent(id) {

    if (confirm("Are you sure you want to delete this record?")) {

        attendanceData = attendanceData.filter(
            student => student.id !== id
        );

        saveData();
        displayAttendance();
    }
}

function updateDashboard() {

    const total = attendanceData.length;

    const present = attendanceData.filter(
        student => student.status === "Present"
    ).length;

    const absent = attendanceData.filter(
        student => student.status === "Absent"
    ).length;

    const percentage =
        total === 0
            ? 0
            : ((present / total) * 100).toFixed(1);

    document.getElementById("totalStudents").textContent = total;
    document.getElementById("presentCount").textContent = present;
    document.getElementById("absentCount").textContent = absent;
    document.getElementById("attendancePercentage").textContent =
        percentage + "%";
}

function updateChart() {

    const departments = [
        "CSE",
        "IT",
        "ECE",
        "EEE",
        "Mechanical",
        "Civil"
    ];

    const presentCounts = [];
    const absentCounts = [];

    departments.forEach(department => {

        const departmentStudents = attendanceData.filter(
            student => student.department === department
        );

        const present = departmentStudents.filter(
            student => student.status === "Present"
        ).length;

        const absent = departmentStudents.filter(
            student => student.status === "Absent"
        ).length;

        presentCounts.push(present);
        absentCounts.push(absent);
    });

    const chartCanvas =
        document.getElementById("attendanceChart");

    if (attendanceChart !== null) {
        attendanceChart.destroy();
    }

    attendanceChart = new Chart(chartCanvas, {
        type: "bar",

        data: {
            labels: departments,

            datasets: [
                {
                    label: "Present",
                    data: presentCounts,
                    backgroundColor: "#22c55e"
                },
                {
                    label: "Absent",
                    data: absentCounts,
                    backgroundColor: "#ef4444"
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

function downloadCSV() {

    if (attendanceData.length === 0) {
        alert("No attendance records available");
        return;
    }

    let csv =
        "Name,Roll Number,Department,Status\n";

    attendanceData.forEach(student => {

        csv +=
            `"${student.name}","${student.roll}","${student.department}","${student.status}"\n`;
    });

    const blob = new Blob([csv], {
        type: "text/csv"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "attendance_report.csv";

    link.click();

    URL.revokeObjectURL(url);
}

function clearAllData() {

    if (confirm("Are you sure you want to clear all attendance records?")) {

        attendanceData = [];

        saveData();
        displayAttendance();
    }
}

displayAttendance();