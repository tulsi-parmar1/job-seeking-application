import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import HeroSection from "./HeroSection";
import { useEffect } from "react";
import JobType from "./JobType";
import LatestJob from "./LatestJob";
function Home() {
  // const { isAuthorized } = useSelector((state) => state.user);
  const isAuthorized = localStorage.getItem("isAuthorized") === "true";
  const { users } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [isAuthorized, navigate]);

  if (users.role === "admin") {
    navigate("/admin/dashboard");
  }

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/profile/getProfile`,
          { withCredentials: true }
        );
        dispatch(userAction.setProfile(data.url));
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    getProfile();
  }, []);

  return (
    <>
      <HeroSection></HeroSection>
      <JobType></JobType>
      <LatestJob></LatestJob>
    </>
  );
}
export default Home;
