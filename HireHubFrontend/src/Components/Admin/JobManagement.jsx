import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import JobLayout from "../Home/JobLayout";
import Loader from "../Layout/Loader";
import style from "../../module/Admin.module.css";
import { FaLocationDot } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

function JobManagement() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  const isAuthorized = localStorage.getItem("isAuthorized") === "true";

  const [loading, setLoading] = useState(true);
  const [page, setpage] = useState(1);
  const audio = new Audio("notification.mp3");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:4000/api/admin/getAll`, {
          withCredentials: true,
        });
        console.log(res.data);
        if (jobs.length === 0) {
          setJobs(res.data.jobs);
          setLoading(false);
        } else {
          setJobs((prevJobs) => [...prevJobs, ...res.data.jobs]);
          setLoading(false);
        }
      } catch (error) {
        audio.play();
        toast.error("Failed to fetch jobs");
        setLoading(false);
      }
    };

    fetchJobs();
  }, [page]);

  const handleDelete = async (id) => {
    const result = confirm("are you sure you want to delete job??");
    if (result) {
      try {
        const { data } = await axios.delete(
          `http://localhost:4000/api/admin/delete-job/${id}`,
          { withCredentials: true }
        );
        audio.play();
        toast.success(data.message);
        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));
      } catch (error) {
        audio.play();
        console.log(error);
        toast.error(error.response?.data?.message || error.message);
      }
    }
  };
  return (
    <div className={style.adminjobList}>
      {jobs.map((job) => (
        <div className={style.adminjobCard} key={job._id}>
          <div className={style.adminjobInfo}>
            {job.logo && <img src={job.logo.url} alt={`${job.title} logo`} />}
            <div className={style.adminjobDetails}>
              <h4 style={{ color: "teal" }}>{job.title}</h4>
              <div className={style.adminjobLocation}>
                <p style={{ color: " rgb(78, 76, 76)", fontSize: "17px" }}>
                  {job.company}
                </p>
                <p style={{ color: " rgb(78, 76, 76)", fontSize: "17px" }}>
                  <FaLocationDot />
                  {job.location}
                </p>
              </div>
            </div>
          </div>
          <div className={style.adminjobMeta}>
            <p style={{ fontSize: "14px" }}>{job.employmentType}</p>
            <p style={{ fontSize: "14px" }}>{job.categories}</p>
            <p style={{ fontSize: "14px" }}>
              Applicants: {job.applicants.length}
            </p>
          </div>
          <div className={style.adminjobActions}>
            <p>Posted {moment(job.postedDate).fromNow()}</p>
            <div className={style.adminjobControls}>
              <div>
                <MdDelete onClick={() => handleDelete(job._id)} />
              </div>
            </div>
          </div>
        </div>
      ))}

      {loading && <Loader />}
    </div>
  );
}

export default JobManagement;
