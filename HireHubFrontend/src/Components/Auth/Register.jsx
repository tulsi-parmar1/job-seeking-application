import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import VarifyEmail from "./VarifyEmail";
import { toast } from "react-toastify";
import { userAction } from "../../Slices/userSlice";
import "react-toastify/dist/ReactToastify.css";
import style from "../../module/Login.module.css";
function Register() {
  const [name, setName] = useState("");
  //   const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [code, setCode] = useState(""); // ✅ OTP State
  const [showOTPInput, setShowOTPInput] = useState(false); // ✅ OTP form dikhane ka control
  const { isAuthorized } = useSelector((state) => state.user);
  const { email } = useSelector((state) => state.user);
  const handleLogin = () => {
    navigate("/login");
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/user/register",
        { name, email, phone, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("otp sent to your email");
      localStorage.setItem("userEmail", email);
      dispatch(userAction.setEmail(email));
      setShowOTPInput(true);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400 && error.response.data.errors) {
          // Show validation errors
          toast.error(error.response.data.errors.join("\n"));
        } else {
          toast.error(error.response.data.message);
        }
      } else if (error.request) {
        toast.error("no response from server");
      } else {
        // Something else happened in setting up the request
        toast.error("Error in setting up request");
      }
      console.log(error);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      navigate("/");
    }
  }, [isAuthorized, navigate]);
  return (
    <>
      <div className={style.container}>
        <div className={style.img}>
          <img src="loginimg.png" alt="logo" />
        </div>
        <form action="">
          <div className={style.inputTag}>
            <h2 className={style.label} style={{ marginBottom: "20px" }}>
              {showOTPInput ? "Verify OTP" : "Create new Account"}
            </h2>
            {showOTPInput ? (
              // ✅ OTP Verification Form
              <>
                <VarifyEmail></VarifyEmail>
              </>
            ) : (
              <>
                <div>
                  <label>name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label>email</label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) =>
                      dispatch(userAction.setEmail(e.target.value))
                    }
                  />
                </div>
                <div>
                  <label>Phone</label>
                  <input
                    type="number"
                    name="phone"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label>password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
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
              </>
            )}
            <div>
              Already have an Account? <a onClick={handleLogin}>Login</a>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
export default Register;
