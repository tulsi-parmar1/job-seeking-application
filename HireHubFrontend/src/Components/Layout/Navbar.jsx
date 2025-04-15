import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { VscAccount } from "react-icons/vsc";
import { NavLink, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { TfiMenu } from "react-icons/tfi";
import { userAction } from "../../Slices/userSlice";
import { toast } from "react-toastify";

import style from "../../module/Navbar.module.css";
import { useEffect } from "react";
function NavBar() {
  const [scrolling, setScrolling] = useState(false);
  const [displayProfile, setDisplayProfile] = useState(null);
  const [show, setShow] = useState(false);
  // const { isAuthorized } = useSelector((state) => state.user);
  const role = localStorage.getItem("role") === "admin";
  const isAuthorized = localStorage.getItem("isAuthorized") === "true";
  const { users } = useSelector((state) => state.user);
  console.log(users.role);
  const { profilee } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(users);
  // useEffect(() => {
  //   const handleScroll = () => {

  //     if (window.scrollY > 0) {
  //       setScrolling(true);
  //     } else {
  //       setScrolling(false);
  //     }
  //   };

  // }, []);

  useEffect(() => {
    if (role === "admin") {
      navigate("/admin/");
    }
    const fetchUserDataAndProfile = async () => {
      try {
        const profileResponse = await axios.get(
          `http://localhost:4000/api/profile/getProfile`,
          { withCredentials: true }
        );

        setDisplayProfile(profileResponse.data.url);
        dispatch(userAction.setProfile(profileResponse.data.url));
        console.log("profileeee", profileResponse.data.url);
      } catch (err) {
        console.error("Error fetching data:", err);
        console.log(err);
        dispatch(userAction.setIsAuthorized(false));
      }
    };

    fetchUserDataAndProfile();

    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/user/logout",
        { withCredentials: true }
      );
      dispatch(userAction.setIsAuthorized(false));
      dispatch(userAction.setUser(""));
      dispatch(userAction.setProfile(""));

      toast.success("logged out successfully");

      localStorage.setItem("isAuthorized", false);
      localStorage.setItem("role", "");
      localStorage.setItem("email", "");
      localStorage.setItem("userEmail", "");
      dispatch(userAction.setEmail(""));
      navigate("/");
    } catch (err) {
      console.log(response.data);
      dispatch(userAction.setIsAuthorized(true));
    }
  };
  const handleOnClick = () => {
    setShow(!show);
  };
  const handlepostjob = () => {
    navigate("/job/post");
  };
  return (
    <>
      <nav className={`${style.navbar} ${scrolling ? style.onscroll : ""}`}>
        <div className={style.logo}>
          {/* <img src="1-removebg-preview.png" alt="LOGO" /> */}
          <h1>
            <span style={{ color: "teal" }}>HIRE</span>
            <span style={{ fontFamily: "cursive" }}>hub</span>
          </h1>
        </div>
        <div className={style.menu}>
          {show ? (
            <IoClose className={style.icon1} onClick={handleOnClick}></IoClose>
          ) : (
            <TfiMenu className={style.icon2} onClick={handleOnClick}></TfiMenu>
          )}
          <ul
            className={`${style.menuitems} ${show && style.menuopen}`}
            onClick={() => setShow(false)}
          >
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? style.active : "")}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/job/getall"
                className={({ isActive }) => (isActive ? style.active : "")}
              >
                jobs
              </NavLink>
            </li>

            <li className={style.profilecontainer}>
              <NavLink
                to="/profile"
                className={({ isActive }) => (isActive ? style.active : "")}
              >
                {profilee ? (
                  <img src={`${profilee}`} alt="profilePic" />
                ) : (
                  <VscAccount style={{ marginTop: "10px", fontSize: "26px" }} />
                )}
              </NavLink>
            </li>
            <div className={style.btns}>
              <button onClick={handlepostjob} className={style.postjob}>
                Post Job
              </button>
              {isAuthorized && (
                <button onClick={handleLogout} className={style.logoutbtn}>
                  Logout
                </button>
              )}
              {!isAuthorized && (
                <button
                  onClick={() => navigate("/login")}
                  className={style.logoutbtn}
                >
                  Login
                </button>
              )}
            </div>
          </ul>
        </div>
      </nav>
    </>
  );
}
export default NavBar;
