import { TiShoppingBag } from "react-icons/ti";
import style from "../../module/LatestJob.module.css";
import { FaLocationDot } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { FaRegBookmark } from "react-icons/fa";
import moment from "moment";
import Loader from "../Layout/Loader";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userAction } from "../../Slices/userSlice";

import { MdDelete } from "react-icons/md";

import { FaEdit } from "react-icons/fa";

import { FaBookmark } from "react-icons/fa6";

const JobLayout = ({
  jobs,
  setJobs,
  setPage,
  similar,
  onUnsaveJob,
  isProfileView,
}) => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    const lastJob = document.querySelector(".jobss:last-child");
    if (lastJob) observer.observe(lastJob);

    return () => {
      if (lastJob) observer.unobserve(lastJob);
    };
  }, [jobs.length]); // Only re-run when jobs length changes

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [saved, setSaved] = useState([]);
  const { users } = useSelector((state) => state.user);
  const handleonclick = (jobId) => {
    if (isProfileView) {
      navigate(`/profile/job/me/${jobId}`);
    } else {
      navigate(`/job/${jobId}`); // Navigate to Regular Job Detail
    }
  };
  //when user click on save button
  const toggleSaveJob = async (jobId) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/user/savedJobs/${users._id}/${jobId}`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        setSaved(response.data.savedJobs);
        toast.success(response.data.message);
      }
      if (!response.data.savedJobs.includes(jobId)) {
        onUnsaveJob(jobId); // Invoke the parent function
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const handleDelete = async (id) => {
    const result = confirm("are you sure you want to delete Job?");
    if (result) {
      try {
        const { data } = await axios.delete(
          `http://localhost:4000/api/job/deleteJob/${id}`,
          { withCredentials: true }
        );
        toast.success(data.message);
        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));
        // navigate("/profile/job/me"); // Redirect after deletion
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      }
    }
  };
  const handleJobUpdate = (id) => {
    navigate(`/profile/job/me/update/${id}`);
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
      <div className={style.container}>
        <div className={`${style.jobcontainer} ${similar && style.similar}`}>
          {jobs.map((job) => {
            return (
              <>
                <div className={`${style.job} jobss`}>
                  {/* first */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "40px",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {job.logo && (
                        <img src={job.logo.url} alt={`${job.title} logo`} />
                      )}{" "}
                      <span style={{ marginLeft: "7px" }}></span>
                      {/* //title and company  */}
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <h4>{job.title}</h4>
                        <div style={{ display: "flex", gap: "7px" }}>
                          <p>{job.company}</p>
                          <p>
                            <FaLocationDot
                              style={{ marginRight: "3px" }}
                            ></FaLocationDot>
                            {job.location}
                          </p>
                        </div>
                      </div>
                    </div>
                    {!isProfileView ? (
                      <div
                        onClick={() => toggleSaveJob(job._id)}
                        className={`${
                          saved.includes(job._id) ? style.save : style.unsave
                        } `}
                      >
                        {saved.includes(job._id) ? (
                          <FaBookmark />
                        ) : (
                          <FaRegBookmark />
                        )}
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: "15px" }}>
                        <MdDelete
                          onClick={() => {
                            handleDelete(job._id);
                          }}
                          style={{ fontSize: "23px" }}
                        />
                        <FaEdit
                          style={{ fontSize: "20px" }}
                          onClick={() => {
                            handleJobUpdate(job._id);
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "15px",
                    }}
                  >
                    <p className={style.employ} style={{ fontSize: "14px" }}>
                      {job.employmentType}
                    </p>
                    <p className={style.type} style={{ fontSize: "14px" }}>
                      {job.categories}
                    </p>
                    <p
                      className={style.applicants}
                      style={{ fontSize: "14px" }}
                    >
                      Applicants:{job.applicants.length}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      alignItems: "center",
                    }}
                    className={style.last}
                  >
                    <button onClick={() => handleonclick(job._id)}>
                      Job Detail
                    </button>
                    <p style={{ fontSize: "13px" }}>
                      Posted {moment(job.postedDate).fromNow()}
                    </p>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default JobLayout;
