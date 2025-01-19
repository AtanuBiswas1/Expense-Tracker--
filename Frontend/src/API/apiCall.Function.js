import {
  signupUrl,
  loginUrl,
  logoutUrl,
  addExpenceUrl,
  addIncomeUrl,
  showExpensesUrl,
  showIncomeUrl
} from "../constant.API_URL.js";

async function signupFunction(userGivenDataForSignup, setResponceData) {
  try {
    let responce = await fetch(signupUrl, {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(userGivenDataForSignup),
      credentials: "include", // This ensures cookies are sent and stored
    });
    responce = await responce.json();
    setResponceData(responce);
  } catch (error) {
    console.log(error);
  }
}

async function loginFunction(userGivenDataForLogin, setLoginMessage) {
  try {
    const responce = await fetch(loginUrl, {
      method: "POST",
      credentials: "include", // Send cookies in cross-origin requests
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userGivenDataForLogin),
    });
    const responceAfterLogin = await responce.json();
    setLoginMessage(responceAfterLogin.message);
    //console.log(responceAfterLogin)
    if (responceAfterLogin.success) {

      localStorage.setItem(
        "afterLoginUserDataInLocalStore",
        JSON.stringify(responceAfterLogin)
      );
      console.log("success but not...")
    }
  } catch (error) {
    console.log("Login Error  ", error);
  }
}


async function ExpenceApiCall(date="",month="",year="") {
    const data={
        date,
        month,
        year
       
      }
      
      const params = new URLSearchParams(data);
      const newShowExpensesUrl=showExpensesUrl+`?${params.toString()}`
    try {
        const responce = await fetch(newShowExpensesUrl, {
            method: "GET",
            credentials: "include", // Send cookies in cross-origin requests
            headers: {
              "Content-Type": "application/json",
            },
          });
          const responceAfterLogin = await responce.json();
          //console.log("line no 72",responceAfterLogin);
          return responceAfterLogin
    } catch (error) {
        console.log("Login Error  ", error);
        return error
    }
}

async function IncomeApiCall(date="",month="",year="") {
  const data={
      date,
      month,
      year
    }
    
    const params = new URLSearchParams(data);
    const newShowIncomeUrl=showIncomeUrl+`?${params.toString()}`
  try {
      const responce = await fetch(newShowIncomeUrl, {
          method: "GET",
          credentials: "include", // Send cookies in cross-origin requests
          headers: {
            "Content-Type": "application/json",
          },
        });
        const responceAfterLogin = await responce.json();
        //console.log("line no 72",responceAfterLogin);
        return responceAfterLogin
  } catch (error) {
      console.log("Login Error  ", error);
      return error
  }
}













export { signupFunction, loginFunction,ExpenceApiCall,IncomeApiCall };
