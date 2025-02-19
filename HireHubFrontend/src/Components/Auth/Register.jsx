import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import VarifyEmail from "./VarifyEmail";
import { toast } from "react-toastify";
import { userAction } from "../../Slices/userSlice";
import "react-toastify/dist/ReactToastify.css";
import style from "../../module/Login.module.css";

function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthorized, email } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthorized) {
      navigate("/");
    }
  }, [isAuthorized, navigate]);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:4000/api/user/register",
        { name, email, phone, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success("User registered successfully!");
      toast.success("OTP sent to your email");

      navigate("/verifyEmail");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className={style.container}>
        <div className={style.img}>
          <img src="loginimg.png" alt="logo" />
        </div>
        <form onSubmit={handleRegister}>
          <div className={style.inputTag}>
            <h2 className={style.label} style={{ marginBottom: "20px" }}>
              Register
            </h2>
            <div>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => dispatch(userAction.setEmail(e.target.value))}
              />
            </div>
            <div>
              <label>Phone</label>
              <input
                type="number"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <input
                type="submit"
                name="submit"
                onClick={handleRegister}
                className={style.lgnbtn}
              />
            </div>
            <div>
              Already have an account?{" "}
              <a onClick={handleLogin} style={{ cursor: "pointer" }}>
                Login
              </a>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Register;
