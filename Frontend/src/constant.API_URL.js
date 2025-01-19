const backendServer=import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
const signupUrl=backendServer+"/api/v1/users/register"
const loginUrl=backendServer+"/api/v1/users/login"
const logoutUrl=backendServer+"/api/v1/users/logout"
const addExpenceUrl=backendServer+"/api/v1/users/addUserExpence"
const addIncomeUrl=backendServer+"/api/v1/users/addUserIncome"
const showExpensesUrl=backendServer+"/api/v1/users/expence/show/api"
const showIncomeUrl=backendServer+"/api/v1/users/income/show/api"

export  {
    signupUrl,
    loginUrl,
    logoutUrl,
    addExpenceUrl,
    addIncomeUrl,
    showExpensesUrl,
    showIncomeUrl
}

