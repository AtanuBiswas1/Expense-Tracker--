const backendServer="http://localhost:8000/api/v1/users"
const signupUrl=backendServer+"/register"
const loginUrl=backendServer+"/login"
const logoutUrl=backendServer+"/logout"
const addExpenceUrl=backendServer+"/addUserExpence"
const addIncomeUrl=backendServer+"/addUserIncome"
const showExpensesUrl=backendServer+"/expence/show/api"
const showIncomeUrl=backendServer+"/income/show/api"

export  {
    signupUrl,
    loginUrl,
    logoutUrl,
    addExpenceUrl,
    addIncomeUrl,
    showExpensesUrl,
    showIncomeUrl
}
