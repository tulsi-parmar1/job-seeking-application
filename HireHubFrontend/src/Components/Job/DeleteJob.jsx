import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeleteJob = () => {
  const { isAuthorized } = useSelector((state) => state.user);
  const { id } = useParams(); // Ensure useParams is used correctly
  const navigate = useNavigate();

  useEffect(() => {
    const deleteJob = async () => {
      if (!isAuthorized) {
        navigate("/");
        return; // Exit if not authorized
      }

      try {
        const { data } = await axios.delete(
          `http://localhost:4000/api/job/deleteJob/${id}`,
          { withCredentials: true }
        );
        toast.success(data.message);
        navigate("/profile/job/me"); // Redirect after deletion
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      }
    };

    deleteJob();
  }, [id, isAuthorized, navigate]);

  return (
    <>
      <div>Deleting job...</div> {/* Updated text for clarity */}
    </>
  );
};

export default DeleteJob;
