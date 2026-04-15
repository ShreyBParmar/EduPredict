import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar, Doughnut } from "react-chartjs-2";

// ✅ Register EVERYTHING (including plugin)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);


const Analytics = () => {
  const analyticsData = {
    labels: ["Attendance", "Marks", "Pass %"],
    datasets: [
      {
        label: "Overview",
        data: [72, 75, 90],
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"]
      }
    ]
  };

  // ---------------- RISK DISTRIBUTION (STATIC DEMO) ----------------
  const riskDistribution = {
    labels: ["Low Risk", "Medium Risk", "High Risk"],
    datasets: [
      {
        data: [200, 500, 150],
        backgroundColor: ["#22C55E", "#F59E0B", "#EF4444"]
      }
    ]
  };

  const baseOptions = {
    responsive: true,
    animation: false,
    plugins: {
      legend: {
        position: "bottom"
      }
    }
  };

  // ✅ Doughnut specific (with labels)
 const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "5%",

  layout: {
    padding: 10
  },

  plugins: {
    legend: {
      position: "bottom"
    },

    datalabels: {
      color: "#fff", // 🔥 white text (important for visibility)
      font: {
        weight: "bold",
        size: 12
      },

      formatter: (value, context) => {
        if (value === 0) return ""; // hide zero

        const label = context.chart.data.labels[context.dataIndex];

        // 🔥 show short label (avoid clutter)
        return `${label.split(" ")[0]}\n${value}`;
      },

      anchor: "center",
      align: "center"
    }
  }
};

  return (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
                    {/* Bar Chart */}
                    <div className="bg-white p-4 rounded-xl shadow-md">
                      <h2 className="text-lg font-semibold mb-2">
                        Class Performance Metrics
                      </h2>
                      <div className="h-[300px]">
                        <Bar
                          data={analyticsData}
                          options={{ ...baseOptions, maintainAspectRatio: false }}
                        />
                      </div>
                    </div>
        
                    {/* Doughnut Chart */}
                    <div className="bg-white p-4 rounded-xl shadow-md">
                      <h2 className="text-lg font-semibold mb-2">
                        Student Risk Distribution
                      </h2>
                      <div className="h-[300px]">
                        <Doughnut
                          data={riskDistribution}
                          options={{
                            ...doughnutOptions,
                            maintainAspectRatio: false,
                            cutout: "65%"
                          }}
                        />
                      </div>
                    </div>
        
                  </div>
    </div>
  )
}

export default Analytics