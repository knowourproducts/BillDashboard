import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js";
import "chart.js/auto";
import { BarController, PieController, CategoryScale, LinearScale, Title } from "chart.js";
import chartConfig from "./ChartConfig";

// Register required scales and controllers
ChartJS.register(BarController, PieController, CategoryScale, LinearScale, Title);

const RevenueChart = () => {
  const [revenueData, setRevenueData] = useState({
    labels: [],
    datasets: [
      {
        label: "Monthly Revenue",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });

  const [chartType, setChartType] = useState("bar"); // Default to bar chart

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        // Replace the URL with your Google Apps Script endpoint
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbzifNZRq5UdVS6kgs5-jlv7cksOJRCrS3fMha7PvhHreere_ln7ZRyM30TAkomfJmpf/exec"
        );

        if (response.ok) {
          const data = await response.json();
          const months = data.map((entry) => entry.month);
          const amounts = data.map((entry) => entry.amount);

          setRevenueData({
            labels: months,
            datasets: [
              {
                label: "Monthly Revenue",
                data: amounts,
                backgroundColor: ((count) => {
                  // Generate an array of random colors
                  const colors = [];
                  for (let i = 0; i < count; i++) {
                    colors.push(getRandomColor());
                  }
                  return colors;
                })(months.length), // Generate random colors
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          });
        } else {
          // Handle API request error
        }
      } catch (error) {
        // Handle fetch error
      }
    };

    fetchRevenueData();
  }, []);

  const getRandomColor = () => {
    // Function to generate a random color
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.7)`;
  };


  const options = {
    scales: {
      x: [
        {
          type: "category",
          title: {
            display: true,
            text: "Month",
          },
        },
      ],
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Revenue",
        },
      },
    },
    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
      },
    },
  };

  const containerStyle = {
    padding: "20px",
  };

  const toggleChartType = () => {
    // Toggle between bar and pie chart
    setChartType(chartType === "bar" ? "pie" : "bar");
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: "20px" }}>Monthly Revenue {chartType === "bar" ? "Bar" : "Pie"} Chart</h1>
      <button onClick={toggleChartType}>Switch to {chartType === "bar" ? "Pie" : "Bar"}</button>
      {chartType === "bar" ? (
        <div style={{ height: "400px", width: "600px" }}>
          <Bar data={revenueData} options={{ ...chartConfig, ...options }} />
        </div>
      ) : (
        <div style={{ height: "400px", width: "600px" }}>
          <Pie data={revenueData} options={{ ...chartConfig, ...options }} />
        </div>
      )}
    </div>
  );
};

export default RevenueChart;
