import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import JobLayout from "../Home/JobLayout";
import Loader from "../Layout/Loader";

function MyJobs() {
  const { isAuthorized } = useSelector((state) => state.user);
  const [myJobs, setMyJobs] = useState([]);
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (!isAuthorized) {
      navigate("/");
    }
    const fetchjobs = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/job/getMyJobs",
          { withCredentials: true }
        );
        setMyJobs(data.myjob);
        setLoader(false);
      } catch (error) {
        toast.error(error.response.data.message);
        setLoader(false);
      }
    };
    fetchjobs();
  }, []);
  return (
    <>
      <div>
        {loader ? (
          <Loader></Loader>
        ) : (
          <div className="jobs page">
            <div className="container" style={{ marginTop: "0px" }}>
              {myJobs.length > 0 ? (
                <>
                  <h1 style={{ textAlign: "center", marginBottom: "25px" }}>
                    My Jobs
                  </h1>

                  <JobLayout
                    jobs={myJobs}
                    isProfileView={true}
                    setJobs={setMyJobs}
                  ></JobLayout>
                </>
              ) : (
                <>
                  <p style={{ textAlign: "center" }}>
                    {" "}
                    You have not posted Jobs
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      margin: "10px",
                    }}
                  >
                    <button
                      style={{
                        backgroundColor: "#088395",
                        color: "white",
                        border: "1px solid",
                        padding: "10px",
                      }}
                      onClick={() => navigate("/recruiterlogin")}
                    >
                      post Job
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
export default MyJobs;
