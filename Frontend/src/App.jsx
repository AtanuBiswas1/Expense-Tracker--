import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import {  useDispatch } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./features/loginuser/loginUser.Slice.js"; //setUserData,

function App() {
  const dispatch = useDispatch();
  dispatch(checkAuth());
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default App;
