import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import style from "../../module/JobDetail.module.css";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { GrFormPrevious } from "react-icons/gr";
import { GrLinkPrevious } from "react-icons/gr";
import { IoLocation } from "react-icons/io5";
import { useEffect } from "react";
import { LuDot } from "react-icons/lu";
import { toast } from "react-toastify";
import axios from "axios";
import { userAction } from "../../Slices/userSlice";
import { useState } from "react";
import { FaRegBookmark } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa6";
const JobDetailSub = ({ job, applicants, id }) => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState([]);
  const dispatch = useDispatch();
  const isAuthorized = localStorage.getItem("isAuthorized") === "true";
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { users } = useSelector((state) => state.user);
  const toggleSaveJob = async (jobId) => {
    try {
      if (!isAuthorized) {
        return navigate("/login");
      }
      const response = await axios.post(
        `http://localhost:4000/api/user/savedJobs/${users._id}/${jobId}`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        setSaved(response.data.savedJobs);
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    try {
      axios
        .get(`http://localhost:4000/api/user/getUser`, {
          withCredentials: true,
        })
        .then((res) => {
          dispatch(userAction.setUser(res.data.user));
          setSaved(res.data.savedJobs);
        });
    } catch (error) {
      toast.error(error);
    }
  }, []);

  return (
    <>
      <GrLinkPrevious
        style={{ fontSize: "30px" }}
        className={style.previous}
        onClick={() => window.history.back()}
      />
      <div className={style.themain}>
        <div className={style.first}>
          <h1>{job.title}</h1>
          <div style={{ display: "flex", gap: "20px" }}>
            <p>
              {users._id === job.postedBy && applicants > 0 && (
                <button
                  onClick={() =>
                    navigate(`/application/viewapplication/${id}`, {
                      state: { forMargin: true },
                    })
                  }
                >
                  view applicants
                </button>
              )}
              {!(users?._id === job.postedBy) &&
                !(users?.role === "recruiter" && isAuthorized) && (
                  <button onClick={() => navigate(`/application/${job._id}`)}>
                    Apply now
                  </button>
                )}
            </p>

            <div
              onClick={() => toggleSaveJob(job._id)}
              className={`${
                saved.includes(job._id) ? style.save : style.unsave
              } `}
              style={{
                border: "0.5px solid rgba(128, 128, 128, 0.492)",
                padding: "5px",
                borderRadius: "8px",
              }}
            >
              {saved.includes(job._id) ? (
                <FaBookmark style={{ fontSize: "25px" }} />
              ) : (
                <FaRegBookmark style={{ fontSize: "25px" }} />
              )}
            </div>
          </div>
        </div>
        <div className={style.second}>
          <div className={style.logo}>
            {job.logo && <img src={job.logo.url} alt={`${job.title} logo`} />}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", gap: "50px" }}>
              <p style={{ color: "#088395", fontWeight: "bold" }}>
                {job.company}
              </p>
              <p>
                <IoLocation />
                {job.location}
              </p>
            </div>
            <div className={style.threedesign}>
              <p>{job.employmentType}</p>
              <p>{job.categories}</p>
              <p>applicants:{applicants}</p>
            </div>
          </div>
        </div>
        <div>
          <div dangerouslySetInnerHTML={{ __html: job.description }} />
        </div>
        <div>
          {job.requirements && (
            <>
              <p style={{ fontWeight: "bold" }}>Requirements: </p>
              <div dangerouslySetInnerHTML={{ __html: job.requirements }} />
            </>
          )}
        </div>
        {console.log(job.requirements)}
        <div>
          {job.responsibilities && (
            <>
              <p style={{ fontWeight: "bold" }}>Responsibilities: </p>
              <div dangerouslySetInnerHTML={{ __html: job.responsibilities }} />
            </>
          )}
        </div>
        <div>
          {job.contactEmail && (
            <>
              <p style={{ fontWeight: "bold" }}>Contact Email: </p>
              <a href={`mailto:${job.contactEmail}`}>{job.contactEmail}</a>
            </>
          )}
        </div>
        <div>
          <p style={{ fontWeight: "bold" }}>Salary Range:</p>
          <div>
            <p>
              {" "}
              <LiaRupeeSignSolid />
              <span>
                {job.salaryRange
                  ? `${job.salaryRange.min}-${job.salaryRange.max}`
                  : "N/A"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
export default JobDetailSub;
