import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import {  useDispatch} from "react-redux";
import { checkAuth } from "./features/loginuser/loginUser.Slice.js"; //setUserData,
import { ToastProvider } from "./context/ToastContext";



function App() {
  const dispatch = useDispatch();
  dispatch(checkAuth());
  
  return (
    <ToastProvider>
      <Header />
      <Outlet />
    </ToastProvider>
  );
}

export default App;
