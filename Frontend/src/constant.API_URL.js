const backendServer=import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
const signupUrl=backendServer+"/api/v1/users/register"
const loginUrl=backendServer+"/api/v1/users/login"
const logoutUrl=backendServer+"/api/v1/users/logout"
const addExpenceUrl=backendServer+"/api/v1/users/addUserExpence"
const addIncomeUrl=backendServer+"/api/v1/users/addUserIncome"
const showExpensesUrl=backendServer+"/api/v1/users/expence/show/api"
const showIncomeUrl=backendServer+"/api/v1/users/income/show/api"
const aiAnalyzeUrl=backendServer+"/api/v1/users/ai/analyze"

// Budget limits and Savings goals URL paths
const addBudgetLimitUrl=backendServer+"/api/v1/users/addBudgetLimit"
const showBudgetLimitsUrl=backendServer+"/api/v1/users/budgetLimits/show"
const addSavingsGoalUrl=backendServer+"/api/v1/users/addSavingsGoal"
const contributeSavingsGoalUrl=backendServer+"/api/v1/users/savingsGoal/contribute"
const showSavingsGoalsUrl=backendServer+"/api/v1/users/savingsGoals/show"
const deleteSavingsGoalUrl=backendServer+"/api/v1/users/savingsGoal/delete"

export  {
    signupUrl,
    loginUrl,
    logoutUrl,
    addExpenceUrl,
    addIncomeUrl,
    showExpensesUrl,
    showIncomeUrl,
    aiAnalyzeUrl,
    addBudgetLimitUrl,
    showBudgetLimitsUrl,
    addSavingsGoalUrl,
    contributeSavingsGoalUrl,
    showSavingsGoalsUrl,
    deleteSavingsGoalUrl
}


