import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { useEffect } from "react";
import Loader from "../Layout/Loader.jsx";
import JobDetailSub from "./JobDetailSub";
import JobLayout from "../Home/JobLayout.jsx";
const SimilarJobs = ({ id }) => {
  const [similarjob, setSimilarJob] = useState([]);
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/job/similarJobs/${id}`,
          { withCredentials: true }
        );
        setSimilarJob(res.data);
        setLoader(false);
      } catch (error) {
        toast.error(error.response.data.message);
        setLoader(false);
      }
    };
    fetchSimilar();
  }, []);
  return (
    <>
      {loader && <Loader></Loader>}
      {similarjob != 0 && (
        <>
          <h3 style={{ marginBottom: "10px" }}>Similar Job</h3>
          <JobLayout jobs={similarjob} similar={true}></JobLayout>
        </>
      )}
    </>
  );
};
export default SimilarJobs;
