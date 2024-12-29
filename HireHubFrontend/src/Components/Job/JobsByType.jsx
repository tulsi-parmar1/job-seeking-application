// import React, { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import JobLayout from "../Home/JobLayout";
// import { useState } from "react";
// import axios from "axios";

// function JobsByType() {
//   const { type } = useParams();
//   console.log(type);
//   const [fulltimeJobs, setfulltimeJobs] = useState([]);
//   const [parttimeJobs, setparttimeJobs] = useState([]);
//   const [contractJobs, setcontractJobs] = useState([]);
//   const [internshipJobs, setinternshipJobs] = useState([]);
//   const [remoteJobs, setremoteJobs] = useState([]);

//   useEffect(() => {
//     axios
//       .get("http://localhost:4000/api/job/jobtype", {
//         withCredentials: true,
//       })
//       .then((res) => {
//         setfulltimeJobs(res.data.fullTime);
//         setparttimeJobs(res.data.partTime);
//         setcontractJobs(res.data.contract);
//         setinternshipJobs(res.data.internship);
//         setremoteJobs(res.data.remoteJob);
//       })
//       .catch((error) => {
//         console.error("Error fetching job counts by type:", error);
//         console.log(error.response.data.message);
//       });
//   }, []);
//   return (
//     <div>
//       {type === "Full-time" && fulltimeJobs.length > 0 ? (
//         <JobLayout jobs={fulltimeJobs}></JobLayout>
//       ) : (
//         <p>there is no jobs posted as Full-time</p>
//       )}

//       {type === "Remote Job" && remoteJobs.length > 0 ? (
//         <JobLayout jobs={remoteJobs}></JobLayout>
//       ) : (
//         <p>there is no jobs posted as Rmote job</p>
//       )}

//       {type === "Internship" && internshipJobs.length > 0 ? (
//         <JobLayout jobs={internshipJobs}></JobLayout>
//       ) : (
//         <p>there is no jobs posted as internship</p>
//       )}

//       {type === "Contract Job" && contractJobs.length > 0 ? (
//         <JobLayout jobs={contractJobs}></JobLayout>
//       ) : (
//         <p>there is no jobs posted as Contract job</p>
//       )}

//       {type === "Part-time Job" && parttimeJobs.length > 0 ? (
//         <JobLayout jobs={parttimeJobs}></JobLayout>
//       ) : (
//         <p>there is no jobs posted as Part-time job</p>
//       )}
//     </div>
//   );
// }

// export default JobsByType;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
