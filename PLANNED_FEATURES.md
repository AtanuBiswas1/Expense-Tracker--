# Planned Features & Task Checklist: Advanced Expense Tracker

This document tracks the feature backlog and step-by-step implementation tasks to upgrade this Expense Tracker into a premium, resume-grade portfolio project.

---

## 🎯 Feature 1: Savings Goals Tracker
Let users set target savings goals (e.g., *"Emergency Fund"*, *"New Laptop"*) and track their progress over time. Aura AI will calculate their average monthly savings rate and predict exactly how long it will take to hit each goal.

### Backend Tasks
- [ ] Create `Goal` mongoose schema (`Backend/src/model/goal.model.js`)
  - Fields: `user` (ref), `title` (String), `targetAmount` (Number), `currentAmount` (Number), `targetDate` (Date), `status` (String: active/completed)
- [ ] Create `goal.controller.js` to manage CRUD operations for savings goals
- [ ] Register secure routes in `user.router.js`:
  - `POST /api/v1/users/goals/add`
  - `GET /api/v1/users/goals/show`
  - `PATCH /api/v1/users/goals/update/:id`
  - `DELETE /api/v1/users/goals/delete/:id`
- [ ] Update `ai.controller.js` to parse current goals and append predictions (months to target) based on average monthly savings rates.

### Frontend Tasks
- [ ] Create `GoalCard.jsx` and `GoalList.jsx` components with clean progress bars and target completion dates
- [ ] Integrate savings goals UI into the Dashboard layout
- [ ] Connect goals form and API calls (`addGoal`, `updateGoal`, `deleteGoal` in `apiCall.Function.js`)

---

## ⚠️ Feature 2: Category Budget Limits & Alerts
Allow users to set spending budget caps for specific categories. Provide real-time UI colors (Green ➡️ Yellow ➡️ Red) and trigger alert toasts if their spending approaches or exceeds the caps.

### Backend Tasks
- [ ] Create `BudgetLimit` mongoose schema (`Backend/src/model/budgetLimit.model.js`)
  - Fields: `user` (ref), `category` (String), `limitAmount` (Number), `month` (Number), `year` (Number)
- [ ] Create `budgetLimit.controller.js` to handle setting and retrieving category limits
- [ ] Register routes in `user.router.js`:
  - `POST /api/v1/users/budget-limits/set`
  - `GET /api/v1/users/budget-limits/show`
- [ ] Update Expense logging controller to cross-reference category limit and append a budget alarm flag to the response if the limit is exceeded.

### Frontend Tasks
- [ ] Create Category Budget progress bar cards on the dashboard
- [ ] Integrate limits into the Expense adding forms (validation warning if the new expense pushes them over budget)
- [ ] Trigger warning toasts from our custom Toast system when limits are crossed

---

## 🗓️ Feature 3: Recurring Payments & Subscription Manager
Track active subscriptions (e.g. Netflix, Gym, utilities) and alert users of upcoming billing dates.

### Backend Tasks
- [ ] Create `Subscription` mongoose schema (`Backend/src/model/subscription.model.js`)
  - Fields: `user` (ref), `title` (String), `amount` (Number), `category` (String), `billingCycle` (daily/weekly/monthly/yearly), `nextBillingDate` (Date), `status` (active/paused)
- [ ] Create `subscription.controller.js` for CRUD and auto-logging active subscriptions as expenses
- [ ] Register routes in `user.router.js`:
  - `POST /api/v1/users/subscriptions/add`
  - `GET /api/v1/users/subscriptions/show`
- [ ] Implement a function to automatically log a transaction when a user clicks "Mark as Paid" or when the billing cycle triggers.

### Frontend Tasks
- [ ] Create an "Upcoming Bills & Subscriptions" dashboard panel
- [ ] Build a Subscription manager interface (form to add, pause, or delete subscriptions)
- [ ] Build a "Mark as Paid" quick-action button on upcoming bills

## 📤 Feature 4: Financial Statement Export (CSV, Excel & PDF)
Add buttons to let users download a clean spreadsheet or pre-formatted PDF statement of their transaction lists.

### Frontend Tasks
- [ ] Add "Export CSV", "Export Excel", and "Export PDF" buttons to transaction table controls
- [ ] Implement Excel XML formatting to download data as a fully styled `.xlsx` file
- [ ] Implement a clean print stylesheet (`@media print` styling rules) so that clicking "Export PDF" prompts the browser's standard Print dialog, pre-formatted as a premium, margins-aligned invoice/statement report.

---

## 🔔 Feature 5: Email & SMS/WhatsApp Alerts
Alert the user immediately via email or text message when a category budget limit is exceeded.

### Backend Tasks
- [ ] Integrate `nodemailer` using an SMTP transport to send automated alert emails
- [ ] Add a Twilio API integration to dispatch SMS or WhatsApp notifications
- [ ] Create an alert dispatcher helper: when a logged transaction pushes category expenditure past its limit, trigger the email/SMS alert in the background.

---

## 🎨 Feature 6: Glowing Neon Charts (Premium Chart.js Redesign)
Make the dashboard graphs look extremely high-end and attractive with polished visuals.

### Frontend Tasks
- [ ] Inject canvas linear gradient overlays (e.g., gradient fill from glowing teal to transparent for Income, and rose to transparent for Expenses)
- [ ] Configure curved lines (`tension: 0.45` and `cubicInterpolationMode: 'monotone'`)
- [ ] Set rounded corners on bar elements (`borderRadius: 8` and `borderSkipped: false`)
- [ ] Standardize background grid lines (use thin, dashed, low-opacity slate borders `rgba(148, 163, 184, 0.06)`)

---

## 💎 Feature 7: Aura Glassmorphism Theme Upgrades
Refine the application's overall stylesheet and color scheme to look premium and sleek.

### Frontend Tasks
- [ ] Inject floating glowing radial gradients into the background grid of [Dashbord.jsx](file:///d:/Atanu/Expense-Tracker--/Frontend/src/pages/Dashbord.jsx)
- [ ] Standardize the glassmorphic styling system using backdrop filters (`bg-slate-900/45 backdrop-blur-2xl border border-slate-800/80 shadow-2xl`)
- [ ] Customize scrollbars to be thin and match the dark theme (`scrollbar-thin scrollbar-thumb-slate-800/80 scrollbar-track-transparent`)

---

## 💳 Feature 8: Stripe Payment Gateway (Premium Subscription Upgrade)
Introduce a mock/real premium payment flow. Users can upgrade to "Aura Pro" to unlock the AI Advisor, Excel exports, and recurring transaction tracking.

### Payment Concept & Flow
1. **Purchase Intent**: The user clicks a "Go Pro" upgrade button on the navigation bar.
2. **Checkout Session**: The frontend requests a session from the backend (`POST /api/v1/payments/create-checkout-session`).
3. **Stripe Redirect**: The backend calls the Stripe API, generates a secure hosting URL, and the frontend redirects the user there.
4. **Completion & Webhooks**: The user inputs payment credentials. Upon success, Stripe redirects back to `/dashbord?success=true` and fires a webhook POST request to the backend. The backend updates the user's role status to `isPremium: true` in MongoDB.

### Backend Tasks
- [ ] Configure `stripe` library in backend dependencies
- [ ] Create `payment.controller.js` to initialize checkout sessions and handle Stripe Webhook events
- [ ] Add `isPremium` flag (Boolean) to the `User` schema
- [ ] Register secure payment endpoints in `user.router.js`

### Frontend Tasks
- [ ] Add "Upgrade to Pro" badge in the navigation bar header
- [ ] Integrate redirect functions and display success/cancel notifications
