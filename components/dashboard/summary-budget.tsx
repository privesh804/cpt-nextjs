"use client";
import React, { useEffect, useState } from "react";
import BudgetMetricsCards from "./budget-metrix";
import budgetServices from "@/services/budget";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { PuffLoader } from "react-spinners";

const SummaryBudget = () => {
  const [projectName, setProjectName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState<string>("");
  const [projectStatus, setProjectStatus] = useState<string>("");
  const [projectType, setProjectType] = useState<string>("");
  const [amount, setAmount] = useState<number>();
  const [startDate, setStartDate] = useState<null>(null);
  const [endDate, setEndDate] = useState<null>(null);
  const { projectId } = useSelector((state: RootState) => state.project);

  const projectData = async () => {
    try {
      setLoading(true);
      if (projectId) {
        let res = await budgetServices.getProjectData({ projectId });
        if (res) {
          setLoading(false);
          setProjectName(res.data.project_name);
          setClient(res.data.client);
          setProjectStatus(res.data.project_status);
          setProjectType(res.data.project_type);
          setAmount(res.data.total_amount);
          setStartDate(res.data.start_date);
          setEndDate(res.data.due_date);
        }
      }
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  };
  useEffect(() => {
    projectData();
  }, [projectId]);

  return (
    <div className="2xl:px-8 2xl:py-9 p-4 flex flex-col bg-tertiary rounded-2xl min-h-[500px] 2xl:min-h-[600px]">
      <h3 className="text-primary-100 font-bold text-xl">
        Expense and budget summary
      </h3>
      <div className="2xl:mt-10 mt-5 flex justify-center items-center">
        {loading ? (
          <PuffLoader />
        ) : (
          <div className="flex flex-col    gap-4 w-full text-sm bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-start  gap-2">
              <span className="font-bold text-primary-100 w-full text-sm ">
                Project Name:
              </span>
              <p className="text-gray-600 text-xs w-full break-words ">
                {projectName}
              </p>
            </div>

            <div className="flex item-start  gap-2">
              <span className="font-bold text-primary-100 w-full text-sm">
                Project Type:
              </span>
              <p className="text-gray-600 text-xs w-full break-words">
                {projectType}
              </p>
            </div>

            <div className="flex item-start  gap-2">
              <span className="font-bold text-primary-100 w-full text-sm">
                Client:
              </span>
              <p className="text-gray-600 text-xs w-full break-words ">
                {" "}
                {client}
              </p>
            </div>

            <div className="flex item-start  gap-2">
              <span className="font-bold text-primary-100 w-full text-sm">
                Total Amount:
              </span>
              <p className="text-gray-600 text-xs w-full break-words ">
                {amount}
              </p>
            </div>

            {/* <div className="flex item-start gap-2">
            <span className="font-bold text-primary-100 w-32 text-sm">
              Project Status:
            </span>
            <span className="text-gray-600 text-sm">
              {projectStatus || "null"}
            </span>
          </div> */}

            <div className="flex  item-start gap-2">
              <span className="font-bold text-primary-100 w-full text-sm">
                Start Date:
              </span>
              <p className="text-gray-600 text-xs w-full break-words ">
                {startDate}
              </p>
            </div>

            <div className="flex  items-start gap-2">
              <span className="font-bold text-primary-100 w-full text-sm">
                Due Date:
              </span>
              <p className="text-gray-600 text-xs w-full break-words">
                {endDate}
              </p>
            </div>
          </div>
        )}
      </div>

      <BudgetMetricsCards />
    </div>
  );
};

export default SummaryBudget;
