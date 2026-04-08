const API = "https://expense-tracker-app1.onrender.com";

/* ================= SAFE FETCH ================= */
async function safeFetch(url, options = {}) {
    try {
        const res = await fetch(url, options);

        if (!res.ok) {
            throw new Error("Server error");
        }

        const text = await res.text();

        try {
            return JSON.parse(text);
        } catch {
            throw new Error("Invalid JSON response");
        }

    } catch (err) {
        console.error("Fetch Error:", err);
        alert("Server is waking up or network issue. Try again in 10 seconds.");
        throw err;
    }
}

/* ================= AUTH CHECK ================= */
if (window.location.pathname.includes("dashboard.html")) {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "index.html";
    }
}

/* ================= HEADERS ================= */
function headers() {
    const token = localStorage.getItem("token");

    if (!token) {
        return { "Content-Type": "application/json" };
    }

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

    try {
        const data = await safeFetch(API + "/login/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (!data.access) {
            alert("Invalid login");
            return;
        }

        localStorage.setItem("token", data.access);
        window.location.href = "dashboard.html";

    } catch (err) {
        // handled already
    }
}

/* ================= CATEGORY DATA ================= */
async function loadCategoryData(month, year) {
    try {
        const data = await safeFetch(
            `${API}/category-analysis/?month=${month}&year=${year}`,
            { headers: headers() }
        );

        return Object.keys(data).length === 0 ? { "No Data": 1 } : data;

    } catch {
        return { "No Data": 1 };
    }
}

/* ================= LOAD DASHBOARD ================= */
async function loadDashboard() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "index.html";
        return;
    }

    let data;

    try {
        data = await safeFetch(API + "/dashboard/", {
            headers: headers()
        });
    } catch {
        return;
    }

    const today = new Date();
    const currentMonth = today.getMonth() + 1;

    let income = 0;
    let expense = 0;

    if (data[currentMonth]) {
        income = data[currentMonth].income;
        expense = data[currentMonth].expense;
    }

    document.getElementById("income").innerText = "₹" + income;
    document.getElementById("expense").innerText = "₹" + expense;
    document.getElementById("savings").innerText = "₹" + (income - expense);

    const container = document.getElementById("transactions");
    if (container) {
        container.innerHTML = "";

        if (data[currentMonth]) {
            const div = document.createElement("div");
            div.innerText = `This Month → Expense: ₹${expense}`;
            container.appendChild(div);
        }
    }

    const categories = await loadCategoryData(currentMonth, today.getFullYear());

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

    try {
        await safeFetch(API + "/add-expense/", {
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
    } catch {
        btn.innerText = "Add";
        btn.disabled = false;
        return;
    }

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

    try {
        await safeFetch(API + "/add-budget/", {
            method: "POST",
            headers: headers(),
            body: JSON.stringify({
                month: today.getMonth() + 1,
                year: today.getFullYear(),
                income: income
            })
        });
    } catch {
        return;
    }

    incomeInput.value = "";
    alert("Income updated");

    loadDashboard();
}

/* ================= CHARTS ================= */
function renderCharts(data, categories, currentMonth) {
    const barCanvas = document.getElementById("barChart");
    const pieCanvas = document.getElementById("pieChart");

    if (!barCanvas || !pieCanvas) return;

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
        setTimeout(loadDashboard, 2000); // handles Render cold start
    }
});
