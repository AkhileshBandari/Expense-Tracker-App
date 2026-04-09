# 💎 SpendWise – Smart Expense & Budget Analytics System

SpendWise is a full-stack financial tracking application that enables users to manage monthly income, track categorized expenses, and visualize spending patterns through real-time analytics dashboards.

---

## 🚀 Features

* 🔐 **Secure Authentication** (JWT-based login & registration)
* 👤 **User-Specific Data Isolation**
* 💰 **Monthly Income Management**
* 🧾 **Expense Tracking with Categories**
* 📊 **Real-Time Analytics Dashboard**
* 📈 **Bar & Pie Chart Visualizations**
* 🧠 **Category-wise Spending Insights**
* ⚡ **Instant Savings Calculation**

---

## 🧠 Core Concept

SpendWise is built around two pillars:

1. **Financial Tracking Engine**
   Users define monthly income and log expenses with categories to monitor financial activity.

2. **Analytics & Insights Layer**
   The system aggregates data to provide visual insights (monthly + category-wise) for smarter decision-making.

---

## 🏗️ Architecture

### 🔹 High-Level Architecture

```
Frontend (HTML, CSS, JS)
        ↓
REST API (Django + DRF)
        ↓
Database (SQLite / PostgreSQL)
```

---

### 🔹 Detailed Flow

1. User logs in → JWT token generated
2. Token stored in browser (localStorage)
3. Frontend sends authenticated API requests
4. Backend validates token
5. Data fetched per user (secure isolation)
6. Aggregation performed (monthly + category)
7. Results returned → charts rendered

---

### 🔹 Backend Components

* **Django REST Framework**
* JWT Authentication
* Models:

  * `MonthlyBudget`
  * `Expense`
* APIs:

  * `/login/`
  * `/register/`
  * `/add-budget/`
  * `/add-expense/`
  * `/dashboard/`
  * `/category-analysis/`

---

### 🔹 Frontend Components

* Login & Register Pages
* Dashboard UI (Glassmorphism Design)
* Charts (Chart.js)
* Token-based API communication

---

## 🛠️ Tech Stack

### 🔹 Frontend

* HTML5
* CSS3 (Glassmorphism UI)
* JavaScript (Vanilla)
* Chart.js

### 🔹 Backend

* Django
* Django REST Framework
* JWT Authentication

### 🔹 Database

* SQLite (Development)
* PostgreSQL (Production-ready)

### 🔹 Deployment

* Backend: Render
* Frontend: Netlify

---

## ⚙️ Installation & Setup

### 🔹 Backend

```bash
git clone https://github.com/yourusername/spendwise.git
cd backend

python -m venv venv
venv\Scripts\activate   # Windows

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

---

### 🔹 Frontend

1. Open `login.html`
2. Update API URL in `index.js`:

```js
const API = "http://127.0.0.1:8000";
```

3. Run using Live Server or browser

---

## 🔐 Authentication Flow

```
Login → JWT Token → Stored in localStorage → Sent in Headers → Verified by Backend
```

---

## 📊 Example API Response

### Dashboard

```json
{
  "3": {
    "income": 50000,
    "expense": 12000,
    "savings": 38000
  }
}
```

---

### Category Analysis

```json
{
  "food": 3000,
  "travel": 2000,
  "shopping": 7000
}
```

---

## 🚀 Future Enhancements

* 📅 Monthly Selector (multi-month view)
* ✏️ Edit / Delete Expenses
* 🔔 Budget Alerts (overspending)
* 🔄 Recurring Income & Expenses
* ☁️ Cloud Database (PostgreSQL)
* 📱 Mobile Responsive UI

---

## 🧠 Key Highlights

* Clean separation of frontend & backend
* Secure API-based architecture
* Real-time financial analytics
* Scalable structure for production

---

## 📌 Project Name

**SpendWise – Spend Smart. Live Better.**

---

## 👨‍💻 Author

Akhilesh
Full Stack Developer

---

## ⭐ If you like this project

Give it a ⭐ on GitHub and share feedback!
