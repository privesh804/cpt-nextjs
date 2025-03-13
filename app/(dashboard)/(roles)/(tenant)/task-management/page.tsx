"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { DataGrid } from "@/components/data-grid";
import { useTaskContext } from "@/context/task/task-context";
import { secureStorage } from "@/utils/crypto";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
import { FaEye, FaMagnifyingGlass } from "react-icons/fa6";
import AddTaskModal from "@/components/ui/add-task-modal";
import { useRouter } from "next/navigation";
import { setProjectId } from "@/redux/features/project.slice";

const TaskManagementPage = () => {
  const { projectId } = useSelector((state: RootState) => state.project);
  const { fetchTasks } = useTaskContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (projectId) {
      setRefreshKey((prev) => prev + 1);
    }
  }, [projectId]);

  const columns = useMemo<ColumnDef<Task, any>[]>(
    () => [
      {
        accessorFn: (row) => row.name,
        id: "name",
        header: () => "Task Name",
        cell: (info) => <div>{info.row.original.name}</div>,
        meta: { className: "min-w-[200px]" },
      },
      {
        accessorFn: (row) => row.user?.name || "Unknown",
        id: "assignedTo",
        header: () => "Assigned To",
        cell: (info) => (
          <div className="text-left">
            {info.row.original.user?.name || "N/A"}
          </div>
        ),
        meta: { className: "min-w-[180px] text-left" },
      },
      {
        accessorFn: (row) => row.start_date,
        id: "start_date",
        header: () => "Shift Start",
        cell: (info) => (
          <div className="text-left">
            {info.row.original.start_date || "----"}
          </div>
        ),
        meta: { className: "min-w-[180px] text-left" },
      },
      {
        accessorFn: (row) => row.end_date,
        id: "end_date",
        header: () => "Shift End",
        cell: (info) => (
          <div className="text-left">
            {info.row.original.end_date || "----"}
          </div>
        ),
        meta: { className: "min-w-[180px] text-left" },
      },
      {
        accessorFn: (row) => row.created_at,
        id: "created_at",
        header: () => "Created At",
        cell: (info) => (
          <div className="text-left">
            {new Date(info.row.original.created_at).toLocaleDateString()}
          </div>
        ),
        meta: { className: "min-w-[180px] text-left" },
      },
      {
        id: "actions",
        header: () => "Actions",
        cell: ({ row }) => (
          <div className="flex items-center">
            <button
              onClick={() => router.push(`/task-management/${row.original.id}`)}
            >
              <FaEye />
            </button>
          </div>
        ),
        meta: { className: "w-[50px] text-left" },
      },
    ],
    []
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const loadProjectId = async () => {
      const id = await secureStorage.getItem("projectId");
      setProjectId(id);
    };

    loadProjectId();
  }, []);

  if (!projectId) return null;
  return (
    <div className="min-h-svh h-full">
      <div className="card card-grid h-auto min-w-full ">
        <div className="card-header">
          <h1 className="text-primary-100 text-3xl font-bold w-full">
            Task Management
          </h1>
          <div className="flex items-center gap-2 w-full justify-end">
            <button
              className="btn btn-secondary rounded-full btn-sm"
              onClick={async () => setOpenTaskModal(true)}
            >
              Add Task
            </button>
            <div className="input input-sm max-w-48">
              <FaMagnifyingGlass />
              <input
                type="text"
                placeholder="Search Tasks"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Let useEffect handle fetching
              />
            </div>
          </div>
        </div>
        <div className="card-body">
          <DataGrid
            key={`${debouncedSearch}-${refreshKey}`}
            columns={columns}
            serverSide={true}
            onFetchData={async (params) => {
              if (projectId) {
                return await fetchTasks({
                  projectId: projectId,
                  pageIndex: params.pageIndex + 1,
                  pageSize: params.pageSize,
                  searchQuery: debouncedSearch,
                });
              } else {
                return {
                  data: [],
                  totalCount: 0,
                };
              }
            }}
          />
        </div>
        <AddTaskModal
          projectId={projectId as string}
          setRefreshKey={setRefreshKey}
          open={openTaskModal}
          setOpen={setOpenTaskModal}
        />
      </div>
    </div>
  );
};

export default TaskManagementPage;
