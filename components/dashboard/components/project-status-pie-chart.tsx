"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import React from "react";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const ProjectPieChart = ({ progress = 75 }: { progress?: number }) => {
  const chartOptions: ApexOptions = {
    chart: {
      type: "donut", // Ensure "donut" is a valid type
    },
    labels: [`${progress}%`, `${100 - progress}%`],
    colors: ["#4CAF50", "#8BC34A"], // Adjust colors to match your image
    plotOptions: {
      pie: {
        donut: {
          size: "65%", // Adjust for inner circle size
          labels: {
            show: true,
            total: {
              show: true,
              label: "100%",
              fontSize: "18px",
              fontWeight: 600,
              formatter: () => "",
            },
            value: {
              show: false,
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
  };
  const chartSeries = [progress, 100 - progress];

  return (
    <>
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="donut"
        width="300"
      />
    </>
  );
};

export default ProjectPieChart;
