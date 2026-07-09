# COAB Expense Tracker

A full-featured, visually rich Expense Tracker web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) that helps users track expenses, manage budgets, set savings goals, and visualize their financial data through interactive charts.

---

## 🚀 Advanced Enhancements & Key Features

We have upgraded the application with several premium design systems and backend/frontend sync optimizations:

### 🎙️ Real-Time Web Speech API Voice Input
- Native voice entry using browser-supported speech recognition (`window.SpeechRecognition` or `webkitSpeechRecognition`).
- Custom parsing engine: Identifies spoken numbers as the amount, pulls merchant names following prepositions like "at" or "from", and matches keywords to categories dynamically (e.g., "coffee at Starbucks" matches category `food`).

### ⚡ Client-Side Zero-Latency Query Cache
- Implemented a transparent cache (`apiCache`) in the API request client.
- Drastically reduces load times and avoids duplicate fetch triggers during tab switching.
- Auto-invalidates the cache on any state mutation (additions, modifications, deletions) using custom window events.

### 💀 Premium Skeleton Loaders
- Replaced basic spinners with detailed, pulsing placeholders mimicking charts, tables, calendar blocks, and statistics cards to give a modern, premium user experience.

### 📊 Standardized Category Alignment
- Aligned category IDs (`transport`, `housing`, `healthcare`, `other_exp`) across forms, budget limits progress indicators, and report visualizers to ensure seamless spend auditing.

### 💾 Local Offline Fallback
- Support for offline contributions and data additions with background local storage integration (`offline_expenses`, `offline_incomes`, `offline_goals`) when network errors occur.

---

## 🛠️ Technologies Used

- **Frontend**: React.js, Tailwind CSS, Date-fns, Lucide React, Chart.js, React-Hook-Form
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT cookies with security headers and config switches

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker
```

### 2. Configure Environment Variables

Create a `.env` file in the `Backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 3. Install Dependencies & Run

#### Backend Server
```bash
cd Backend
npm install
npm run dev
```

#### Frontend Client
```bash
cd Frontend
npm install
npm run dev
```

The application client runs on `http://localhost:5173` (Vite dev server) and links to the backend server.

---

## 🖼️ Screenshots

### Signup Page
![Signup Page](Screenshorts/signup.png)

### Login Page
![Login Page](Screenshorts/login.png)

### Add Income Panel
![Add Income](Screenshorts/AddIncome.png)

### Add Expenses Panel
![Add Expenses](Screenshorts/AddExpenses.png)
