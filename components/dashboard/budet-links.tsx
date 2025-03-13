"use client";
import React from "react";

const BudgetLinks = () => {
  return (
    <div className="mt-12 2xl:px-8 2xl:py-9 p-4 flex flex-col bg-tertiary rounded-2xl budget-links">
      <div className="2xl: flex justify-center items-center">
        <div className="flex flex-col gap-4 w-full text-sm bg-white rounded-lg p-6">
          <a href="#" className="text-[22px] font-bold cursor-pointer hover:text-green-600 transition-colors">
            Create or export reports
          </a>
          <a href="#" className="text-[22px] font-bold cursor-pointer hover:text-green-600 transition-colors">
            View reports
          </a>
        </div>
      </div>
    </div>
  );
};

export default BudgetLinks;
