import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import style from "../../module/JobDetail.module.css";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { GrFormPrevious } from "react-icons/gr";
import { GrLinkPrevious } from "react-icons/gr";
import { IoLocation } from "react-icons/io5";
import { useEffect } from "react";
import { LuDot } from "react-icons/lu";
import { toast } from "react-toastify";
import axios from "axios";
import { userAction } from "../../Slices/userSlice";
import { useState } from "react";
import { FaRegBookmark } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa6";
const ProfileJobDetail = ({ job, applicants, id }) => {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  console.log(job.requirements);
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "100px",
        }}
      >
        <div>
          <GrLinkPrevious
            style={{ fontSize: "30px" }}
            className={style.previous}
            onClick={() => window.history.back()}
          />
        </div>
        <div className={style.themain}>
          <div className={style.first}>
            <h1>{job.title}</h1>
            <div style={{ display: "flex", gap: "20px" }}>
              <p>
                {applicants > 0 && (
                  <button
                    onClick={() =>
                      navigate(
                        `/profile/job/me/application/viewapplication/${id}`
                      )
                    }
                  >
                    view applicants
                  </button>
                )}
              </p>
            </div>
          </div>
          <div className={style.second}>
            <div className={style.logo}>
              {job.logo && <img src={job.logo.url} alt={`${job.title} logo`} />}
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <div style={{ display: "flex", gap: "50px" }}>
                <p style={{ color: "#088395", fontWeight: "bold" }}>
                  {job.company}
                </p>
                <p>
                  <IoLocation />
                  {job.location}
                </p>
              </div>
              <div className={style.threedesign}>
                <p>{job.employmentType}</p>
                <p>intership</p>
                <p>experience</p>
              </div>
            </div>
          </div>
          <div>
            <p style={{ fontWeight: "bold" }}>Description:</p>
            <p style={{ fontSize: "17px" }}>{job.description}</p>
          </div>
          <div>
            {job.requirements && (
              <>
                <p style={{ fontWeight: "bold" }}>Requirements: </p>
                <div dangerouslySetInnerHTML={{ __html: job.requirements }} />
              </>
            )}
          </div>
          <div>
            {job.responsibilities && (
              <>
                <p style={{ fontWeight: "bold" }}>Responsibilities: </p>
                <div
                  dangerouslySetInnerHTML={{ __html: job.responsibilities }}
                />
              </>
            )}
          </div>
          <div>
            <p style={{ fontWeight: "bold" }}>Qualification</p>
            <p>Graduated</p>
          </div>
          <div>
            <p style={{ fontWeight: "bold" }}>Salary Range:</p>
            <div>
              <p>
                {" "}
                <LiaRupeeSignSolid />
                <span>
                  {job.salaryRange
                    ? `${job.salaryRange.min}-${job.salaryRange.max}`
                    : "N/A"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ProfileJobDetail;
