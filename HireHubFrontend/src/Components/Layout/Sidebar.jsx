import { useLocation, NavLink } from "react-router-dom";
import style from "../../module/Profile.module.css";
import { useSelector } from "react-redux";

function Sidebar() {
  const location = useLocation();
  const { users } = useSelector((state) => state.user);
  return (
    <div className={style.sidebarlinks}>
      <NavLink
        to="/profile"
        className={location.pathname === "/profile" ? style.active : ""}
        end
      >
        Profile
      </NavLink>
      <br />
      <NavLink
        to="/profile/savedjobs"
        className={
          location.pathname === "/profile/savedjobs" ? style.active : ""
        }
      >
        Saved Jobs
      </NavLink>
      <br />

      <NavLink
        to="/profile/job/me"
        className={
          location.pathname.includes("/profile/job/me") ? style.active : ""
        }
      >
        My Jobs
      </NavLink>
      <br />
      {users.role !== "recruiter" && (
        <NavLink
          to="/profile/application/me"
          className={
            location.pathname.includes("/profile/application/me")
              ? style.active
              : ""
          }
        >
          My Application
        </NavLink>
      )}
    </div>
  );
}

export default Sidebar;
