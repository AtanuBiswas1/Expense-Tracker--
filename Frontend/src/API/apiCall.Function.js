import {
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
    console.log("responceAfterLogin   ====>", responceAfterLogin);

    if (responceAfterLogin.success) {
      const accessToken = responceAfterLogin.data.accessToken;
      console.log("accessToken", accessToken);
      // Set cookie for 24 hours
      const expiryDate = new Date();
      expiryDate.setTime(expiryDate.getTime() + 24 * 60 * 60 * 1000); // 24 hours in milliseconds

      //document.cookie = `accessToken=${accessToken}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
      //document.cookie = `accessToken=${accessToken}; expires=${expiryDate.toUTCString()}; path=/`;
      document.cookie = `accessToken=${accessToken}; expires=${expiryDate.toUTCString()}; path=/; Secure; SameSite=Strict`;

      localStorage.setItem(
        "afterLoginUserDataInLocalStore",
        JSON.stringify(responceAfterLogin)
      );
    }
  } catch (error) {
    console.log("Login Error  ", error);
  }
}

async function ExpenceApiCall(date = "", month = "", year = "") {
  const data = {
    date,
    month,
    year,
  };

  const getCookie = (name) => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1];
  };

  const token = getCookie("accessToken"); // Get only accessToken


  const params = new URLSearchParams(data);
  const newShowExpensesUrl = showExpensesUrl + `?${params.toString()}`;
  try {
    const responce = await fetch(newShowExpensesUrl, {
      method: "GET",
      credentials: "include", // Send cookies in cross-origin requests
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const responceAfterLogin = await responce.json();
    //console.log("line no 72",responceAfterLogin);
    return responceAfterLogin;
  } catch (error) {
    console.log("Login Error  ", error);
    return error;
  }
}

async function IncomeApiCall(date = "", month = "", year = "") {
  const data = {
    date,
    month,
    year,
  };

  const getCookie = (name) => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1];
  };

  const token = getCookie("accessToken"); // Get only accessToken


  const params = new URLSearchParams(data);
  const newShowIncomeUrl = showIncomeUrl + `?${params.toString()}`;
  try {
    const responce = await fetch(newShowIncomeUrl, {
      method: "GET",
      credentials: "include", // Send cookies in cross-origin requests
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const responceAfterLogin = await responce.json();
    //console.log("line no 72",responceAfterLogin);
    return responceAfterLogin;
  } catch (error) {
    console.log("Login Error  ", error);
    return error;
  }
}

async function aiAnalyzeApiCall(question = "") {
  const getCookie = (name) => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1];
  };

  const token = getCookie("accessToken");

  try {
    const response = await fetch(aiAnalyzeUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ question }),
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("AI API Error:", error);
    return error;
  }
}

async function addBudgetLimitApiCall(category, limit) {
  const getCookie = (name) => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1];
  };
  const token = getCookie("accessToken");
  try {
    const response = await fetch(addBudgetLimitUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ category, limit }),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    return error;
  }
}

async function fetchBudgetLimitsApiCall() {
  const getCookie = (name) => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1];
  };
  const token = getCookie("accessToken");
  try {
    const response = await fetch(showBudgetLimitsUrl, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    return error;
  }
}

async function addSavingsGoalApiCall(title, targetAmount, currentAmount, category, targetDate) {
  const getCookie = (name) => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1];
  };
  const token = getCookie("accessToken");
  try {
    const response = await fetch(addSavingsGoalUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, targetAmount, currentAmount, category, targetDate }),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    return error;
  }
}

async function contributeSavingsGoalApiCall(goalId, amount) {
  const getCookie = (name) => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1];
  };
  const token = getCookie("accessToken");
  try {
    const response = await fetch(contributeSavingsGoalUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ goalId, amount }),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    return error;
  }
}

async function fetchSavingsGoalsApiCall() {
  const getCookie = (name) => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1];
  };
  const token = getCookie("accessToken");
  try {
    const response = await fetch(showSavingsGoalsUrl, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    return error;
  }
}

async function deleteSavingsGoalApiCall(goalId) {
  const getCookie = (name) => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1];
  };
  const token = getCookie("accessToken");
  try {
    const response = await fetch(deleteSavingsGoalUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ goalId }),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    return error;
  }
}

export { 
  signupFunction, 
  loginFunction, 
  ExpenceApiCall, 
  IncomeApiCall, 
  aiAnalyzeApiCall,
  addBudgetLimitApiCall,
  fetchBudgetLimitsApiCall,
  addSavingsGoalApiCall,
  contributeSavingsGoalApiCall,
  fetchSavingsGoalsApiCall,
  deleteSavingsGoalApiCall
};
