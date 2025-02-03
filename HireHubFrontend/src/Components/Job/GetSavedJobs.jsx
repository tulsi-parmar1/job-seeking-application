import axios from "axios";
import { useEffect, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userAction } from "../../Slices/userSlice";
import "react-toastify/dist/ReactToastify.css";

const GetSavedJobs = () => {
  // const { isAuthorized } = useSelector((state) => state.user);
  const isAuthorized = localStorage.getItem("isAuthorized") === "true";
  const [savedJobs, setsavedJobs] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  const audio = new Audio("notification.mp3");
  if (!isAuthorized) {
    navigate("/");
  }
  useEffect(() => {
    const getSavedJobs = async () => {
      try {
        // axios
        //   .get(`http://localhost:4000/api/user/getUser`, {
        //     withCredentials: true,
        //   })
        //   .then((res) => {
        //     dispatch(userAction.setUser(res.data.user));
        //   });
        const { data } = await axios.get(
          "http://localhost:4000/api/user/getSavedJobs",
          { withCredentials: true }
        );
        setsavedJobs(data.savedJobs);
      } catch (error) {
        audio.play();
        toast.error(error);
      }
    };
    getSavedJobs();
  }, [savedJobs]);

  const toggleSaveJob = async (jobId) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/user/savedJobs/${users._id}/${jobId}`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        setsavedJobs(response.data.savedJobs);
        audio.play();
        toast.success(response.data.message);
      }
    } catch (error) {
      audio.play();
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <div className="jobs page">
        <div className="container">
          <h1>Saved jobssss</h1>
          <div className="banner">
            {savedJobs.map((elemnt) => {
              return (
                <div className="card" key={elemnt._id}>
                  <p>{elemnt.title}</p>
                  <span onClick={() => toggleSaveJob(elemnt._id)}>
                    {/* <CiHeart
                      className={
                        users &&
                        users.savedJobs &&
                        users.savedJobs.includes(elemnt._id)
                          ? "saved"
                          : ""
                      }
                    /> */}
                  </span>
                  <p>{elemnt.company}</p>
                  <p>{elemnt.location}</p>
                  <Link to={`/job/${elemnt._id}`}>job details</Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
export default GetSavedJobs;
