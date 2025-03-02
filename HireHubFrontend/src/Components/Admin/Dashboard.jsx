import React from "react";
import DashboardSidebar from "./DashboardSidebar";
import style from "../../module/Admin.module.css";
import { Outlet } from "react-router-dom";
import LineGraph from "./LineGraph";

function Dashboard() {
  return (
    <div style={{ display: "flex", gap: "20px" }} className={style.dashboard}>
      <DashboardSidebar></DashboardSidebar>
      <Outlet></Outlet>
    </div>
  );
}

export default Dashboard;
