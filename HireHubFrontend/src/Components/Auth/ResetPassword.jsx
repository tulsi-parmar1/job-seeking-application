import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import style from "../../module/ResetPassword.module.css";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewpassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `http://localhost:4000/api/user/reset-password/${token}`,
        { newPassword, confirmNewPassword },
        { withCredentials: true }
      );

      toast.success(data.message);
      setNewPassword("");
      setConfirmNewpassword("");
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error);
      console.log(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className={style.reset_container}>
      <div className={style.reset_card}>
        <h2>Reset Password</h2>
        <p>Enter your new password to reset your account.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <p>confirm password:</p>
          <input
            type="password"
            placeholder="Enter confirm password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewpassword(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
