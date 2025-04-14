// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import style from "../../module/Application.module.css";
// import { MdDelete } from "react-icons/md";
// import { GrLinkPrevious } from "react-icons/gr";
// import { useLocation } from "react-router-dom";

// const ViewApplication = () => {
//   const [applicants, setApplicants] = useState([]);
//   const [error, setError] = useState(null);
//   const { id } = useParams();
//   const audio = new Audio("notification.mp3");
//   const location = useLocation();

//   const { forMargin } = location.state;
//   useEffect(() => {
//     const fetchApplicants = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:4000/api/application/getApplication/${id}`,
//           { withCredentials: true }
//         );

//         setApplicants(response.data.applicants);
//       } catch (error) {
//         console.error("Error fetching applicants:", error);
//         setError("Error fetching applicants");
//       }
//     };

//     fetchApplicants();
//   }, [id]);
//   const deleteApplication = async (idd) => {
//     const result = confirm("are you sure you want to delete?");
//     if (result) {
//       try {
//         const { data } = await axios.delete(
//           `http://localhost:4000/api/application/deleteApplication/${idd}`,
//           { withCredentials: true }
//         );

//         // Update the state to remove the deleted application
//         setApplicants((prevApplications) =>
//           prevApplications.filter((application) => application._id !== idd)
//         );
//         // applicationAction.setApplication(applicants.length)
//         audio.play();
//         toast.success(data.message);
//       } catch (error) {
//         audio.play();
//         toast.error("Failed to delete application.");
//       }
//     }
//   };
//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   const handleResumeClick = (resume) => {
//     window.open(resume, "_blank");
//   };
//   return (
//     <div className={`${style.applicants}`} style={{ marginTop: "-1px" }}>
//       <GrLinkPrevious
//         style={{ fontSize: "30px", marginLeft: "100px" }}
//         className={style.previous}
//         onClick={() => window.history.back()}
//       />
//       <ul className={`${forMargin && style.forMargin}`}>
//         {applicants.map((applicant, index) => (
//           <li key={index}>
//             <div style={{ display: "flex", gap: "50px" }}>
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: "10px",
//                 }}
//               >
//                 <h3 style={{ color: "#088395" }}>
//                   {applicant.firstName} {applicant.lastName}
//                 </h3>
//                 <p>
//                   Email:{" "}
//                   <a
//                     href={`mailto:${applicant.email}`}
//                     style={{ fontSize: "16px", color: "teal" }}
//                   >
//                     {" "}
//                     {applicant.email}
//                   </a>
//                 </p>
//                 <p>
//                   Contact Number:{" "}
//                   <span style={{ fontSize: "16px" }}>
//                     {" "}
//                     {applicant.contactNumber}
//                   </span>
//                 </p>
//                 <p>
//                   Current City:{" "}
//                   <span style={{ fontSize: "16px" }}>
//                     {" "}
//                     {applicant.currentCity}
//                   </span>
//                 </p>
//                 <p>
//                   Cover Letter:{" "}
//                   <span style={{ fontSize: "16px" }}>
//                     {" "}
//                     {applicant.coverLetter}
//                   </span>
//                 </p>
//                 <div className={style.btn}>
//                   <MdDelete
//                     onClick={() => deleteApplication(applicant._id)}
//                     style={{ fontSize: "40px" }}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <iframe
//                   src={applicant.resume}
//                   height="200px"
//                   title="Resume PDF"
//                 ></iframe>
//                 <button
//                   onClick={() => {
//                     handleResumeClick(applicant.resume);
//                   }}
//                   className={style.resumeFullimg}
//                 >
//                   View Full Resume
//                 </button>
//               </div>
//             </div>
//           </li>
//         ))}
//       </ul>
//       {applicants.length <= 0 && <h1>No applications</h1>}
//     </div>
//   );
// };

// export default ViewApplication;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import style from "../../module/Application.module.css";
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
    <div className={style.applicants} style={{ marginTop: "0px" }}>
      <GrLinkPrevious
        className={style.previous}
        onClick={() => window.history.back()}
      />
      <ul className={`${forMargin && style.forMargin}`}>
        {applicants.map((applicant, index) => (
          <li key={index} className={style.applicantCard}>
            <div className={style.leftInfo}>
              <h3>
                {applicant.firstName} {applicant.lastName}
              </h3>
              <p>
                Email:{" "}
                <a
                  href={`mailto:${applicant.email}`}
                  className={style.emailLink}
                >
                  {applicant.email}
                </a>
              </p>
              <p>Contact Number: {applicant.contactNumber}</p>
              <p>Current City: {applicant.currentCity}</p>
              <p>Cover Letter: {applicant.coverLetter}</p>
              <div className={style.btn}>
                <MdDelete onClick={() => deleteApplication(applicant._id)} />
              </div>
            </div>

            <div className={style.resumeSection}>
              <iframe
                src={applicant.resume}
                className={style.resumeIframe}
                title="Resume PDF"
              />
              <button
                onClick={() => handleResumeClick(applicant.resume)}
                className={style.resumeFullimg}
              >
                View Full Resume
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* <ul className={forMargin ? style.forMargin : ""}>
        {applicants.map((applicant, index) => (
          <li key={index} className={style.applicantCard}>
            <div className={style.applicantInfo}>
              <div className={style.leftInfo}>
                <h3>
                  {applicant.firstName} {applicant.lastName}
                </h3>
                <p>
                  Email:{" "}
                  <a
                    className={style.emailLink}
                    href={`mailto:${applicant.email}`}
                  >
                    {applicant.email}
                  </a>
                </p>
                <p>
                  Contact Number: <span>{applicant.contactNumber}</span>
                </p>
                <p>
                  Current City: <span>{applicant.currentCity}</span>
                </p>
                <p>
                  Cover Letter: <span>{applicant.coverLetter}</span>
                </p>
                <div className={style.btn}>
                  <MdDelete onClick={() => deleteApplication(applicant._id)} />
                </div>
              </div>

              <div className={style.resumeSection}>
                <iframe
                  src={applicant.resume}
                  className={style.resumeIframe}
                  title="Resume PDF"
                ></iframe>
                <button
                  onClick={() => handleResumeClick(applicant.resume)}
                  className={style.resumeFullimg}
                >
                  View Full Resume
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul> */}

      {applicants.length === 0 && (
        <h1 className={style.noApplications}>No applications</h1>
      )}
    </div>
  );
};

export default ViewApplication;
