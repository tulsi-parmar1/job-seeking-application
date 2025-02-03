import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import { GrLinkPrevious } from "react-icons/gr";
import style from "../../module/UpdateJob.module.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const audio = new Audio("notification.mp3");
const UpdateJob = () => {
  const [job, setJob] = useState({});
  const [loader, setLoader] = useState(false);
  // const { isAuthorized } = useSelector((state) => state.user);
  const isAuthorized = localStorage.getItem("isAuthorized") === "true";
  const { id } = useParams();
  const navigate = useNavigate();

  // Update the job object directly when quill content changes
  const handleQuillChange = (field, value) => {
    setJob((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "salaryRange-min") {
      setJob((prevState) => ({
        ...prevState,
        salaryRange: {
          ...prevState.salaryRange,
          min: value,
        },
      }));
    } else if (name === "salaryRange-max") {
      setJob((prevState) => ({
        ...prevState,
        salaryRange: {
          ...prevState.salaryRange,
          max: value,
        },
      }));
    } else {
      setJob((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Fetch job details
  useEffect(() => {
    if (!isAuthorized) {
      navigate("/login");
    }

    axios
      .get(`http://localhost:4000/api/job/${id}`, { withCredentials: true })
      .then((res) => {
        const jobData = res.data.job;
        setJob(jobData); // Set the fetched job data to the state
      })
      .catch((err) => {
        audio.play();
        toast.error(err.response.data.message);
      });
  }, []);

  // Update the job
  const handleUpdate = async (jobId) => {
    setLoader(true);
    try {
      const updateJob = { ...job };

      const { data } = await axios.put(
        `http://localhost:4000/api/job/updateJob/${jobId}`,
        updateJob,
        { withCredentials: true }
      );
      audio.play();
      toast.success(data.message);
      navigate(`/profile/job/me/${jobId}`);
      setLoader(false);
    } catch (error) {
      audio.play();
      toast.error(error.response?.data?.message || error.message);
      setLoader(false);
    }
  };

  return (
    <>
      <GrLinkPrevious
        style={{ fontSize: "30px", marginLeft: "100px" }}
        className={style.previous}
        onClick={() => window.history.back()}
      />
      <div className="jobDetail page">
        <div className={style.container}>
          <h1>Update Job</h1>
          <div className={style.banner}>
            <p>
              Title:{" "}
              <input
                type="text"
                name="title"
                value={job.title || ""}
                onChange={handleInputChange}
              />
            </p>
            <p>
              Description:
              <ReactQuill
                value={job.description || ""}
                onChange={(value) => handleQuillChange("description", value)}
                placeholder="description..."
                style={{ backgroundColor: "white", border: "none" }}
              />
            </p>
            <p>
              Contact Email:
              <input
                type="text"
                name="contactEmail"
                value={job.contactEmail || ""}
                onChange={handleInputChange}
              />
            </p>
            <p>
              Employment Type:
              <select
                value={job.employmentType || ""}
                name="employmentType"
                onChange={handleInputChange}
                style={{ marginLeft: "20px" }}
              >
                <option value="">Select Employement Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>

                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote Job">Remote Job</option>
              </select>
            </p>
            <select
              name="categories"
              value={job.categories || ""}
              onChange={handleInputChange}
            >
              <p>Select categories</p>
              <option value="">Select categories</option>
              <option value="Information Technology (IT)">
                Information Technology (IT)
              </option>
              <option value="Healthcare">Healthcare</option>

              <option value="Education">Education</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Customer Service">Customer Service</option>
            </select>
            <p>
              Salary:{" "}
              <span>
                {job.salaryRange ? (
                  <>
                    <input
                      type="text"
                      name="salaryRange-min"
                      value={job.salaryRange.min || ""}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="salaryRange-max"
                      value={job.salaryRange.max || ""}
                      onChange={handleInputChange}
                    />
                  </>
                ) : (
                  "N/A"
                )}
              </span>
            </p>
            <p>Requirements:</p>
            <ReactQuill
              value={job.requirements || ""}
              onChange={(value) => handleQuillChange("requirements", value)}
              placeholder="Requirements..."
              style={{ backgroundColor: "white", border: "none" }}
            />
            <p>Responsibilities:</p>
            <ReactQuill
              value={job.responsibilities || ""}
              onChange={(value) => handleQuillChange("responsibilities", value)}
              placeholder="Responsibilities..."
              style={{ backgroundColor: "white", border: "none" }}
            />
            <button onClick={() => handleUpdate(job._id)} disabled={loader}>
              Update
              <span className={`${loader && style.loading}`}></span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateJob;
