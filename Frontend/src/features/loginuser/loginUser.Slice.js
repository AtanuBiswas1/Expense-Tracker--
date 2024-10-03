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
      // when do logout then  work this
      state.isAuthenticated = false;
      state.userData = null;
      localStorage.removeItem("afterLoginUserDataInLocalStore"); // Remove from local storage on logout
    },
    // setUserData:(state,action)=>{
    //     state.isAuthenticated=true;
    //     state.userData=action.payload;
    // },
    checkAuth: (state) => {
      function getCookieObject() {
        const cookieString = document.cookie;
        const cookieArray = cookieString.split("; ");
        const cookieObject = {};

        cookieArray.forEach((cookie) => {
          const [key, value] = cookie.split("=");
          cookieObject[key] = value;
        });
        return cookieObject;
      }
      const checkTokenExpire = getCookieObject();
      if (!checkTokenExpire.accessToken) {
        localStorage.removeItem("afterLoginUserDataInLocalStore");
      }
      const storedUser = localStorage.getItem("afterLoginUserDataInLocalStore");

      if (storedUser && checkTokenExpire.accessToken) {
        state.isAuthenticated = true;
        state.userData = JSON.parse(storedUser);
        state.accessToken = checkTokenExpire.accessToken;
      } else {
        state.isAuthenticated = false;
      }
    },
  },
});

export const { logout, setUserData, checkAuth } = authSlice.actions;
export default authSlice.reducer;
//
