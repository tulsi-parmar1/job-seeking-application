import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import JobLayout from "../Home/JobLayout.jsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../Layout/Loader.jsx";

const SavedJobs = ({ profile }) => {
  const [jobs, setJobs] = useState("");
  const navigate = useNavigate();
  const [loader, setloader] = useState(true);
  const { users } = useSelector((state) => state.user);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const getSavedJobs = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/user/getSavedJobs/${users._id}`,
          { withCredentials: true }
        );
        console.log(data);
        setJobs(data.savedJobs);
        setloader(false);
      } catch (error) {
        console.log(error);
        setloader(false);
      }
    };
    getSavedJobs();
  }, []);
  const handleUnsaveJob = (jobId) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId)); // Remove the unsaved job
  };
  return (
    <>
      {loader ? (
        <Loader></Loader>
      ) : (
        <>
          <div
            style={{
              marginTop: profile ? "200px" : "20px",
              textAlign: "center",
            }}
          >
            {jobs.length > 0 ? (
              <>
                <h1 style={{ marginBottom: "20px" }}>saved jobs</h1>
                <JobLayout
                  jobs={jobs}
                  onUnsaveJob={handleUnsaveJob}
                  isSavedJobView={true}
                ></JobLayout>
              </>
            ) : (
              <>
                <p> You have not saved jobs</p>
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
                    onClick={() => navigate("/job/getall")}
                  >
                    Explore Jobs
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};
export default SavedJobs;
