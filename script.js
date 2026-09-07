let presentCount = 0;
let absentCount = 0;
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
  "<button onclick='this.parentElement.parentElement.remove()'>Delete</button>";

    // Clear inputs
    document.getElementById("name").value = "";
    document.getElementById("roll").value = "";
    if (status === "Present") {
    presentCount++;
} else {
    absentCount++;
}

let total = presentCount + absentCount;
let percentage = ((presentCount / total) * 100).toFixed(0);

document.getElementById("summary").innerHTML =
`Present: ${presentCount} | Absent: ${absentCount} | Attendance: ${percentage}%`;
}