import React, { useEffect, useState } from "react";
import style from "../../module/Admin.module.css";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PieGraph = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/admin/getMonthlyRegistrations",
          { withCredentials: true }
        );

        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const pieData = data.map((item) => ({
    name: item.month,
    value: item.users,
  }));

  const COLORS = [
    "#64FFDA", // Light Teal
    "#FFAB91", // Soft Peach
    "#81D4FA", // Light Sky Blue
    "#A5D6A7", // Soft Green
    "#FFD54F", // Pastel Yellow
    "#F48FB1", // Light Pink
    "#CE93D8", // Soft Purple
    "#FFCC80", // Light Orange
    "#B39DDB", // Muted Lavender
    "#E6EE9C", // Soft Lime
    "#80CBC4", // Pale Aqua
    "#FFECB3", // Light Golden
  ];

  return (
    <div className={style.piechartContainer}>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value" // The key to use for the pie chart values
            nameKey="name" // The key for the name of each section
            outerRadius={150} // Adjust outer radius for size
            fill="#8884d8"
            label="users"
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]} //ensures that if there are more slices than colors, it repeats colors cyclically.
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieGraph;
