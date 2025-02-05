import { useNavigate } from "react-router-dom";
import style from "../../module/HeroSection.module.css";
import PopularCategory from "./PopularCategory";
import { useSelector } from "react-redux";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function HeroSection() {
  const gsapRef = useRef();
  const imageRef = useRef();
  const textRef = useRef();
  const secondTextRef = useRef();
  const btnRef = useRef();
  useGSAP(() => {
    //using useRef
    gsap.fromTo(
      gsapRef.current,
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: gsapRef.current,
        },
      }
    );
    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        delay: 0.5,
        duration: 1,
        scrollTrigger: {
          trigger: textRef.current,
        },
      }
    );
    gsap.fromTo(
      secondTextRef.current,
      { opacity: 0, y: 0 },
      {
        opacity: 1,
        y: 0,
        delay: 1,
        duration: 1,
        scrollTrigger: {
          trigger: secondTextRef.current,
        },
      }
    );
    gsap.fromTo(
      imageRef.current,
      { opacity: 0, x: 400 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        scrollTrigger: {
          trigger: imageRef.current,
        },
      }
    ),
      gsap.fromTo(
        btnRef.current,
        { opacity: 0, y: 0 },
        {
          opacity: 1,
          y: 0,
          delay: 1,
          duration: 1,
          scrollTrigger: {
            trigger: btnRef.current,
          },
        }
      );
  });

  const navigate = useNavigate();
  const { users } = useSelector((state) => state.user);
  const handleonclick = () => {
    navigate("/job/getall");
  };
  return (
    <>
      <div className={style.hero}>
        <div className={style.content}>
          <h1 ref={gsapRef}>
            {" "}
            Welcome<span style={{ color: "#088395" }}>{users.name}</span>!
          </h1>
          <h2 ref={textRef}>Unlock Your Professional Potential </h2>
          <p ref={secondTextRef}>
            Connecting top talent with exceptional opportunities. <br />
            Where your next great hire is just a{" "}
            <span className={style.span}> click away. </span>
          </p>
          <button onClick={handleonclick} ref={btnRef}>
            Find Job
          </button>
        </div>
        <div className={style.image}>
          {/* <img src="resume.png" alt="" /> */}
          <img src="home2.png" alt="" ref={imageRef} />
        </div>
      </div>
      <PopularCategory></PopularCategory>
    </>
  );
}
export default HeroSection;
