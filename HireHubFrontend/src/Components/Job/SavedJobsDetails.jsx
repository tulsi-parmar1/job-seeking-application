import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileSavedJobsDetail from "./ProfileSavedJobsDetail";
function MyJobDetail() {
  // const { isAuthorized } = useSelector((state) => state.user);
  const isAuthorized = localStorage.getItem("isAuthorized") === "true";
  const navigate = useNavigate();
  const { id } = useParams();
  const audio = new Audio("notification.mp3");
  const [length, setlength] = useState(0);
  const [job, setJob] = useState({});
  useEffect(() => {
    if (!isAuthorized) {
      return navigate("/login");
    }
    axios
      .get(`http://localhost:4000/api/job/${id}`, { withCredentials: true })
      .then((res) => {
        setJob(res.data.job);
        setlength(res.data.applicantsLength);
      })
      .catch((err) => {
        audio.play();
        toast.error(err.response.data.message);
      });
  }, []);
  return (
    <>
      <ProfileSavedJobsDetail
        job={job}
        applicants={length}
        id={id}
      ></ProfileSavedJobsDetail>
    </>
  );
}
export default MyJobDetail;
