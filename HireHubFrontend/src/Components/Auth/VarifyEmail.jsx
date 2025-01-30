import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import style from "../../module/Login.module.css";
import { useDispatch } from "react-redux";
import { userAction } from "../../Slices/userSlice";
import { Navigate, useNavigate } from "react-router-dom";
function VarifyEmail() {
  const email = localStorage.getItem("userEmail");
  const [code, setCode] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleResendOTP = async () => {
    console.log(email);
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

      toast.success("Email verified successfully");
      dispatch(userAction.setIsAuthorized(true));
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Invalid OTP");
      dispatch(userAction.setIsAuthorized(false));
    }
  };
  return (
    <div>
      <div>
        <label>Enter OTPPPP</label>
        <input
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
        />
      </div>
      <p>
        Request a new one otp <p onClick={handleResendOTP}>here</p>{" "}
      </p>
    </div>
  );
}

export default VarifyEmail;
