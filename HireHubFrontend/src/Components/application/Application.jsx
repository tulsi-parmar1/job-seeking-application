import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import style from "../../module/Application.module.css";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Layout/Loader.jsx";

function Application() {
  const { isAuthorized } = useSelector((state) => state.user);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [currentCity, setCurrentCity] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!isAuthorized) {
      navigate("/");
    }
  }, [isAuthorized]);

  const handleFileChange = (event) => {
    const resumeFile = event.target.files[0];
    if (resumeFile && resumeFile.type === "application/pdf") {
      setResume(resumeFile);
    } else {
      toast.error("Only PDF files are accepted for resume.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("firstName", firstName);
    formdata.append("lastName", lastName);
    formdata.append("email", email);
    formdata.append("contactNumber", contactNumber);
    formdata.append("currentCity", currentCity);
    formdata.append("coverLetter", coverLetter);
    formdata.append("resume", resume); // Ensure resume file is being appended correctly
    setLoader(true);
    try {
      const { data } = await axios.post(
        `http://localhost:4000/api/application/postApplication/${id}`,
        formdata,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setFirstName("");
      setLastName("");
      setContactNumber("");
      setCurrentCity("");
      setEmail("");
      setCoverLetter("");
      setResume(null); // Reset resume to null
      toast.success(data.message);
      setLoader(false);
    } catch (error) {
      console.log("error", error.message);
      setLoader(false);
    }
  };
  return (
    <>
      <section className={style.application} style={{ marginTop: "200px" }}>
        <div className={style.container}>
          <h3 style={{ textAlign: "center" }}>Application Form</h3>
          <form onSubmit={handleSubmit} enctype="multipart/form-data">
            <input
              type="text"
              placeholder="Your first name"
              value={firstName}
              name="firstName"
              onChange={(e) => setFirstName(e.target.value)}
              required // Add required attribute for better UX
            />
            <input
              type="text"
              placeholder="Your last name"
              value={lastName}
              name="lastName"
              onChange={(e) => setLastName(e.target.value)}
              required // Add required attribute for better UX
            />
            <input
              type="number"
              placeholder="Your contact number"
              value={contactNumber}
              name="contactNumber"
              onChange={(e) => setContactNumber(e.target.value)}
              required // Add required attribute for better UX
            />
            <input
              type="text"
              placeholder="Your current city"
              value={currentCity}
              name="currentCity"
              onChange={(e) => setCurrentCity(e.target.value)}
              required // Add required attribute for better UX
            />
            <input
              type="email"
              placeholder="Your email"
              value={email}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              required // Add required attribute for better UX
            />
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Cover letter"
              name="coverLetter"
              style={{ width: "100%", height: "50px", padding: "10px" }}
              required // Add required attribute for better UX
            ></textarea>
            <div>
              <label
                style={{
                  textAlign: "start",
                  display: "block",
                  fontSize: "20px",
                }}
              >
                Select resume:
              </label>
              <input
                type="file"
                accept="application/pdf"
                name="resume"
                onChange={handleFileChange}
                style={{ marginTop: "10px" }}
                required // Add required attribute for better UX
              />
            </div>
            <button type="submit" disabled={loader}>
              Send application
            </button>
            <span className={`${loader && style.loading}`}></span>
          </form>
        </div>
      </section>
    </>
  );
}
export default Application;
