import React from "react";
import style from "../../module/Footer.module.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Footer() {
  const { isAuthorized } = useSelector((state) => state.user);
  return (
    <div
      style={{ position: "sticky", bottom: "0px" }}
      className={`${!isAuthorized && style.footerHide}`}
    >
      <footer>
        <div className={style["footer-container"]}>
          <div className={style["footer-section"]}>
            <h3>HireHub</h3>
            <p>Your go-to platform for job opportunities.</p>
          </div>

          <div className={style["footer-section"]}>
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/job/getall">Jobs</Link>
              </li>
              <li>
                <Link to="job/post">Post Job</Link>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/logout">Log out</Link>
              </li>
            </ul>
          </div>

          <div className={style["footer-section"]}>
            <h4>Contact Us</h4>
            <p>
              Email:{" "}
              <a
                style={{ fontSize: "15px" }}
                href="mailto:hirehub.verify@gmail.com"
              >
                hirehub.verify@gmail.com
              </a>
            </p>
          </div>
        </div>
        <p className={style["footer-bottom"]}>
          copyright &copy; 2025 HireHub. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Footer;
