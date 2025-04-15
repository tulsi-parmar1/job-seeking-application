import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import style from "../../module/PostJob.module.css";

function PostJob() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [requirements, setRequirements] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const [categories, setCategories] = useState("");
  const [logo, setLogo] = useState(null);

  const [loader, setLoader] = useState(false);

  const isAuthorized = localStorage.getItem("isAuthorized") === "true";
  const { users } = useSelector((state) => state.user);

  const [value, setValue] = useState("");
  const [value2, setValue2] = useState("");
  const [value3, setValue3] = useState("");
  const audio = new Audio("notification.mp3");
  useEffect(
    () => {
      // if (!isAuthorized) {
      //   navigate("/recruiterlogin");
      // }

      if (users.role !== "recruiter") {
        console.log("hey inside this");
        navigate("/recruiterlogin");
      }
    },
    [users, navigate],
    []
  );
  const handleJobPost = async (e) => {
    setLoader(true);
    e.preventDefault();
    if (logo) {
      const allowedImageTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
      ];

      if (!allowedImageTypes.includes(logo.type)) {
        toast.error(
          "Only image files (jpg, jpeg, png, webp) are allowed for logo."
        );
        setLoader(false);
        return;
      }
    }
    if (Number(salaryMax) < Number(salaryMin)) {
      toast.error(
        "Maximum salary must be greater than or equal to minimum salary."
      );
      setLoader(false);
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("categories", categories);
    formData.append("company", company);
    formData.append("location", location);
    formData.append("employmentType", employmentType);
    formData.append("salaryRangeMin", salaryMin);
    formData.append("salaryRangeMax", salaryMax);
    formData.append("requirements", requirements);
    formData.append("responsibilities", responsibilities);

    formData.append("contactEmail", contactEmail);
    if (logo) {
      formData.append("logo", logo);
    }
    console.log(requirements);
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/job/postJob",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      audio.play();
      toast.success(data.message);
      navigate("/profile/job/me");
      setLoader(false);
    } catch (error) {
      console.log(error);
      audio.play();
      toast.error(error.response.data.message);
      setLoader(false);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handleChange = (content) => {
    setValue(content);
    setRequirements(content);
  };
  const handleChange2 = (content) => {
    setValue2(content);
    setResponsibilities(content);
  };
  const handleChange3 = (content) => {
    setValue3(content);
    setDescription(content);
  };
  const handlefilechange = (e) => {
    const logo2 = e.target.files[0];
    setLogo(logo2);
  };

  return (
    <>
      <div className={style.job_post_page}>
        <div className={style.container}>
          <h1>Post a job for free </h1>
          {/* <p>increase the quality of you hire</p> */}
          <p
            style={{
              marginTop: "8px",
              color: "rgb(79, 77, 77)",
              fontSize: "17px",
              textAlign: "center",
            }}
          >
            increase your company's potential with one job post
          </p>
          <form onSubmit={handleJobPost} className={style.formm}>
            <div className="wrapper">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
              />
            </div>
            <p style={{ float: "left" }}>description</p>
            <div className="wrapper">
              <ReactQuill
                value={value3}
                onChange={handleChange3}
                placeholder="description ..."
              />
            </div>
            {/* <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
              /> */}

            <div className="wrapper">
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company"
              />
            </div>
            <div className="wrapper">
              <select
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
              >
                <option value="">Select categories</option>
                <option value="Information Technology (IT)">
                  Information Technology (IT)
                </option>
                <option value="Healthcare">Healthcare</option>

                <option value="Education">Education</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Customer Service">Customer Service</option>

                <option value="Accountant">Accountant</option>
              </select>
            </div>
            <div className="wrapper">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location/Address"
              />
            </div>
            <div className="wrapper">
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
              >
                <option value="">Select Employement Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>

                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote Job">Remote Job</option>
              </select>
            </div>
            <div className="wrapper">
              <input
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                placeholder="Salary Min"
              />
            </div>
            <div className="wrapper">
              <input
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                placeholder="Salary Max"
              />
            </div>
            <p>requirements</p>
            <div className="wrapper">
              <ReactQuill
                value={value}
                onChange={handleChange}
                placeholder="Requirements..."
              />
            </div>
            <p>responsibilities</p>
            <div className="wrapper">
              <ReactQuill
                value={value2}
                onChange={handleChange2}
                placeholder="Responsibilities ..."
              />
            </div>
            <div className="wrapper">
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Contact Email"
              />
            </div>

            <div className="logo">
              <p>Comapny Logo: </p> <br />
              <input type="file" name="logo" onChange={handlefilechange} />
            </div>
            <div className={style.btn}>
              <button type="submit" disabled={loader}>
                Create Job{" "}
                <span className={`${loader && style.loading}`}></span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default PostJob;
