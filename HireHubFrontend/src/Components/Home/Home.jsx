import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import HeroSection from "./HeroSection";
import { useEffect } from "react";
import JobType from "./JobType";
import { toast } from "react-toastify";
import LatestJob from "./LatestJob";
function Home() {
  // const { isAuthorized } = useSelector((state) => state.user);
  const isAuthorized = localStorage.getItem("isAuthorized") === "true";
  const navigate = useNavigate();
  const audio = new Audio("notification.mp3");
  useEffect(() => {
    // if (!isAuthorized) {
    //   navigate("/login");
    // }
    window.scrollTo(0, 0);
  }, [isAuthorized, navigate]);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/profile/getProfile`,
          { withCredentials: true }
        );
        dispatch(userAction.setProfile(data.url));
        console.log(data.url);
      } catch (error) {
        audio.apply();
        toast.error(error.response.data.message);
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
