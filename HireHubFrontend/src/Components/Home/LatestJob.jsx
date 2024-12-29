import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import style from "../../module/LatestJob.module.css";
import JobLayout from "./JobLayout";
import gsap from "gsap";
const LatestJob = () => {
  const navigate = useNavigate();
  const textRef = useRef();
  const btnRef = useRef();
  const [latestjob, setLatestJob] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/job/latestJob", { withCredentials: true })
      .then((res) => {
        setLatestJob(res.data);
      });
  }, []);
  return (
    <>
      <div className={style.maincontainer}>
        <h1 style={{ margin: "60px", textAlign: "center" }} ref={textRef}>
          The Latest Job Opportunities
        </h1>
        <JobLayout jobs={latestjob}></JobLayout>
        <div className={style.explore}>
          <button onClick={() => navigate("job/getall")} ref={btnRef}>
            Explore all
          </button>
        </div>
      </div>
    </>
  );
};
export default LatestJob;
