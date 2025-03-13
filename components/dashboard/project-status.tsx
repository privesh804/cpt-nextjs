"use client";
import React from "react";
import ProjectPieChart from "./components/project-status-pie-chart";

const ProjectStatus = () => {
  return (
    <div className="2xl:px-8 2xl:py-9 p-4 flex flex-col bg-tertiary rounded-2xl">
      <h3 className="text-primary-100 font-bold text-2xl">Project Status</h3>
      <div className="2xl:mt-10 mt-5 flex justify-center items-center">
        <ProjectPieChart />
      </div>

      <div className="flex flex-col gap-3 2xl:gap-5 mt-10">
        <div className="flex  justify-center gap-3 2xl:gap-5 w-full items-center">
          <span className="w-[10%] text-sm font-normal">100%</span>
          <div className="progress progress-truncate h-[9px] w-[70%] ">
            <div className="progress-bar" style={{ width: "100%" }}></div>
          </div>
          <span className="w-[20%] text-sm font-normal truncate justify-end">
            Total
          </span>
        </div>

        <div className="flex  justify-center gap-3 2xl:gap-5 w-full items-center">
          <span className="w-[10%] text-sm font-normal">75%</span>
          <div className="progress progress-secondary w-[70%] h-[9px]">
            <div className="progress-bar" style={{ width: "70%" }}></div>
          </div>
          <span className="w-[20%] text-sm font-normal truncate">Pending</span>
        </div>

        <div className="flex  justify-center gap-3 2xl:gap-5 w-full items-center">
          <span className="w-[10%] text-sm font-normal">0%</span>
          <div className="progress progress-truncate w-[70%] h-[9px]">
            <div className="progress-bar" style={{ width: "0%" }}></div>
          </div>
          <span className="w-[20%] text-sm font-normal truncate justify-end">
            Complete
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectStatus;
