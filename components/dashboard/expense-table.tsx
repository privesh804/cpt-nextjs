"use client";

import { DataGrid } from "@/components/data-grid";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";
import BudgetServices from "@/services/budget";
import { debounce } from "@mui/material";
import { FaMagnifyingGlass } from "react-icons/fa6";

const ExpenseTable = ({ projectId }: { projectId: string }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dataVersion, setDataVersion] = useState<number>(0);

  // Debounced search handler
  const handleSearchChange = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
    }, 500),
    []
  );

  // Fetching data from API
  const fetchExpenses = useCallback(
    async (data: PaginationParams) => {
      try {
        const searchParam = searchQuery
          ? `&searchText=${searchQuery}`
          : "&searchText=";

        const response = await BudgetServices.getBudgetReportByID({
          projectId,
          pageIndex: data.pageIndex,
          pageSize: data.pageSize,
          searchQuery: searchParam,
        });

        if (response?.status === 200) {
          const data = response?.data?.data?.taskLogs?.data || [];

          return {
            data: data,
            totalCount: response?.data?.data?.taskLogs?.total || 0,
          };
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
      return { data: [], totalCount: 0 };
    },
    [projectId, searchQuery]
  );

  // Force UI re-render when searchQuery updates
  useEffect(() => {
    setDataVersion((prev) => prev + 1);
  }, [searchQuery, projectId]);

  // Define columns
  const columns = useMemo<ColumnDef<ExpenseData, any>[]>(
    () => [
      {
        accessorFn: (row) => {
          const words = row.task?.name?.split(" ") || [];
          return words.length > 5
            ? words.slice(0, 5).join(" ") + "..."
            : row.task?.name;
        },
        id: "taskName",
        header: () => "Task Name",
        meta: { className: "min-w-[200px] text-left" },
      },

      {
        accessorFn: (row) =>
          `$${parseFloat(row.task?.budget_allocated.toString()).toFixed(2)}`,
        id: "totalBudget",
        header: () => "Total Budget",
        meta: { className: "min-w-[150px] text-left" },
      },
      {
        accessorFn: (row) =>
          `$${parseFloat(row.total_rate.toString()).toFixed(2)}`,
        id: "spentBudget",
        header: () => "Spent Budget",
        meta: { className: "min-w-[150px] text-left" },
      },
      {
        id: "actions",
        header: () => "Actions",
        cell: ({ row }) => {
          const [isOpen, setIsOpen] = useState(false);

          return (
            <div className="relative">
              <button
                className="text-gray-600 hover:text-gray-800"
                onClick={() => setIsOpen(!isOpen)}
              >
                <BsThreeDotsVertical />
              </button>

              {isOpen && (
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-36 bg-white shadow-md rounded-md border z-20">
                  <button
                    className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100"
                    onClick={() =>
                      router.push(`/task-management/${row.original.task_id}`)
                    }
                  >
                    <FaEdit className="text-blue-500" /> Task Detail
                  </button>
                </div>
              )}
            </div>
          );
        },
        meta: { className: "w-[50px] text-left" },
      },
    ],
    [searchQuery, fetchExpenses]
  );

  return (
    <div className="card card-grid h-auto min-w-full px-3 my-4">
      <div className="flex justify-between">
        <div className="card-header flex flex-row justify-between">
          <h3 className="font-semibold">Expense Logs</h3>
        </div>
        <div className="input input-sm max-w-48 mt-4">
          <FaMagnifyingGlass />
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="p-6">
        <DataGrid
          key={dataVersion}
          columns={columns}
          serverSide={true}
          onFetchData={async (params) => {
            if (projectId) {
              return await fetchExpenses({
                pageIndex: params.pageIndex + 1,
                pageSize: params.pageSize,
                searchQuery: "",
              });
            } else {
              return { data: [], totalCount: 0 };
            }
          }}
        />
      </div>
    </div>
  );
};

export default ExpenseTable;
