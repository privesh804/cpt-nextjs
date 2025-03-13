"use client";

import GreenBudgetIcon from "@/icons/green-budgeticon";
import MonthlyBudgetIcon from "@/icons/monthly-budgeticon";
import TotalBudgetIcon from "@/icons/total-budget";
import TotalExpensesIcon from "@/icons/total-expanses";
import React from "react";

const BudgetMetricsCards = () => {
  return (
    <div className="flex flex-col gap-3 2xl:gap-5 mt-10">
      <div className="flex gap-3 2xl:gap-5">
        <div className="row1 w-1/2 flex-1 bg-[#4CAD6D]/10 rounded-lg p-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] text-gray-600">Total Budget/Amount</p>
              <p className="font-bold text-[22px] text-black mt-1">$ 990k</p>
            </div>
            <GreenBudgetIcon className="w-[50px] h-[50px]" />
          </div>
        </div>

        {/* Total Expense Card */}
        <div className="row1 w-1/2 flex-1 bg-[#71D467]/10 rounded-lg p-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] text-gray-600">Total Expense</p>
              <p className="font-bold text-[22px] text-black mt-1">$ 550k</p>
            </div>
            <TotalExpensesIcon className="w-[50px] h-[50px]" />
          </div>
        </div>
      </div>

      <div className="flex gap-3 2xl:gap-5">
        {/* Monthly Budget Left Card */}
        <div className="row1 w-1/2 flex-1 bg-[#EBA503]/10 rounded-lg p-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] text-gray-600">Monthly Budget Left</p>
              <p className="font-bold text-[22px] text-black mt-1">$ 109k</p>
            </div>
            <MonthlyBudgetIcon className="w-[50px] h-[50px]" />
          </div>
        </div>

        {/* Total Budget Left Card */}
        <div className="row1 w-1/2 flex-1 bg-[#4C92AD]/10 rounded-lg p-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] text-gray-600">Total Budget Left</p>
              <p className="font-bold text-[22px] text-black mt-1">$ 440k</p>
            </div>
            <TotalBudgetIcon className="w-[50px] h-[50px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetMetricsCards;
