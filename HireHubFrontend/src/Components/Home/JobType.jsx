import style from "../../module/JobType.module.css";
import { FaSuitcase } from "react-icons/fa";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const JobType = () => {
  const mainRef = useRef();
  const textRef = useRef();
  const navigate = useNavigate();

  const [fulltimeJobsL, setfulltimeJobsL] = useState();
  const [parttimeJobsL, setparttimeJobsL] = useState();
  const [contractJobsL, setcontractJobsL] = useState();
  const [internshipJobsL, setinternshipJobsL] = useState();
  const [remoteJobsL, setremoteJobsL] = useState();

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/job/jobtype", {
        withCredentials: true,
      })
      .then((res) => {
        setfulltimeJobsL(res.data.fullTimeLength);
        setparttimeJobsL(res.data.partTimeLength);
        setcontractJobsL(res.data.contractLength);
        setinternshipJobsL(res.data.internshipLength);
        setremoteJobsL(res.data.remoteJobLength);
        console.log(res);
      })
      .catch((error) => {
        console.error("Error fetching job counts by type:", error);
        console.log(error.response.data.message);
      });
  }, []);
  const details = [
    {
      id: 1,
      title: fulltimeJobsL,
      subTitle: "Full-time",
      icon: <FaSuitcase />,
    },
    {
      id: 2,
      title: remoteJobsL,
      subTitle: "Remote Job",
      icon: <FaSuitcase />,
    },
    {
      id: 3,
      title: internshipJobsL,
      subTitle: "Internship",
      icon: <FaSuitcase />,
    },
    {
      id: 4,
      title: contractJobsL,
      subTitle: "Contract Job",
      icon: <FaSuitcase />,
    },
    {
      id: 5,
      title: parttimeJobsL,
      subTitle: "Part-time Job",
      icon: <FaSuitcase />,
    },
  ];

  return (
    <>
      <div className={style.main2} ref={mainRef}>
        <h1 className={style.h11} ref={textRef}>
          Explore Jobs by Type
        </h1>
        <div className={style.main}>
          {details.map((element) => {
            return (
              <div
                key={element.id}
                className={style.jobtype}
                onClick={() => {
                  navigate(`/jobtype/${element.subTitle}`);
                }}
              >
                <span className={style.icon}>{element.icon}</span>
                <div className={style.info}>
                  <p>{element.subTitle}</p>
                  <p style={{ fontSize: "15px" }} className={style.ptag}>
                    {element.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default JobType;
