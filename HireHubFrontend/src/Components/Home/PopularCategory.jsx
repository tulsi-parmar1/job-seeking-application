import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaLaptopCode } from "react-icons/fa";
import { IoBookSharp } from "react-icons/io5";
import { MdCastForEducation, MdManageAccounts } from "react-icons/md";
import { TbRibbonHealth } from "react-icons/tb";
import style from "../../module/PopularCategories.module.css";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
gsap.registerPlugin(ScrollTrigger);

function PopularCategory() {
  const [itl, setItl] = useState("");
  const [edl, setEdl] = useState("");
  const [acl, setAcl] = useState("");
  const [healthcarel, setHealthcarel] = useState("");
  const [hrl, setHrl] = useState("");
  const [csl, setCsl] = useState("");

  const containerRef = useRef();
  const navigate = useNavigate();
  const textRef = useRef();
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/job/countCategories", {
        withCredentials: true,
      })
      .then((res) => {
        setItl(res.data.itjobslength);
        setEdl(res.data.educationlength);
        setAcl(res.data.aclength);
        setHealthcarel(res.data.healthcarelength);
        setHrl(res.data.hrlength);
        setCsl(res.data.cslength);
      })
      .catch((error) => {
        console.error("Error fetching job counts by category:", error);
      });
  }, []);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current.children,
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  return (
    <div className={style.maincont} ref={textRef}>
      <h1 style={{ textAlign: "center", marginTop: "50px" }}>
        Discover the Most Popular Categories
      </h1>
      <div className={style.container} ref={containerRef}>
        <div
          className={style.categories}
          onClick={() => {
            navigate(`category/jobs/${"information technology"}`);
          }}
        >
          <div style={{ fontSize: "60px" }}>
            <FaLaptopCode />
          </div>
          <div style={{ marginLeft: "12px" }}>
            <h3>Information technology</h3>
            <p style={{ fontSize: "16px", color: "rgb(97, 94, 94)" }}>
              {itl} open positions
            </p>
          </div>
        </div>
        <div
          className={style.categories}
          onClick={() => {
            navigate(`category/jobs/${"education"}`);
          }}
        >
          <div style={{ fontSize: "60px" }}>
            <IoBookSharp />
          </div>
          <div>
            <h3>Education</h3>
            <p style={{ fontSize: "16px", color: "rgb(97, 94, 94)" }}>
              {edl} open positions
            </p>
          </div>
        </div>
        <div
          className={style.categories}
          onClick={() => {
            navigate(`category/jobs/${"account"}`);
          }}
        >
          <div style={{ fontSize: "60px" }}>
            <MdCastForEducation />
          </div>
          <div>
            <h3>Account</h3>
            <p style={{ fontSize: "16px", color: "rgb(97, 94, 94)" }}>
              {acl} open positions
            </p>
          </div>
        </div>
        <div
          className={style.categories}
          onClick={() => {
            navigate(`category/jobs/${"healthcare"}`);
          }}
        >
          <div style={{ fontSize: "60px" }}>
            <TbRibbonHealth />
          </div>
          <div>
            <h3>Healthcare</h3>
            <p style={{ fontSize: "16px", color: "rgb(97, 94, 94)" }}>
              {healthcarel} open positions
            </p>
          </div>
        </div>
        <div
          className={style.categories}
          onClick={() => {
            navigate(`category/jobs/${"human resource"}`);
          }}
        >
          <div style={{ fontSize: "60px" }}>
            <MdManageAccounts />
          </div>
          <div>
            <h3>Human Resource</h3>
            <p style={{ fontSize: "16px", color: "rgb(97, 94, 94)" }}>
              {hrl} open positions
            </p>
          </div>
        </div>
        <div
          className={style.categories}
          onClick={() => {
            navigate(`category/jobs/${"customer service"}`);
          }}
        >
          <div style={{ fontSize: "60px" }}>
            <MdManageAccounts />
          </div>
          <div>
            <h3>Customer Service</h3>
            <p style={{ fontSize: "16px", color: "rgb(97, 94, 94)" }}>
              {csl} open positions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PopularCategory;
