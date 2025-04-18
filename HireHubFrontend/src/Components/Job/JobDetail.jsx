import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JobDetailSub from "./JobDetailSub";
import SimilarJobs from "./SimilarJobs";
import style from "../../module/JobDetail.module.css";
function JobDetail() {
  const isAuthorized = localStorage.getItem("isAuthorized") === "true";
  const navigate = useNavigate();
  const { id } = useParams(); //new
  const [applicants, setApplicants] = useState([]);
  const [job, setJob] = useState({});
  const audio = new Audio("notification.mp3");
  // ----------------parent component for job detail and sum details-----------------------//
  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/job/${id}`, { withCredentials: true })
      .then((res) => {
        setJob(res.data.job);
        setApplicants(res.data.applicantsLength);
      })
      .catch((err) => {
        audio.play();
        toast.error(err.response.data.message);
      });
  }, [id, isAuthorized, navigate]);

  return (
    <>
      <div
        style={{
          display: "flex",
          marginTop: "150px",
          justifyContent: "center",
          gap: "70px",
        }}
        className={style.jobdetail}
      >
        <div>
          {" "}
          <JobDetailSub
            job={job}
            applicants={applicants}
            id={id}
          ></JobDetailSub>
        </div>

        <div>
          <SimilarJobs id={id}></SimilarJobs>
        </div>
      </div>
    </>
  );
}
export default JobDetail;
