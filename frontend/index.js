const API = "http://127.0.0.1:8000";

if (window.location.pathname.includes("dashboard.html")) {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "index.html";
    }
}

/* ================= HEADERS ================= */
function headers() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
}

/* ================= LOGIN ================= */
async function login() {
    const username = document.getElementById("username")?.value;
    const password = document.getElementById("password")?.value;

    if (!username || !password) {
        alert("Enter credentials");
        return;
    }

    const res = await fetch(API + "/login/", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!data.access) {
        alert("Invalid login");
        return;
    }

    localStorage.setItem("token", data.access);
    window.location.href = "dashboard.html";
}

/* ================= CATEGORY DATA ================= */
async function loadCategoryData(month, year) {
    const token = localStorage.getItem("token");

    const res = await fetch(
        `${API}/category-analysis/?month=${month}&year=${year}`,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    const data = await res.json();

    return Object.keys(data).length === 0 ? { "No Data": 1 } : data;
}

/* ================= LOAD DASHBOARD ================= */
async function loadDashboard() {

    const token = localStorage.getItem("token");

    // 🔒 Protect route
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    let res;

    try {
        res = await fetch(API + "/dashboard/", {
            headers: headers()
        });
    } catch (err) {
        console.error("Network error");
        return;
    }

    if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "index.html";
        return;
    }

    const data = await res.json();

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    let income = 0;
    let expense = 0;

    // ✅ ONLY CURRENT MONTH DATA
    if (data[currentMonth]) {
        income = data[currentMonth].income;
        expense = data[currentMonth].expense;
    }

    // UI update
    document.getElementById("income").innerText = "₹" + income;
    document.getElementById("expense").innerText = "₹" + expense;
    document.getElementById("savings").innerText = "₹" + (income - expense);

    // TRANSACTION DISPLAY
    const container = document.getElementById("transactions");
    if (container) {
        container.innerHTML = "";

        if (data[currentMonth]) {
            const div = document.createElement("div");
            div.innerText = `This Month → Expense: ₹${expense}`;
            container.appendChild(div);
        }
    }

    // CATEGORY ANALYTICS
    const categories = await loadCategoryData(currentMonth, currentYear);

    renderCharts(data, categories, currentMonth);
}

/* ================= ADD EXPENSE ================= */
async function addExpense(event) {

    const titleInput = document.getElementById("title");
    const amountInput = document.getElementById("amount");
    const categoryInput = document.getElementById("category");
    const successMsg = document.getElementById("successMsg");

    if (!titleInput || !amountInput || !categoryInput) return;

    const today = new Date();

    const btn = event.target;
    btn.innerText = "Adding...";
    btn.disabled = true;

    await fetch(API + "/add-expense/", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
            month: today.getMonth() + 1,
            year: today.getFullYear(),
            text: titleInput.value,
            amount: amountInput.value,
            category: categoryInput.value,
            date: today.toISOString().split("T")[0]
        })
    });

    // reset
    titleInput.value = "";
    amountInput.value = "";

    if (successMsg) {
        successMsg.style.display = "block";
        setTimeout(() => successMsg.style.display = "none", 2000);
    }

    btn.innerText = "Add";
    btn.disabled = false;

    loadDashboard();
}

/* ================= ADD INCOME ================= */
async function addIncome() {

    const incomeInput = document.getElementById("incomeAmount");
    const income = incomeInput.value;

    if (!income) {
        alert("Enter income");
        return;
    }

    const today = new Date();

    await fetch(API + "/add-budget/", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
            month: today.getMonth() + 1,
            year: today.getFullYear(),
            income: income
        })
    });

    incomeInput.value = "";

    alert("Income updated");

    loadDashboard();
}

/* ================= CHARTS ================= */
function renderCharts(data, categories, currentMonth) {

    const barCanvas = document.getElementById("barChart");
    const pieCanvas = document.getElementById("pieChart");

    if (!barCanvas || !pieCanvas) return;

    // ONLY CURRENT MONTH BAR
    const income = data[currentMonth]?.income || 0;
    const expense = data[currentMonth]?.expense || 0;

    if (window.barChartInstance) window.barChartInstance.destroy();
    if (window.pieChartInstance) window.pieChartInstance.destroy();

    window.barChartInstance = new Chart(barCanvas, {
        type: "bar",
        data: {
            labels: ["This Month"],
            datasets: [
                { label: "Income", data: [income] },
                { label: "Expense", data: [expense] }
            ]
        }
    });

    window.pieChartInstance = new Chart(pieCanvas, {
        type: "pie",
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories)
            }]
        }
    });
}

/* ================= LOGOUT ================= */
function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("dashboard")) {
        loadDashboard();
    }
});