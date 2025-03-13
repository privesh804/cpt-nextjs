"use client";

import { DataGrid } from "@/components/data-grid";
import { useTaskContext } from "@/context/task/task-context";
import { secureStorage } from "@/utils/crypto";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
import {
  FaEdit,
  FaHistory,
  FaExclamationTriangle,
  FaEye,
} from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import { Tooltip } from "@mui/material";
import AddTaskLogModal from "@/components/ui/add-task-log-modal";
import { LogHistoryModal } from "@/components/ui/log-history-modal";
import { BsThreeDotsVertical } from "react-icons/bs";
import StatusModal from "@/components/ui/status-modal";
import taskService from "@/services/task"; // Import task service to make API calls
import CustomDatePicker from "@/components/common/custom-date-picker";
import dayjs, { Dayjs } from "dayjs";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { enqueueSnackbar } from "notistack";

const statusOptions: [string, ...string[]] = [
  "PENDING",
  "INPROGRESS",
  "HOLD",
  "COMPLETED",
];

const schema = z
  .object({
    name: z.string().nonempty({ message: "This field is required" }),
    start_date: z.string().nonempty({ message: "This field is required" }),
    end_date: z.string().nonempty({ message: "This field is required" }),
    status: z.enum(statusOptions).default("pending"),
    progress: z.number().min(0).max(100),
    budget_allocated: z.string().default("0.0"),
  })
  .refine((data) => dayjs(data.start_date).isBefore(dayjs(data.end_date)), {
    message: "Start date must be before end date",
    path: ["start_date"],
  });

type TaskData = z.infer<typeof schema>;
const TaskDetailsPage = () => {
  const { task, fetchTaskById } = useTaskContext();
  const { id } = useParams();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [openLogModal, setOpenLogModal] = useState(false);
  const [logToEdit, setLogToEdit] = useState<TaskListLogs | null>(null);
  const [selectedLog, setSelectedLog] = useState<string | null>();
  const [showLogs, setShowLogs] = useState(false);

  const [openStatusModal, setOpenStatusModal] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const router = useRouter(); // Initialize the router

  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs(new Date()));
  const [endDate, setEndDate] = useState<Dayjs | null>(
    dayjs(new Date()).add(1, "day")
  );

  useEffect(() => {
    const loadProjectId = async () => {
      const storedProjectId = await secureStorage.getItem("projectId");
      setProjectId(storedProjectId);
    };
    loadProjectId();
  }, []);

  useEffect(() => {
    if (id && projectId) {
      fetchTaskById({ projectId, taskId: id as string }); // ✅ Correct
      setRefreshKey((prev) => prev + 1);
    }
  }, [projectId, id]);

  // Check if the status is 'Approved' to conditionally hide the reason column
  const columns = useMemo<ColumnDef<TaskListLogs>[]>(
    () => [
      {
        accessorFn: (row) => row.allow_hours,
        id: "allow_hours",
        header: () => "Allowed Hours",
        cell: (info) => <div>{info.row.original.allow_hours}</div>,
        meta: { className: "min-w-[80px] text-left" },
      },
      {
        accessorFn: (row) => row.no_worker,
        id: "no_of_workers",
        header: () => "No of workers",
        meta: { className: "min-w-[80px] text-left" },
      },
      {
        accessorFn: (row) => row.rate,
        id: "rate",
        header: () => "Rate",
        meta: { className: "min-w-[80px] text-left" },
      },
      {
        accessorFn: (row) => row.total_hours,
        id: "total_hours",
        header: () => "Total Hours",
        meta: { className: "min-w-[80px] text-left" },
      },
      {
        accessorFn: (row) => row.status,
        id: "status",
        header: () => "Status",
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex items-center">
              <span className={`status-${row.status.toLowerCase()}`}>
                {row.status}
              </span>
            </div>
          );
        },
        meta: { className: "min-w-[80px] text-left" },
      },
      {
        accessorFn: (row: { reason: string; status: string }) => {
          // If status is APPROVED, show '---', else show the actual reason
          return row.status === "APPROVED" ? "---" : row.reason;
        },
        id: "reason",
        header: () => "Reason",
        cell: (info) => {
          const row = info.row.original;
          // Display either '---' if approved or the actual reason if not
          return <div>{row.status === "APPROVED" ? "---" : row.reason}</div>;
        },
        meta: { className: "min-w-[180px] text-left" },
      },
      {
        id: "actions",
        header: () => "Actions",
        cell: ({ row }) => {
          const [isOpen, setIsOpen] = useState(false);

          return (
            <div className="">
              <button
                className="text-gray-600 hover:text-gray-800"
                onClick={() => setIsOpen(!isOpen)}
              >
                <BsThreeDotsVertical />
              </button>

              {isOpen && (
                <div className="absolute z-50 mt-2 w-36 bg-white shadow-md rounded-md border custom-pop-style">
                  <button
                    className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100"
                    onClick={() => {
                      setLogToEdit(row.original);
                      setOpenLogModal(true);
                      setIsOpen(false);
                    }}
                  >
                    <FaEdit className="text-blue-500" /> Edit
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100"
                    onClick={() => {
                      setSelectedLog(row.original.id);
                      setShowLogs(true);
                      setIsOpen(false);
                    }}
                  >
                    <FaHistory className="text-blue-500" /> History
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100"
                    onClick={() => {
                      setOpenStatusModal(true);
                      setSelectedStatus(row.original.status); // Pass status to modal
                      setSelectedLog(row.original.id); // Set log ID correctly
                      setIsOpen(false);
                    }}
                  >
                    <FaExclamationTriangle className="text-red-500" /> Status
                  </button>
                </div>
              )}
            </div>
          );
        },
        meta: { className: "w-[50px] text-left" },
      },
    ],
    [] // No need to add any dependencies unless you want to react to changes in task status dynamically
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TaskData>({
    resolver: zodResolver(schema),
    defaultValues: {
      start_date: dayjs(startDate).format("YYYY-MM-DD").toString(),
      end_date: dayjs(endDate).format("YYYY-MM-DD").toString(),
      status: "pending",
      budget_allocated: "0.0",
    },
  });

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  useEffect(() => {
    if (task) {
      setValue("name", task.name);
      setValue("budget_allocated", task.budget_allocated);
      setValue("progress", task.progress);
      setValue("status", task.status);
      setStartDate(dayjs(task.start_date));
      setEndDate(dayjs(task.end_date));
    }
  }, [task]);

  useEffect(() => {
    if (startDate) {
      setValue("start_date", dayjs(startDate).format("YYYY-MM-DD").toString());
    }
  }, [startDate]);

  useEffect(() => {
    if (endDate) {
      setValue("end_date", dayjs(endDate).format("YYYY-MM-DD").toString());
    }
  }, [endDate]);

  const handleUpdate = async (data: TaskData) => {
    try {
      if (projectId && id) {
        await taskService
          .updateTask({
            projectId,
            taskId: id as string,
            updatedData: {
              ...data,
              budget_allocated: parseFloat(data.budget_allocated).toFixed(2),
            },
          })
          .then(() => {
            enqueueSnackbar("Task updated successfully", {
              variant: "success",
            });
          });
      }
    } catch (error: any) {
      console.error("Failed to update project.");
    }
  };

  if (!task) return null;

  return (
    <div>
      <div className="card card-grid h-auto min-w-full px-3 my-4">
        <div className="card-header flex flex-row justify-between">
          <p className="capitalize font-semibold flex items-center gap-2">
            {truncateText(task.name, 75)}
            {task.name.length > 75 && (
              <Tooltip title={task.name} arrow>
                <span className="cursor-pointer text-gray-500">
                  <FaEye />
                </span>
              </Tooltip>
            )}
          </p>
          <Link href="/task-management">
            <button
              type="button"
              className="btn btn-primary rounded-full btn-sm"
              onClick={() => router.back()} // This will go back to the previous page
            >
              Back
            </button>
          </Link>
        </div>

        <hr />

        <form className="my-4" onSubmit={handleSubmit(handleUpdate)}>
          <div className="flex flex-row p-5">
            <label
              htmlFor="status"
              className="form-label w-full max-w-48 text-gray-900"
            >
              Task Name
            </label>
            <div className="w-full max-w-48">
              <input
                className="input input-sm"
                placeholder="Task Name"
                {...register("name")}
              />
            </div>
          </div>

          <div className="flex flex-row p-4">
            <label
              htmlFor="shift_start"
              className="form-label w-full max-w-48 text-gray-900"
            >
              Start Date
            </label>
            <div className="w-full max-w-48">
              <CustomDatePicker
                label=""
                date={startDate}
                setDate={setStartDate}
              />
            </div>
          </div>

          <div className="flex flex-row p-5">
            <label
              htmlFor="shift_end"
              className="form-label w-full max-w-48 text-gray-900"
            >
              End Date
            </label>
            <div className="w-full max-w-48">
              <CustomDatePicker label="" date={endDate} setDate={setEndDate} />
            </div>
          </div>

          <div className="flex flex-row p-5">
            <label
              htmlFor="status"
              className="form-label w-full max-w-48 text-gray-900"
            >
              Status
            </label>
            <div className="w-full max-w-48">
              <select
                id="status"
                {...register("status")}
                className="input input-sm w-full max-w-48 p-2 border rounded-md"
              >
                {statusOptions.map((statusOption, index) => (
                  <option key={index}>{statusOption}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-row p-5">
            <label
              htmlFor="progress"
              className="form-label w-full max-w-48 text-gray-900"
            >
              Progress
            </label>
            <div className="w-full max-w-48 flex flex-col">
              <input
                {...register("progress", { valueAsNumber: true })}
                type="range"
                id="progress"
                min={0}
                max={100}
                className="w-full cursor-pointer bg-gray-700 accent-current"
              />
            </div>
            <span className="text-sm text-gray-700 ml-5">
              {watch("progress")}%
            </span>
          </div>

          <div className="flex flex-row p-5">
            <label
              htmlFor="budget_allocated"
              className="form-label w-full max-w-48 text-gray-900"
            >
              Budget Allocated
            </label>
            <div className="w-full max-w-48">
              <input
                {...register("budget_allocated")}
                id="budget_allocated"
                className="input input-sm"
                placeholder="Budget Allocated"
              />
            </div>
          </div>
          <div className="px-5">
            <button type="submit" className="btn btn-secondary rounded-full">
              Update Task
            </button>
          </div>
        </form>

        <hr className="border border-primary-light" />
        <div className="px-3 space-y-4 my-8">
          <div className="card-header flex flex-row justify-between">
            <h3 className="font-semibold">Logs</h3>
            <button
              className="btn btn-secondary rounded-full btn-sm"
              onClick={() => {
                setLogToEdit(null); // Clear any previous log if creating a new one
                setOpenLogModal(true);
              }}
            >
              Create Log
            </button>
          </div>
          <div className="p-6 ">
            <DataGrid
              key={refreshKey}
              columns={columns}
              serverSide={true}
              onFetchData={async (params) => {
                if (id && projectId) {
                  const result = await fetchTaskById({
                    projectId,
                    taskId: id as string,
                  });
                  return {
                    data: result.data || [],
                    totalCount: result.totalCount || 0,
                  };
                } else {
                  return { data: [], totalCount: 0 };
                }
              }}
            />
          </div>
          {openLogModal && (
            <AddTaskLogModal
              open={openLogModal}
              setOpen={setOpenLogModal}
              setRefreshKey={setRefreshKey}
              projectId={projectId as string}
              taskId={id as string}
              logToEdit={logToEdit}
            />
          )}
          {projectId && id && selectedLog && (
            <LogHistoryModal
              open={showLogs}
              setOpen={setShowLogs}
              projectId={projectId}
              id={id as string}
              logId={selectedLog}
              taskId={id as string}
            />
          )}
          <StatusModal
            open={openStatusModal}
            onClose={() => setOpenStatusModal(false)}
            onSubmit={() => setRefreshKey((prev) => prev + 1)}
            currentStatus={selectedStatus || ""}
            logId={selectedLog as string} // Pass the correct log ID
            id={id as string}
            projectId={projectId as string}
            taskId={id as string}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsPage;
