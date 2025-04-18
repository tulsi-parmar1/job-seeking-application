import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import style from "../../module/Login.module.css";
import { useDispatch } from "react-redux";
import { userAction } from "../../Slices/userSlice";
import { Navigate, useNavigate } from "react-router-dom";
function VarifyEmail() {
  const email = localStorage.getItem("email");
  const [code, setCode] = useState("");
  const dispatch = useDispatch();
  const audio = new Audio("notification.mp3");
  const navigate = useNavigate();
  const handleResendOTP = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/user/otpResend",
        { email }
      );
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error("Error resending OTP.");
    }
  };
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/user/varifyEmail",
        { code },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      audio.play();
      toast.success("Email verified successfully");
      dispatch(userAction.setIsAuthorized(true));
      localStorage.setItem("userEmail", email);
      dispatch(userAction.setEmail(email));
      localStorage.setItem("isAuthorized", true);
      //can comment the below code because now we would not redirect to home page as we used to..
      localStorage.setItem("setShowOtpInput", false);
      dispatch(userAction.setIsVerified(true));
      navigate("/");
    } catch (error) {
      console.log(error);
      audio.play();
      toast.error(error.response?.data?.message || "Invalid OTP");
      dispatch(userAction.setIsVerified(false));
      localStorage.setItem("isAuthorized", false);
      dispatch(userAction.setIsAuthorized(false));
    }
  };
  return (
    <div className={style.verifyMainConatiner}>
      <div className={style.verifyContainer}>
        <div>
          <label style={{ fontSize: "16px" }}>Enter your OTP:</label> <br />{" "}
          <span></span>
          <input
            style={{
              marginTop: "10px",
              backgroundColor: "rgba(128, 128, 128, 0.214)",
            }}
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <div>
          <input
            type="submit"
            onClick={handleVerifyOTP}
            className={style.lgnbtn}
            value="Verify OTP"
            style={{ marginTop: "20px", marginBottom: "20px" }}
          />
        </div>
        <div>
          <p style={{ fontSize: "15px" }}>
            Request a new one otp{" "}
            <a
              onClick={handleResendOTP}
              style={{ color: "blue", fontSize: "15px" }}
            >
              here
            </a>{" "}
          </p>
        </div>
      </div>
      <div>
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: "100%",
            height: "auto",
            objectFit: "cover",
            marginTop: "-650px",
          }}
        >
          <source
            src=" 69c8fd21bd89f303fd94787ec04acb4a.mp4"
            type="video/mp4"
          ></source>
        </video>
      </div>
    </div>
  );
}

export default VarifyEmail;
