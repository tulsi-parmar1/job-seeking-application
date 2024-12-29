import { Outlet } from "react-router-dom";
import "./App2.css";
import NavBar from "./Components/Layout/Navbar";
import Footer from "./Components/Layout/Footer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { userAction } from "./Slices/userSlice";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/user/getUser",
          { withCredentials: true }
        );
        dispatch(userAction.setUser(response.data.user));
        dispatch(userAction.setIsAuthorized(true));
        console.log(response.data.user);
      } catch (err) {
        console.error("Error fetching user:", err); // Handle error
        dispatch(userAction.setIsAuthorized(false));
      }
    };
    //   const getProfile = async () => {
    //     try {
    //         const { data } = await axios.get('http://localhost:4000/api/profile/getProfile', { withCredentials: true });
    //         dispatch(userAction.setProfile(data.url));
    //     } catch (error) {
    //         console.log(error)
    //         toast.error(error.response.data.message);
    //     }
    // }
    fetchUser();
    // getProfile();
  }, []);
  return (
    <>
      <NavBar></NavBar>
      <Outlet></Outlet>
      <Footer></Footer>
    </>
  );
}
export default App;
