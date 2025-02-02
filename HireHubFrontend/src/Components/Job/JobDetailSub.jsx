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
  const audio = new Audio("notification.mp3");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { users } = useSelector((state) => state.user);
  console.log(users);
  const toggleSaveJob = async (jobId) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/user/savedJobs/${users._id}/${jobId}`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        setSaved(response.data.savedJobs);
        audio.play();
        toast.success(response.data.message);
      }
    } catch (error) {
      audio.play();
      toast.error(error.response.data.message);
    }
  };
  //sets users again because there could be chnages in savedjobs array of user object
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
      audio.play();
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
              {!(users._id === job.postedBy) &&
                !(users.role === "recruiter") && (
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
              <p>intership</p>
              <p>experience</p>
            </div>
          </div>
        </div>
        <div>
          <div dangerouslySetInnerHTML={{ __html: job.description }} />
          {/* <p style={{ fontSize: "17px" }}>{job.description}</p> */}
        </div>
        <div>
          {job.requirements && (
            <>
              <p style={{ fontWeight: "bold" }}>Requirements: </p>
              <div dangerouslySetInnerHTML={{ __html: job.requirements }} />
            </>
          )}
        </div>
        <div>
          {job.responsibilities && (
            <>
              <p style={{ fontWeight: "bold" }}>Responsibilities: </p>
              <div dangerouslySetInnerHTML={{ __html: job.responsibilities }} />
            </>
          )}
        </div>
        <div>
          {job.qualification && (
            <>
              <p style={{ fontWeight: "bold" }}>Qualification</p>
              <p>{job.qualification}</p>
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
