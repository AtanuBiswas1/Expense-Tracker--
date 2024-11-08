# Expense Tracker

A full-featured Expense Tracker web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) that helps users track expenses, set budgets, and visualize their financial data through interactive charts. 

## Features

- **Expense Tracking**: Users can add, edit, and delete expenses.
- **Budget Management**: Set monthly or yearly budgets and get notified when nearing limits.
- **Data Visualization**: Charts and graphs powered by Chart.js provide a clear overview of spending habits.
- **Multiple API Integration**: Interacts with various backend APIs to provide real-time financial data.
- **Authentication**: User registration and login with JWT-based authentication.

## Future Enhancements

- **Gemini API Integration**: Plan to integrate the Gemini API for additional data analysis and more personalized financial insights.
- **Export to CSV/Excel**: Enable users to export their expense data to a CSV or Excel file for offline access.
- **Recurring Expenses**: Set and manage recurring expenses like monthly bills.

## Technologies Used

- **Frontend**: React.js, HTML, CSS, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Data Visualization**: Chart.js
- **API**: Multiple custom APIs, Gemini API (future integration)
- **Authentication**: JWT for secure user authentication
- **Version Control**: Git and GitHub for managing the project

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/expense-tracker.git

2. Navigate into the project directory:
   ```bash
   cd expense-tracker
3. Install the dependencies for both the frontend and backend:
   ```bash
   # Install frontend dependencies
   
    cd client
    npm install

   # Install backend dependencies
    cd ../server
    npm install
4. Create a .env file in the server directory with the following variables:
   MONGODB_URI=your-mongodb-uri
   JWT_SECRET=your-secret-key

5. Run the application:
   ```bash
   # Run backend server
   cd server
   npm start

   # Run frontend client in a new terminal
   cd client
   npm start
   
6. The app should be running on http://localhost:3000 for the frontend and http://localhost:5000 for the backend.


