"use client";
import React from "react";
import TaskDoneIcon from "@/icons/task-done";
import CashIcon from "@/icons/cash-icon";
import PorgressIcon from "@/icons/progress-icon";
import TeamMemberTable from "@/components/dashboard/table";
import ProjectStatus from "@/components/dashboard/project-status";
import DashboardCards from "@/components/dashboard/dashboard-cards";
import TeamMemberCards from "@/components/dashboard/team-members";
import AddTask from "@/components/dashboard/add-task";
import { useEventSource } from "@/services/real-time-sse";

const data1 = {
  total_tasks: 200,
  total_expense: 500,
  total_progress: 70,
  tasks_data: [75, 60, 45, 30], // what % of tasks are done in last 7 days
  budget_data: [75, 60, 45, 30], // what % of budget is used in last 7 days,
  progress_data: [75, 60, 45, 30], // what % of progress is done in last 7 days
};

const dashboardCards: DashboardCard[] = [
  {
    icon: <TaskDoneIcon />,
    heading: "Total Tasks",
    count: "109",
    chart: "radial",
    backgroundColor: "#4CAD6D",
  },
  {
    icon: <CashIcon />,
    heading: "Total Expenses",
    count: "450k",
    chart: "bar",
    backgroundColor: "#4C92AD",
  },
  {
    icon: <PorgressIcon />,
    heading: "Total Progress",
    count: "80%",
    chart: "line",
    backgroundColor: "#1AC69B",
  },
];
const cardColors = ["bg-[#1AC69B]", "bg-[#4C92AD]", "bg-[#4CAD6D]"];

interface StreamData {
  message: string;
  timestamp: number;
  progress: number;
}

const DashboardPage = () => {
  // const { data, error, isConnected } = useEventSource<StreamData>({
  //   url: "/real-time-notifications", // Your SSE endpoint
  // });
  // TODO: do something

  return (
    <div>
      <h1 className="text-primary-100 text-3xl font-bold w-full ml-2">
        Dashboard{" "}
      </h1>
      <div className="grid grid-cols-12  mt-9 gap-4 2xl:gap-8 flex-grow">
        <div className="col-span-8 flex flex-col gap-10">
          <div className="w-full flex flex-row gap-4 2xl:gap-5">
            {dashboardCards.map((card, index) => (
              <div
                className={`flex w-full flex-row gap-1 2xl:px-4 2xl:py-3 p-1 rounded-2xl ${
                  cardColors[index % cardColors.length]
                }`}
                key={index}
              >
                <DashboardCards {...card} />
              </div>
            ))}
          </div>

          <div className="w-full rounded-2xl p-4 sm:p-11 flex flex-col gap-4 bg-tertiary">
            <TeamMemberCards />
          </div>

          <div className="w-full rounded-2xl p-4 sm:p-6 flex flex-col gap-4 bg-tertiary">
            <TeamMemberTable />
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6 order-last lg:order-none">
          <div className="w-full rounded-2xl p-4 sm:p-6 bg-white shadow">
            <ProjectStatus />
          </div>
          <div className="w-full rounded-2xl p-4 sm:p-6 bg-white shadow">
            <AddTask />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
