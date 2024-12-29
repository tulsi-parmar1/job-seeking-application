import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import HeroSection from "./HeroSection";
import { useEffect } from "react";
import JobType from "./JobType";
import LatestJob from "./LatestJob";
function Home() {
  const { isAuthorized } = useSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthorized) {
      navigate("/login");
    }
    window.scrollTo(0, 0);
  }, [isAuthorized, navigate]);

  return (
    <>
      <HeroSection></HeroSection>
      {/* <HowItWorks></HowItWorks> */}
      <JobType></JobType>
      <LatestJob></LatestJob>
      {/* <PopularCompany></PopularCompany> */}
    </>
  );
}
export default Home;
