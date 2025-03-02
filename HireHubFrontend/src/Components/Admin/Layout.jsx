import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "../../module/Admin.module.css";
import LineGraph from "./LineGraph";
import PieGraph from "./PieChart";
import { useNavigate } from "react-router-dom";
function Layout() {
  const [totalJobSeeker, setJobSeeker] = useState("");
  const [totalRecruiter, setRecruiter] = useState("");
  const [totalUsers, setTotalUser] = useState("");
  const [jobsLength, setJobLength] = useState("");
  const [totalApplications, setTotalApplications] = useState("");
  const [users, setUsers] = useState([]);
  const [jobseeker, setJobSeekers] = useState([]);
  const [recruiter, setRecruiters] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/admin/getUsers",
          { withCredentials: true }
        );

        setJobSeeker(data.totalJobSeeker);
        setRecruiter(data.totalRecruiter);
        setTotalUser(data.totalUsers);
        setUsers(data.users);
        setRecruiters(data.recruiter);
        setJobSeekers(data.jobSeeker);
      } catch (error) {
        console.log(error);
      }
    }
    async function fetchJobData() {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/admin/get-jobs",
          { withCredentials: true }
        );
        setJobLength(data.jobsLength);
        setTotalApplications(data.applications);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    fetchJobData();
  }, []);

  return (
    <div style={{ width: "80%" }}>
      <div className={style.layout}>
        <div
          className={style.box}
          onClick={() =>
            navigate("/admin/dashboard/userManagement", { state: { users } })
          }
        >
          <h3 className={style.boxTitle}>Total Users</h3>
          <p className={style.count}>{totalUsers}</p>
        </div>
        <div
          className={style.box}
          onClick={() =>
            navigate("/admin/dashboard/userManagement", {
              state: { jobseeker },
            })
          }
        >
          <h3 className={style.boxTitle}>Total Job Seekers</h3>
          <p className={style.count}>{totalJobSeeker}</p>
        </div>
        <div
          className={style.box}
          onClick={() =>
            navigate("/admin/dashboard/userManagement", {
              state: { recruiter },
            })
          }
        >
          <h3 className={style.boxTitle}>Total Recruiters</h3>
          <p className={style.count}>{totalRecruiter}</p>
        </div>
      </div>
      <div className={style.graphContainer}>
        <div className={style.graphWrapperline}>
          <LineGraph />
        </div>
        <div className={style.graphWrapper}>
          <PieGraph />
        </div>
      </div>
      <div style={{ display: "flex", gap: "20px" }}>
        <div className={style.dashboardSection}>
          <h1>Total Jobs</h1>
          <div className={style.number}>{jobsLength}</div>
        </div>
        <div className={style.dashboardSection}>
          <h1>Total Applications</h1>
          <div className={style.number}>{totalApplications}</div>
        </div>

        <div className={style.quoteSection}>
          "HireHub is where opportunities meet talent. Whether you're looking
          for your next job or the perfect candidate, we make the connection
          seamless and effortless."
          <div className={style.author}>- Tulsi parmar</div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
