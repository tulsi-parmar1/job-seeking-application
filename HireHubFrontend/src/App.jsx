import { Outlet, useNavigate } from "react-router-dom";
import "./App2.css";
import NavBar from "./Components/Layout/Navbar";
import Footer from "./Components/Layout/Footer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { userAction } from "./Slices/userSlice";
import { useLocation } from "react-router-dom";
import Auth from "./Components/Auth/Auth";
function App() {
  const dispatch = useDispatch();
  const { isVarified } = useSelector((state) => state.user);
  const role = localStorage.getItem("role") === "admin";
  const { isAuthorized } = useSelector((state) => state.user);
  const { users } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(
    () => {
      const fetchUser = async () => {
        try {
          const response = await axios.get(
            "http://localhost:4000/api/user/getUser",
            { withCredentials: true }
          );
          // localStorage.setItem("role", response.data.user.role);
          console.log(response.data.user);
          if (
            response.data.user.isAuthorized &&
            response.data.user.isVerified
          ) {
            dispatch(userAction.setIsVerified(true));
            localStorage.setItem("isAuthorized", true);

            dispatch(userAction.setIsAuthorized(true));
            dispatch(userAction.setUser(response.data.user));
          } else {
            dispatch(userAction.setIsVerified(false));
            // localStorage.setItem("isAuthorized", false);
            dispatch(userAction.setIsAuthorized(false));
            // dispatch(userAction.setUser(""));
          }
        } catch (err) {
          console.error("Error fetching user:", err); // Handle error
          dispatch(userAction.setIsAuthorized(false));
          localStorage.setItem("isAuthorized", false);
        }
      };

      fetchUser();
      if (role) {
        navigate("/admin/dashboard");
      }
    },
    [dispatch],
    []
  );

  useEffect(() => {
    if (isAuthorized && isVarified) {
      navigate("/");
    }
  }, [isAuthorized, isVarified, navigate]);

  const hideNavbarFooter =
    location.pathname.startsWith("/reset-password") ||
    location.pathname.startsWith("/admin");
  console.log(location.pathname);
  return (
    <>
      <Auth></Auth>
      {!hideNavbarFooter && <NavBar />}
      <Outlet></Outlet>
      {!hideNavbarFooter && <Footer />}
    </>
  );
}
export default App;
