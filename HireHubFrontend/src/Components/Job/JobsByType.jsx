import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import JobLayout from "../Home/JobLayout";
import axios from "axios";

function JobsByType() {
  const { type } = useParams();
  const [jobsData, setJobsData] = useState({
    fullTime: [],
    partTime: [],
    contract: [],
    internship: [],
    remoteJob: [],
  });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/job/jobtype", {
        withCredentials: true,
      })
      .then((res) => {
        setJobsData({
          fullTime: res.data.fullTime || [],
          partTime: res.data.partTime || [],
          contract: res.data.contract || [],
          internship: res.data.internship || [],
          remoteJob: res.data.remoteJob || [],
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching job data:", error);
        setError("Failed to load job data.");
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const jobTypes = {
    "Full-time": jobsData.fullTime,
    "Part-time Job": jobsData.partTime,
    "Contract Job": jobsData.contract,
    Internship: jobsData.internship,
    "Remote Job": jobsData.remoteJob,
  };

  const jobs = jobTypes[type] || [];

  return (
    <div style={{ marginTop: "150px" }}>
      {jobs.length > 0 ? (
        <>
          <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
            explore jobs by Types
          </h1>
          <JobLayout jobs={jobs} />
        </>
      ) : (
        <p style={{ fontSize: "30px", textAlign: "center" }}>
          No jobs posted as {type}
        </p>
      )}
    </div>
  );
}

export default JobsByType;
