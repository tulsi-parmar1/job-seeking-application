import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import JobLayout from "../Home/JobLayout";
import axios from "axios";
import Loader from "../Layout/Loader.jsx";

function CategoryJobs() {
  const { category } = useParams();
  const [loader, setLoader] = useState(true);
  const [jobsData, setJobsData] = useState({
    it: [],
    healthcare: [],
    education: [],
    hr: [],
    accountant: [],
    cs: [],
  });

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/job/countCategories", {
        withCredentials: true,
      })
      .then((res) => {
        setJobsData({
          it: res.data.itjobs || [],
          healthcare: res.data.healthcare || [],
          education: res.data.education || [],
          hr: res.data.hr || [],
          accountant: res.data.ac || [],
          cs: res.data.cs || [],
        });
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching job data:", error);
        setError("Failed to load job data.");
        setLoader(false);
      });
  }, []);

  const categoryJobs = {
    "information technology": jobsData.it,
    healthcare: jobsData.healthcare,
    education: jobsData.education,
    "human resource": jobsData.hr,
    account: jobsData.accountant,
    "customer service": jobsData.cs,
  };

  const jobs = categoryJobs[category] || [];

  return (
    <div style={{ marginTop: "150px" }}>
      {loader ? (
        <Loader></Loader>
      ) : jobs.length > 0 ? (
        <>
          <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
            Category-wise Jobs
          </h1>
          <JobLayout jobs={jobs} />
        </>
      ) : (
        <p style={{ fontSize: "25px", textAlign: "center" }}>
          No jobs posted in the {category} category
        </p>
      )}
    </div>
  );
}

export default CategoryJobs;
