let records = JSON.parse(localStorage.getItem("airconRecords")) || [];

function saveRecord() {
    const record = {
        personnel: document.getElementById("personnel").value,
        brand: document.getElementById("brand").value,
        equipmentType: document.getElementById("equipmentType").value,
        serialNumber: document.getElementById("serialNumber").value,
        location: document.getElementById("location").value,
        inspectionDate: document.getElementById("inspectionDate").value,
        inspector: document.getElementById("inspector").value,
        status: document.getElementById("status").value,
        remarks: document.getElementById("remarks").value
    };

    records.push(record);
    localStorage.setItem("airconRecords", JSON.stringify(records));

    document.querySelectorAll("input, textarea").forEach(el => {
        if (el.type !== "button") el.value = "";
    });

    loadRecords();
}

function loadRecords() {
    const table = document.getElementById("recordsTable");
    const search = document.getElementById("search").value.toLowerCase();

    table.innerHTML = "";

    records.forEach((record, index) => {
        const text = JSON.stringify(record).toLowerCase();

        if (text.includes(search)) {
           table.innerHTML += `
<tr>
    <td>${record.inspectionDate}</td>
    <td>${record.inspector}</td>
    <td>${record.status}</td>
    <td>${record.brand} ${record.equipmentType}</td>
    <td>${record.remarks}</td>
    <td>
        <button onclick="editRecord(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteRecord(${index})">
            Delete
        </button>
    </td>
</tr>`;
        }
    });

    document.getElementById("totalRecords").textContent = records.length;
}

function deleteRecord(index) {
    if (confirm("Delete this record?")) {
        records.splice(index, 1);
        localStorage.setItem("airconRecords", JSON.stringify(records));
        loadRecords();
    }
}

function exportCSV() {
    let csv =
        "Date,Inspector,Status,Personnel,Brand,Equipment Type,Serial Number,Location,Remarks\n";

    records.forEach(r => {
        csv += `"${r.inspectionDate}","${r.inspector}","${r.status}","${r.personnel}","${r.brand}","${r.equipmentType}","${r.serialNumber}","${r.location}","${r.remarks}"\n`;
    });

    const blob = new Blob([csv], {
        type: "text/csv"
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Aircon_Maintenance_Records.csv";
    a.click();
}

function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Air Conditioner Maintenance Records", 14, 15);

    const rows = records.map(r => [
        r.inspectionDate,
        r.inspector,
        r.status,
        r.brand + " " + r.equipmentType,
        r.location,
        r.remarks
    ]);

    doc.autoTable({
        head: [["Date", "Inspector", "Status", "Equipment", "Location", "Remarks"]],
        body: rows,
        startY: 20
    });

    doc.save("Aircon_Maintenance_Records.pdf");
}

window.onload = loadRecords;

    const accounts = [
    {
        username: "admin",
        password: "admin123",
        role: "admin"
    },
    {
        username: "user",
        password: "user123",
        role: "user"
    }
];

let currentUser = null;

function login() {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const account = accounts.find(
        a => a.username === username && a.password === password
    );

    if (!account) {
        alert("Invalid Login");
        return;
    }

    currentUser = account;

    localStorage.setItem(
        "currentUser",
        JSON.stringify(account)
    );

    document.getElementById("loginPage").style.display = "none";
    document.getElementById("mainSystem").style.display = "block";

    setupPermissions();
}

function logout() {

    localStorage.removeItem("currentUser");

    document.getElementById("loginPage").style.display = "flex";
    document.getElementById("mainSystem").style.display = "none";
}

function setupPermissions() {

    const saveBtn = document.querySelector(
        "button[onclick='saveRecord()']"
    );

    if (currentUser.role === "user") {

        saveBtn.style.display = "none";

        document.querySelectorAll(".delete-btn")
            .forEach(btn => btn.style.display = "none");
    }
}
    window.onload = function () {

    const savedUser =
        JSON.parse(localStorage.getItem("currentUser"));

    if (savedUser) {

        currentUser = savedUser;

        document.getElementById("loginPage").style.display = "none";
        document.getElementById("mainSystem").style.display = "block";

        setupPermissions();
    }
    else {

        document.getElementById("loginPage").style.display = "flex";
        document.getElementById("mainSystem").style.display = "none";
    }


    loadRecords();
};