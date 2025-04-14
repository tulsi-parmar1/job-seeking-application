import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "../../module/Admin.module.css";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const LineGraph = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(
          "     http://localhost:4000/api/admin/getMonthlyRegistrations",
          { withCredentials: true }
        );

        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className={style.linegraph}>
      <ResponsiveContainer width="90%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#444" /> {/* boxes that are display  */}
          <XAxis dataKey="month" stroke="#fff" /> {/* represent x axis */}
          <YAxis stroke="#fff" domain={[0, "dataMax"]} />
          <Tooltip
            contentStyle={{ backgroundColor: "#333", color: "#fff" }}
          />{" "}
          <Legend wrapperStyle={{ color: "#fff" }} />{" "}
          {/* explain about graph for ex:users graph  */}
          <Line
            type="monotone"
            dataKey="users"
            stroke="#00c49f"
            strokeWidth={3}
            dot={{ fill: "#00c49f" }}
          />{" "}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineGraph;
