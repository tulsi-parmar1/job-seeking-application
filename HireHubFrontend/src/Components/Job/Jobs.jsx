import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import style from "../../module/Jobs.module.css";
import JobLayout from "../Home/JobLayout";
import Loader from "../Layout/Loader";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  const { isAuthorized } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState(""); // For job title
  const [locationQuery, setLocationQuery] = useState(""); // For job location
  const [typeQuery, setTypeQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setpage] = useState(1);
  const audio = new Audio("notification.mp3");
  // Handle search for job title
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search for job location
  const handleLocationSearch = (e) => {
    setLocationQuery(e.target.value);
  };
  const handleTypeSearch = (e) => {
    console.log(e.target.value);
    setTypeQuery(e.target.value);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(
    () => {
      const fetchJobs = async () => {
        setLoading(true);
        try {
          const res = await axios.get(
            `http://localhost:4000/api/job/getAll?page=${page}&limit=7`,
            { withCredentials: true }
          );

          console.log("fetcghed 7 jobs", res.data.jobs);
          if (jobs.length === 0) {
            setJobs(res.data.jobs);
            setLoading(false);
          } else {
            setJobs((prevJobs) => [...prevJobs, ...res.data.jobs]); // Append new jobs}
            setLoading(false);
          }
          console.log(jobs.length);
        } catch (error) {
          audio.play();
          toast.error("Failed to fetch jobs");
          setLoading(false);
        }
      };
      fetchJobs();
    },
    [page],
    []
  );

  if (!isAuthorized) {
    navigate("/login");
  }

  // Filter jobs by both title and location
  const filteredJobs = jobs.filter((job) => {
    return (
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      job.location.toLowerCase().includes(locationQuery.toLowerCase()) &&
      job.employmentType.toLowerCase().includes(typeQuery.toLowerCase())
    );
  });

  return (
    <>
      <div className={style.jobcontainer}>
        <div className={style.container}>
          <h1>Complete Job Listings</h1>
          <p
            style={{
              textAlign: "center",
              color: "gray",
              fontSize: "14px",
              marginTop: "8px",
            }}
          >
            All Jobs in One Place: Your Ultimate Career Hub
          </p>
          <div className={style.inpt}>
            {/* Search by job title */}
            <input
              type="text"
              placeholder="Search job by title"
              onChange={handleSearch}
              value={searchQuery}
            />
            {/* Search by job location */}
            <input
              type="text"
              placeholder="Search job by location"
              onChange={handleLocationSearch}
              value={locationQuery}
            />
            <div
              style={{
                display: "flex",
                border: "1px solid rgba(128, 128, 128, 0.338)",
                padding: "px",
                borderRadius: "10px",
                backgroundColor: "white",
                marginBottom: "40px",
                marginTop: "20px",
              }}
            >
              <input
                style={{ height: "10px", width: "10px" }}
                type="radio"
                name="type"
                value={"Internship"}
                onChange={handleTypeSearch}
              />
              <p style={{ marginTop: "20px" }}>Internship</p>

              <input
                type="radio"
                style={{ height: "10px", width: "10px" }}
                name="type"
                value={"Part-Time"}
                onChange={handleTypeSearch}
              />
              <p style={{ marginTop: "20px" }}>Part-time</p>

              <input
                type="radio"
                style={{ height: "10px", width: "10px" }}
                name="type"
                value={"Full-time"}
                onChange={handleTypeSearch}
              />
              <p style={{ marginTop: "20px" }}>Full-time</p>

              <input
                type="radio"
                style={{ height: "10px", width: "10px" }}
                name="type"
                value={"Contract"}
                onChange={handleTypeSearch}
              />
              <p style={{ marginTop: "20px" }}>Contract</p>

              <input
                type="radio"
                style={{ height: "10px", width: "10px" }}
                name="type"
                value={"Remote Job"}
                onChange={handleTypeSearch}
              />
              <p style={{ marginTop: "20px" }}>Remote-Job</p>
            </div>
          </div>

          <JobLayout jobs={filteredJobs} setPage={setpage}></JobLayout>
          {loading && <Loader></Loader>}
        </div>
      </div>
    </>
  );
}

export default Jobs;
