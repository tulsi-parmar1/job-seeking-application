import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import style from "../../module/Profile.module.css";
import { toast } from "react-toastify";
import { FaSchool } from "react-icons/fa";
import { IoAddOutline } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { userAction } from "../../Slices/userSlice";
import { useDispatch } from "react-redux";
import { FaPhone } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import Loader from "../Layout/Loader.jsx";

const Profile = () => {
  // const { isAuthorized } = useSelector((state) => state.user);
  const isAuthorized = localStorage.getItem("isAuthorized") === "true";
  const [degree, setDegree] = useState("");
  const [tenth, setTenth] = useState("");
  const [twelth, setTwelth] = useState("");
  const [sdegree, setSDegree] = useState("");
  const [stenth, setSTenth] = useState("");
  const [stwelth, setSTwelth] = useState("");
  const [edegree, setEDegree] = useState("");
  const [etenth, setETenth] = useState("");
  const [etwelth, setETwelth] = useState("");
  const [skills, setSkills] = useState("");
  const [about, setAbout] = useState("");
  const audio = new Audio("notification.mp3");
  const [hidden, setHidden] = useState(true);
  const { users } = useSelector((state) => state.user);
  const [profile, setProfile] = useState();
  const [loader, setLoader] = useState(false);
  const { profilee } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch profile and profile picture on component mount
  useEffect(
    () => {
      // if (!isAuthorized) {
      //   navigate("/login");
      //   return;
      // }
      window.scrollTo(0, 0);
    },
    [isAuthorized],
    []
  );
  useEffect(() => {
    const getInfo = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/profile/getInfo",
          { withCredentials: true }
        );
        setProfile(data.profile);
        if (data.profile) {
          // Initialize form fields with existing profile data
          setDegree(data.profile.education.degree.name || "");
          setTenth(data.profile.education.tenth.name || "");
          setTwelth(data.profile.education.twelth.name || "");
          setSDegree(data.profile.education.degree.startdate || "");
          setSTenth(data.profile.education.tenth.startdate || "");
          setSTwelth(data.profile.education.twelth.startdate || "");
          setEDegree(data.profile.education.degree.enddate || "");
          setETenth(data.profile.education.tenth.enddate || "");
          setETwelth(data.profile.education.twelth.enddate || "");
          setSkills(data.profile.skills.join(", ") || "");
          setAbout(data.profile.about || "");
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    const getProfile = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/profile/getProfile`,
          { withCredentials: true }
        );
        dispatch(userAction.setProfile(data.url));
        console.log(data.url);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    getInfo();
    getProfile();
  }, [isAuthorized, navigate]);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("degree", degree);
    formData.append("tenth", tenth);
    formData.append("twelth", twelth);
    formData.append("sdegree", sdegree);
    formData.append("stenth", stenth);
    formData.append("stwelth", stwelth);
    formData.append("edegree", edegree);
    formData.append("etenth", etenth);
    formData.append("etwelth", etwelth);
    formData.append(
      "skills",
      skills.split(",").map((skill) => skill.trim())
    );
    formData.append("about", about);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/profile/postInfo",
        formData,
        {
          withCredentials: true,
        }
      );
      audio.play();
      toast.success(response.data.message);

      // Update the profile state with the new data after submission
      setProfile((prevProfile) => ({
        ...prevProfile,
        education: {
          degree: {
            name: degree,
            startdate: sdegree,
            enddate: edegree,
          },
          tenth: {
            name: tenth,
            startdate: stenth,
            enddate: etenth,
          },
          twelth: {
            name: twelth,
            startdate: stwelth,
            enddate: etwelth,
          },
        },
        skills: skills.split(",").map((skill) => skill.trim()),
        about: about,
      }));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleOnClick = () => {
    setHidden(!hidden);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0]; // Get the file directly
    const yess = confirm("Are you sure you want to upload this file?");
    if (yess) {
      const fm = new FormData();
      fm.append("profile", file);
      setLoader(true);
      try {
        const response = await axios.post(
          "http://localhost:4000/api/profile/profileChange",
          fm,
          { withCredentials: true }
        );
        setLoader(false);
        dispatch(userAction.setProfile(response.data.profile));
        audio.play();
        toast.success(response.data.message);
        dispatch(userAction.setUser(response.data.user));
      } catch (error) {
        toast.error(error.response.data);
      }
    }
  };

  const handleSavedJobs = async (e) => {
    navigate("/savedjobs");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <div className={style.formcontainer} style={{ margin: "20px 30px" }}>
        <div className={style.profile}>
          <div className={style.imageformate}>
            {loader ? (
              <Loader></Loader>
            ) : profilee ? (
              <img src={profilee} alt="Profile" />
            ) : (
              <img src="profile.png" alt="Profile" />
            )}
          </div>
          <p
            style={{ fontWeight: "bold", fontSize: "26px" }}
            className={style.name}
          >
            {users.name}
          </p>

          <label htmlFor="file-input" className={style.addProfile}>
            <IoAddOutline />
          </label>

          <div className={style.info}>
            {users.email && <MdEmail />}
            <p>{users.email}</p>
            <p>
              {users.phone && <FaPhone />}

              {users.phone}
            </p>
          </div>
          <input
            type="file"
            name="profile"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="file-input"
          />
        </div>

        <div className={style.profileinfo}>
          {about && (
            <>
              <hr style={{ height: "10px", backgroundColor: "white" }} />
              <h1 style={{ marginTop: "20px" }}> About</h1>
              <div style={{ borderRadius: "10px" }} className={style.about2}>
                <div className={style.about}>
                  <p className={style.about}>{about}</p>
                </div>
              </div>
            </>
          )}
          {skills.length > 0 && (
            <>
              <hr style={{ height: "10px", backgroundColor: "white" }} />
              <h1 style={{ marginTop: "20px" }}>Skills</h1>
              <div className={style.about2} style={{ borderRadius: "10px" }}>
                <div className={style.skills}>
                  <p className={style.skills}>{skills}</p>
                </div>
              </div>
            </>
          )}
          {(tenth || twelth || degree) && (
            <>
              <hr style={{ height: "10px", backgroundColor: "white" }} />
              <h1 style={{ marginTop: "10px" }}>education</h1>
            </>
          )}
          {tenth && (
            <div style={{ margin: "20px" }} className={style.tenth}>
              <FaSchool style={{ fontSize: "35px" }} />
              <div>
                <h4>Tenth</h4>
                <p>{tenth}</p>
                <p style={{ fontSize: "15px" }}>
                  {formatDate(stenth)} - {formatDate(etenth)}
                </p>
              </div>
            </div>
          )}
          {twelth && (
            <div style={{ margin: "20px" }} className={style.tenth}>
              <FaSchool style={{ fontSize: "35px" }} />
              <div>
                <h5>Twelth</h5>
                <p>{twelth}</p>
                <p style={{ fontSize: "15px" }}>
                  {formatDate(stwelth)} - {formatDate(etwelth)}
                </p>
              </div>
            </div>
          )}
          {degree && (
            <div style={{ margin: "20px" }} className={style.tenth}>
              <FaSchool style={{ fontSize: "35px" }} />
              <div>
                <h4>College</h4>
                <p>{degree}</p>
                <p style={{ fontSize: "15px" }}>
                  {formatDate(sdegree)} - {formatDate(edegree)}
                </p>
              </div>
            </div>
          )}
          <hr style={{ height: "10px", backgroundColor: "white" }} />
          <div className={style.savedjobs}>
            <FaBookmark style={{ fontSize: "26px" }} />
            <div>
              <h3 onClick={handleSavedJobs} style={{ display: "inline" }}>
                Saved Jobs{" "}
              </h3>
              <p>keep track of your favourite jobs</p>
            </div>
          </div>
        </div>

        <a onClick={handleOnClick} href="#">
          <h2 style={{ color: "blue" }}>Add Profile section</h2>
        </a>
        <form
          onSubmit={handleOnSubmit}
          className={`${style.form} ${hidden ? style.hide : style.show}`}
        >
          <label>
            Degree:
            <input
              type="text"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
            />
          </label>
          <label>
            Degree Start Date:
            <input
              type="date"
              value={sdegree}
              onChange={(e) => setSDegree(e.target.value)}
            />
          </label>
          <label>
            Degree End Date:
            <input
              type="date"
              value={edegree}
              onChange={(e) => setEDegree(e.target.value)}
            />
          </label>

          <label>
            Tenth:
            <input
              type="text"
              value={tenth}
              onChange={(e) => setTenth(e.target.value)}
            />
          </label>
          <label>
            Tenth Start Date:
            <input
              type="date"
              value={stenth}
              onChange={(e) => setSTenth(e.target.value)}
            />
          </label>
          <label>
            Tenth End Date:
            <input
              type="date"
              value={etenth}
              onChange={(e) => setETenth(e.target.value)}
            />
          </label>

          <label>
            Twelth:
            <input
              type="text"
              value={twelth}
              onChange={(e) => setTwelth(e.target.value)}
            />
          </label>
          <label>
            Twelth Start Date:
            <input
              type="date"
              value={stwelth}
              onChange={(e) => setSTwelth(e.target.value)}
            />
          </label>
          <label>
            Twelth End Date:
            <input
              type="date"
              value={etwelth}
              onChange={(e) => setETwelth(e.target.value)}
            />
          </label>
          <label>
            Skills (comma separated):
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </label>
          <label>
            About:
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
          </label>
          <button type="submit" className={style.submit}>
            Add Info
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
