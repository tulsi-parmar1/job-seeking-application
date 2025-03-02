import React, { useEffect } from "react";
import style from "../../module/Admin.module.css";
import { useLocation, NavLink } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { IoAddOutline } from "react-icons/io5";
import { userAction } from "../../Slices/userSlice";
function DashboardSidebar() {
  const location = useLocation();
  const { users } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { profilee } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/profile/getProfile`,
          { withCredentials: true }
        );
        dispatch(userAction.setProfile(data.url));
      } catch (error) {
        console.log(error);
      }
    };
    getProfile();
    const getAdmin = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/admin/getAdmin`,
          { withCredentials: true }
        );

        dispatch(userAction.setUser(data.admin[0]));
      } catch (error) {
        console.log(error);
      }
    };
    getAdmin();
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
      navigate("/");
    } catch (err) {
      console.log(err);
      dispatch(userAction.setIsAuthorized(true));
    }
  };
  return (
    <div
      style={{
        padding: "10px",
      }}
    >
      <div className={style.sidebar}>
        <div className={style.profile}>
          <img src={profilee} alt="Profile" />

          <label htmlFor="file-input" className={style.addProfile}>
            <IoAddOutline />
          </label>
          <div
            style={{
              position: "absolute",
              top: "180px",
              left: "20px",
            }}
            className={style.admininfo}
          >
            <p style={{ textAlign: "center" }}>{users.name}</p>
            <p>
              <a href={`mailto:${users.email}`} style={{ color: "teal" }}>
                {" "}
                {users.email}
              </a>
            </p>
          </div>
        </div>

        <div className={style.sidebarlinks}>
          <NavLink
            to="/admin/dashboard"
            className={
              location.pathname === "/admin/dashboard" ? style.active : ""
            }
          >
            Dashboard
          </NavLink>
          <br />
          <NavLink
            to="/admin/dashboard/userManagement"
            className={
              location.pathname.includes("/admin/dashboard/userManagement")
                ? style.active
                : ""
            }
          >
            user Management
          </NavLink>
          <br />

          <NavLink
            to="/admin/dashboard/jobManagement"
            className={
              location.pathname.includes("/admin/dashboard/jobManagement")
                ? style.active
                : ""
            }
          >
            job management
          </NavLink>

          <button onClick={handleLogout} className={style.logoutbtn}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardSidebar;
