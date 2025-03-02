import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const cookies = document.cookie;
      const hasToken = cookies.includes("token="); // Check if the token exists
      console.log(cookies, hasToken);
      if (!hasToken) {
        localStorage.clear(); // Clear stored user data
        navigate("/");
      }
    };

    checkAuth(); // Check authentication once when component mounts
  }, [navigate]);

  return null;
};

export default Auth;
