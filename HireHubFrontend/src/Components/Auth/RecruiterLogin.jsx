import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { userAction } from "../../Slices/userSlice";
import { toast } from "react-toastify";
import style from "../../module/Login.module.css";
const RecruiterLogin = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const audio = new Audio("notification.mp3");
  const { users } = useSelector((state) => state.user);
  const [email, setEmail] = useState(users.email);
  const { isAuthorized } = useSelector((state) => state.user);
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/user/recruiterlogin",
        { email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      audio.play();
      toast.success(data.message);
      setEmail("");
      setPassword("");
      dispatch(userAction.setUser(data.user));
      navigate("/job/post");
    } catch (error) {
      audio.play();
      toast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    if (!isAuthorized) {
      navigate("/login");
    }
    if (users.role === "recruiter") {
      navigate("/job/post");
    }
  }, []);
  return (
    <>
      <div className={style.container} style={{ marginTop: "150px" }}>
        <div className={style.img}>
          <img src="loginimg.png" alt="logo" />
        </div>

        <form action="">
          <h2 className={style.label} style={{ marginBottom: "20px" }}>
            Login As Recruiter
          </h2>
          <div className={style.inputTag}>
            <div>
              <label>email</label>
              <input
                type="text"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                onClick={handleLogin}
                className={style.lgnbtn}
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
export default RecruiterLogin;
