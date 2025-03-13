"use client";

import React from "react";
import BudgetExpansesCard from "@/components/dashboard/budget-piechart";
import ExpenseTable from "@/components/dashboard/expense-table";
import SummaryBudget from "@/components/dashboard/summary-budget";
import BudgetLinks from "@/components/dashboard/budet-links";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const BudgetExpanses = () => {
  const { projectId } = useSelector((state: RootState) => state.project);

  const projectIdString = projectId ?? "";

  return (
    <div>
      <h1 className="text-primary-100 text-3xl font-bold w-full ml-2">
        Budget And Expenses
      </h1>

      <div className="grid grid-cols-12 mt-9 gap-4 2xl:gap-8 flex-grow">
        {/* Left Side - Reduced width */}
        <div className="col-span-7 flex flex-col gap-10">
          <div className="w-full rounded-2xl p-6 flex-1 flex flex-col gap-4.5 bg-tertiary">
            <h3 className="text-primary-100 font-bold text-xl">
              Project Expense Tracking
            </h3>

            <BudgetExpansesCard />
          </div>
          <div className="w-full rounded-2xl p-6 flex-1 flex flex-col gap-4.5 bg-tertiary">
            <ExpenseTable projectId={projectIdString} />
          </div>
        </div>
        {/* Right Side - Increased width */}
        <div className="col-span-5 flex flex-col gap-9">
          <div>
            <SummaryBudget />
          </div>
          {/* <div className="col-span-5 flex flex-col gap-10">
            <BudgetLinks />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default BudgetExpanses;
