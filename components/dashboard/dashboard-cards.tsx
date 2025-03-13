"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// Define the DashboardCard interface
export interface DashboardCard {
  icon: React.ReactNode;
  heading: string;
  count: string;
  chart: "radial" | "bar" | "line";
  backgroundColor: string;
}

const radialChartOptions: ApexOptions = {
  series: [75, 60, 145, 30],
  chart: {
    height: 350,
    type: "radialBar",
    sparkline: {
      enabled: true,
    },
  },
  plotOptions: {
    radialBar: {
      startAngle: 0,
      endAngle: 360,
      track: {
        background: "#ffffff33",
        strokeWidth: "100%",
      },
      dataLabels: {
        name: {
          show: false,
        },
        value: {
          show: false,
        },
      },
    },
  },
  colors: ["#ffffff"],
  stroke: {
    lineCap: "round",
  },
  labels: ["TEAM A", "TEAM B", "TEAM C", "TEAM D"],
};

const barChartOptions: ApexOptions = {
  series: [
    {
      data: [30, 40, 45, 60, 80, 100],
    },
  ],
  chart: {
    type: "bar",
    height: 120,
    sparkline: {
      enabled: true,
    },
  },
  plotOptions: {
    bar: {
      borderRadius: 2,
      columnWidth: "20%",
    },
  },
  colors: ["#ffffff"],
  xaxis: {
    crosshairs: {
      width: 1,
    },
  },
};

const lineChartOptions: ApexOptions = {
  series: [
    {
      data: [25, 66, 41, 89, 63, 25, 44, 12, 36, 9, 54],
    },
  ],
  chart: {
    type: "line",
    height: 120,
    sparkline: {
      enabled: true,
    },
  },
  stroke: {
    curve: "smooth",
    width: 2,
  },
  colors: ["#ffffff"],
  tooltip: {
    fixed: {
      enabled: false,
    },
    x: {
      show: false,
    },
    marker: {
      show: false,
    },
  },
};

type ChartType = "radialBar" | "bar" | "line";

const DashboardCards: React.FC<DashboardCard> = ({
  icon,
  count,
  backgroundColor,
  heading,
  chart,
}) => {
  const getChartConfig = () => {
    switch (chart) {
      case "radial":
        return {
          options: radialChartOptions,
          series: radialChartOptions.series,
          type: "radialBar" as ChartType,
        };
      case "bar":
        return {
          options: barChartOptions,
          series: barChartOptions.series,
          type: "bar" as ChartType,
        };
      case "line":
        return {
          options: lineChartOptions,
          series: lineChartOptions.series,
          type: "line" as ChartType,
        };
      default:
        return {
          options: radialChartOptions,
          series: radialChartOptions.series,
          type: "radialBar" as ChartType,
        };
    }
  };

  const chartConfig = getChartConfig();

  return (
    <div className="flex flex-row flex-wrap items-start xl:justify-between gap-4 3xl:gap-20 p-4 w-full">
      <div className="flex flex-col gap-6">
        <div className="w-11 h-11 rounded-full flex justify-center items-center bg-tertiary">
          {icon}
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-tertiary text-[15px] font-normal truncate">
            {heading}
          </h3>

          <span className="font-bold text-tertiary text-[28px]">{count}</span>
        </div>
      </div>
      <div className="h-16 w-16 flex flex-wrap justify-center items-center ">
        <ReactApexChart
          options={chartConfig.options}
          series={chartConfig.series}
          type={chartConfig.type}
          height="100%"
          width="30%"
        />
      </div>
    </div>
  );
};

export default DashboardCards;
