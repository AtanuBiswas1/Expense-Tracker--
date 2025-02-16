import { createSlice } from "@reduxjs/toolkit";

// Initial value of user and login
const initialState = {
  isAuthenticated: false,
  userData: null,
  accessToken: null,
 
};

// authSlice ---> redux slice define for login user
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.userData = null;
      document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Strict";
      localStorage.removeItem("afterLoginUserDataInLocalStore"); // Remove from local storage on logout
    },
    
    checkAuth: (state) => {
      function getCookieObject() {
        const cookieString = document.cookie;
        console.log("loginUser.slice.js--->cookieString: ",cookieString)
        const cookieArray = cookieString.split("; ");
        const cookieObject = {};

        cookieArray.forEach((cookie) => {
          const [key, value] = cookie.split("=");
          cookieObject[key] = value;
        });
        console.log("loginUser.slice.js--->cookieObject: ",cookieObject)
        return cookieObject;
      }
      const checkTokenExpire = getCookieObject();
      if (!checkTokenExpire.accessToken && checkTokenExpire.accessToken) {
        localStorage.removeItem("afterLoginUserDataInLocalStore");
      }
      const storedUser = localStorage.getItem("afterLoginUserDataInLocalStore");
      
      console.log("loginUser.slice.js--->storedUser: ",storedUser)
      if (storedUser ) {
        state.isAuthenticated = true;
        state.userData = JSON.parse(storedUser);
        state.accessToken = checkTokenExpire.accessToken;
      } else {
        state.isAuthenticated = false;
      }
    },
  },
});

export const { logout, checkAuth } = authSlice.actions;
export default authSlice.reducer;
//
