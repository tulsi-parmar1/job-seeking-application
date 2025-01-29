import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import style from "../../module/Application.module.css";
import { MdDelete } from "react-icons/md";
import { GrLinkPrevious } from "react-icons/gr";

const ViewApplication = () => {
  const [applicants, setApplicants] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/application/getMyApplication",
          { withCredentials: true }
        );
        setApplicants(data);
        console.log(data);
      } catch (error) {
        alert(error);
      }
    };

    fetchApplicants();
  }, [id]);

  const deleteApplication = async (idd) => {
    const result = confirm("Are you sure you want to delete?");
    if (result) {
      try {
        const { data } = await axios.delete(
          `http://localhost:4000/api/application/deleteApplication/${idd}`,
          { withCredentials: true }
        );

        // Update the state to remove the deleted application
        setApplicants((prevApplications) =>
          prevApplications.filter((application) => application._id !== idd)
        );

        toast.success(data.message);
      } catch (error) {
        toast.error("Failed to delete application.");
      }
    }
  };

  const handleResumeClick = (resume) => {
    // Opens the resume in a new tab
    window.open(resume, "_blank");
  };

  const handleJobDetailClick = (jobId) => {
    navigate(`/profile/application/me/job/${jobId}`); // Navigate to the job detail page
  };

  return (
    <div className={`${style.applicants}`} style={{ marginTop: "-1px" }}>
      <GrLinkPrevious
        style={{ fontSize: "30px", marginLeft: "100px" }}
        className={style.previous}
        onClick={() => window.history.back()}
      />
      <ul>
        {applicants.map((applicant, index) => (
          <li key={index}>
            <div style={{ display: "flex", gap: "50px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <h3 style={{ color: "#088395" }}>
                  {applicant.firstName} {applicant.lastName}
                </h3>
                <p>
                  Email:{" "}
                  <span style={{ fontSize: "16px" }}> {applicant.email}</span>
                </p>
                <p>
                  Contact Number:{" "}
                  <span style={{ fontSize: "16px" }}>
                    {" "}
                    {applicant.contactNumber}
                  </span>
                </p>
                <p>
                  Current City:{" "}
                  <span style={{ fontSize: "16px" }}>
                    {" "}
                    {applicant.currentCity}
                  </span>
                </p>
                <p>
                  Cover Letter:{" "}
                  <span style={{ fontSize: "16px" }}>
                    {" "}
                    {applicant.coverLetter}
                  </span>
                </p>
                <div className={style.btn}>
                  <MdDelete
                    onClick={() => deleteApplication(applicant._id)}
                    style={{ fontSize: "40px" }}
                  />
                </div>
              </div>

              <div>
                <iframe
                  src={`http://localhost:4000/${applicant.resume}`}
                  height="200px"
                  title="Resume PDF"
                ></iframe>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => {
                      handleResumeClick(
                        `http://localhost:4000/${applicant.resume}`
                      );
                    }}
                    className={style.resumeFullimg}
                  >
                    View Full Resume
                  </button>
                  <button
                    onClick={() => {
                      handleJobDetailClick(applicant.job._id); // Pass the clicked job ID
                    }}
                    className={style.resumeFullimg}
                  >
                    View Job Detail
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {applicants.length <= 0 && <h1>No applications</h1>}
    </div>
  );
};

export default ViewApplication;
