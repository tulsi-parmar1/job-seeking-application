import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdDelete } from "react-icons/md";
import { GrLinkPrevious } from "react-icons/gr";

const ViewApplication = () => {
  const [applicants, setApplicants] = useState([]);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const audio = new Audio("notification.mp3");
  const location = useLocation();
  const { forMargin } = location.state;

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/application/getApplication/${id}`,
          { withCredentials: true }
        );
        setApplicants(response.data.applicants);
      } catch (error) {
        console.error("Error fetching applicants:", error);
        setError("Error fetching applicants");
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
        setApplicants((prev) =>
          prev.filter((application) => application._id !== idd)
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

  if (error) return <div>Error: {error}</div>;

  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <GrLinkPrevious
        onClick={() => window.history.back()}
        style={{
          fontSize: "28px",
          cursor: "pointer",
          marginBottom: "20px",
          color: "#0f172a",
        }}
      />

      {applicants.length === 0 ? (
        <h1 style={{ textAlign: "center", color: "#888", marginTop: "50px" }}>
          No applications found
        </h1>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {applicants.map((applicant, index) => (
            <li
              key={index}
              style={{
                background: "#fff",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                marginBottom: "30px",
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: "1", minWidth: "250px" }}>
                <h2 style={{ marginBottom: "10px", color: "#088395" }}>
                  {applicant.firstName} {applicant.lastName}
                </h2>
                <p>
                  <strong style={{ color: "#555" }}>Email: </strong>
                  <a
                    href={`mailto:${applicant.email}`}
                    style={{ color: "#0284c7" }}
                  >
                    {applicant.email}
                  </a>
                </p>
                <p>
                  <strong style={{ color: "#555" }}>Contact Number: </strong>
                  {applicant.contactNumber}
                </p>
                <p>
                  <strong style={{ color: "#555" }}>Current City: </strong>
                  {applicant.currentCity}
                </p>
                <p>
                  <strong style={{ color: "#555" }}>Cover Letter: </strong>
                  <span style={{ fontStyle: "italic", color: "#334155" }}>
                    {applicant.coverLetter}
                  </span>
                </p>
                <button
                  onClick={() => deleteApplication(applicant._id)}
                  style={{
                    marginTop: "15px",
                    background: "#ef4444",
                    color: "#fff",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <MdDelete size={20} />
                  Delete
                </button>
              </div>

              <div style={{ textAlign: "center", minWidth: "250px" }}>
                <iframe
                  src={applicant.resume}
                  style={{
                    width: "100%",
                    height: "200px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    marginBottom: "10px",
                  }}
                  title="Resume PDF"
                />
                <button
                  onClick={() => handleResumeClick(applicant.resume)}
                  style={{
                    background: "#0ea5e9",
                    color: "#fff",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  View Full Resume
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewApplication;
