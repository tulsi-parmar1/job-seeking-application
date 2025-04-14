import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdDelete } from "react-icons/md";
import { GrLinkPrevious } from "react-icons/gr";

const ViewApplication = () => {
  const [applicants, setApplicants] = useState([]);
  const isAuthorized = localStorage.getItem("isAuthorized") === "true";
  const navigate = useNavigate();
  const audio = new Audio("notification.mp3");

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
        audio.play();
        console.log(error, "because user is not login");
      }
    };

    fetchApplicants();
    if (!isAuthorized) {
      navigate("/login");
    }
  }, [isAuthorized, navigate]);

  const deleteApplication = async (idd) => {
    const result = confirm("Are you sure you want to delete?");
    if (result) {
      try {
        const { data } = await axios.delete(
          `http://localhost:4000/api/application/deleteApplication/${idd}`,
          { withCredentials: true }
        );

        setApplicants((prevApplications) =>
          prevApplications.filter((application) => application._id !== idd)
        );
        audio.play();
        toast.success(data.message);
      } catch (error) {
        audio.play();
        toast.error("Failed to delete application.");
      }
    }
  };

  const handleResumeClick = (resume) => {
    window.open(resume, "_blank");
  };

  const handleJobDetailClick = (jobId) => {
    navigate(`/profile/application/me/job/${jobId}`);
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      {applicants.length <= 0 ? (
        <h1 style={{ textAlign: "center", color: "#333", fontSize: "24px" }}>
          Hey, you've not applied for any job yet.... <br /> Explore jobs to
          apply
          <button
            onClick={() => navigate("/job/getall")}
            style={{
              backgroundColor: "#088395",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              marginTop: "20px",
              cursor: "pointer",
              borderRadius: "5px",
              fontSize: "16px",
            }}
          >
            Explore Jobs
          </button>
        </h1>
      ) : (
        <div>
          <GrLinkPrevious
            onClick={() => window.history.back()}
            style={{
              fontSize: "30px",
              color: "#088395",
              cursor: "pointer",
              marginBottom: "20px",
            }}
          />
          <ul style={{ listStyle: "none", padding: "0" }}>
            {applicants.map((applicant, index) => (
              <li
                key={index}
                style={{
                  backgroundColor: "#f9f9f9",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "20px",
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: "1 1 60%", paddingRight: "20px" }}>
                  <h3 style={{ color: "#088395" }}>
                    {applicant.firstName} {applicant.lastName}
                  </h3>
                  <p>
                    <strong>Email: </strong>
                    <a
                      href={`mailto:${applicant.email}`}
                      style={{ color: "#088395", textDecoration: "none" }}
                    >
                      {applicant.email}
                    </a>
                  </p>
                  <p>
                    <strong>Contact Number: </strong>
                    {applicant.contactNumber}
                  </p>
                  <p>
                    <strong>Current City: </strong>
                    {applicant.currentCity}
                  </p>
                  <p style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                    <strong>Cover Letter: </strong>
                    {applicant.coverLetter}
                  </p>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <MdDelete
                      onClick={() => deleteApplication(applicant._id)}
                      style={{
                        fontSize: "30px",
                        color: "#f44336",
                        cursor: "pointer",
                        marginTop: "10px",
                      }}
                    />
                  </div>
                </div>

                <div style={{ flex: "1 1 30%" }}>
                  <iframe
                    src={`http://localhost:4000/${applicant.resume}`}
                    height="300px"
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                    title="Resume PDF"
                  ></iframe>
                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <button
                      onClick={() =>
                        handleResumeClick(
                          `http://localhost:4000/${applicant.resume}`
                        )
                      }
                      style={{
                        backgroundColor: "#088395",
                        color: "#fff",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      View Full Resume
                    </button>
                    <button
                      onClick={() => handleJobDetailClick(applicant.job._id)}
                      style={{
                        backgroundColor: "#f1f1f1",
                        color: "#333",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "14px",
                        border: "1px solid #ddd",
                      }}
                    >
                      View Job Detail
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ViewApplication;
