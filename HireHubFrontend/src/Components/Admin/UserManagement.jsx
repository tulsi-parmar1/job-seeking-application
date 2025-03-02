import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "../../module/Admin.module.css";
import profile from "../../../public/profile.png";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { useLocation } from "react-router-dom";
function UserManagement() {
  const location = useLocation();
  const data = location.state || [];
  const users = data.jobseeker || data.recruiter || data.users || [];
  console.log(users);
  const handleDeleteBtn = async (id) => {
    const result = confirm("are you sure you want to delete this user??");
    if (result) {
      try {
        const { data } = await axios.delete(
          `http://localhost:4000/api/admin/delete-user/${id}`,
          { withCredentials: true }
        );
        toast.success(data.message);
        setUsers((prevusers) => prevusers.filter((user) => user._id !== id));
      } catch (error) {
        alert(error.reponse.data.message);
      }
    }
  };
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        width: "80%",
        marginTop: "10px",
        marginBottom: "10px",
      }}
    >
      {/* Scrollable User List */}
      <div
        style={{
          overflowY: "auto",
          maxHeight: "100vh",
          paddingRight: "10px",
          width: "100%",
        }}
      >
        {users.map((item, index) => (
          <div key={index} className={style.usersData}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <div>
                {item?.profile?.profile.url ? (
                  <img src={item.profile.profile.url} alt="User Profile" />
                ) : (
                  <img src={profile} alt="Default Profile" />
                )}
              </div>
              <div>
                <p>{item.name}</p>
                <p style={{ color: "gray", fontSize: "17px" }}>{item.email}</p>
              </div>
            </div>
            <div className={style.delete}>
              <MdDelete onClick={() => handleDeleteBtn(item._id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserManagement;
