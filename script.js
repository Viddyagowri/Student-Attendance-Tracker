// Display today's date
let today = new Date();

document.getElementById("todayDate").innerHTML =
    "Date: " + today.toLocaleDateString();


// Attendance count
let presentCount = 0;
let absentCount = 0;


// Mark Attendance
function markAttendance(status) {

    let name = document.getElementById("name").value;
    let roll = document.getElementById("roll").value;

    if (name === "" || roll === "") {
        alert("Please enter Name and Roll Number");
        return;
    }

    let table = document.getElementById("attendanceList");

    let row = table.insertRow();

    row.insertCell(0).innerHTML = name;
    row.insertCell(1).innerHTML = roll;
    row.insertCell(2).innerHTML = status;

    let deleteCell = row.insertCell(3);

    deleteCell.innerHTML =
        "<button onclick='deleteAttendance(this)'>Delete</button>";


    // Update count
    if (status === "Present") {
        presentCount++;
    } else {
        absentCount++;
    }


    // Clear inputs
    document.getElementById("name").value = "";
    document.getElementById("roll").value = "";


    // Update summary
    updateSummary();


    // Save data
    saveData();
}


// Delete Attendance
function deleteAttendance(button) {

    let row = button.parentElement.parentElement;

    // Get status before deleting
    let status = row.cells[2].innerHTML;

    // Delete row
    row.remove();


    // Update count
    if (status === "Present") {
        presentCount--;
    } else {
        absentCount--;
    }


    // Update summary
    updateSummary();


    // Save updated data
    saveData();
}


// Update Summary
function updateSummary() {

    let total = presentCount + absentCount;

    let percentage = 0;

    if (total > 0) {
        percentage =
            ((presentCount / total) * 100).toFixed(0);
    }

    document.getElementById("summary").innerHTML =
        `Present: ${presentCount} | Absent: ${absentCount} | Attendance: ${percentage}%`;
}


// Search Student
function searchStudent() {

    let input =
        document.getElementById("searchRoll").value.toUpperCase();

    let table =
        document.getElementById("attendanceList");

    let rows =
        table.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {

        if (rows[i].cells.length > 1) {

            let roll =
                rows[i].cells[1].innerHTML.toUpperCase();

            rows[i].style.display =
                roll.includes(input) ? "" : "none";
        }
    }
}


// Save Data
function saveData() {

    localStorage.setItem(
        "attendance",
        document.getElementById("attendanceList").innerHTML
    );
}


// Load Data
function loadData() {

    document.getElementById("attendanceList").innerHTML =
        localStorage.getItem("attendance") || "";


    // Recalculate attendance count
    let table =
        document.getElementById("attendanceList");

    let rows =
        table.getElementsByTagName("tr");

    presentCount = 0;
    absentCount = 0;


    for (let i = 0; i < rows.length; i++) {

        if (rows[i].cells.length > 2) {

            let status =
                rows[i].cells[2].innerHTML;

            if (status === "Present") {
                presentCount++;
            } else if (status === "Absent") {
                absentCount++;
            }

            // Restore delete button
            rows[i].cells[3].innerHTML =
                "<button onclick='deleteAttendance(this)'>Delete</button>";
        }
    }


    // Update summary
    updateSummary();
}


// Load saved data when page opens
loadData();