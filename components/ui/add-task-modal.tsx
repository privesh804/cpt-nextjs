"use client";

import { Modal, ModalBody, ModalHeader, ModalTitle } from "@/components/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FaPlus } from "react-icons/fa";
import { useTaskContext } from "@/context/task/task-context";
import CustomDatePicker from "../common/custom-date-picker";
import dayjs, { Dayjs } from "dayjs";

const statusOptions: [string, ...string[]] = [
  "PENDING",
  "INPROGRESS",
  "ONHOLD",
  "COMPLETED",
];

const schema = z
  .object({
    name: z.string().nonempty({ message: "This field is required" }),
    start_date: z.string().nonempty({ message: "This field is required" }),
    end_date: z.string().nonempty({ message: "This field is required" }),
    status: z.enum(statusOptions).default("pending"),
    progress: z.number().min(0).max(100),
    budget_allocated: z.string({ message: "This field is required" }),
    free_task: z.boolean().default(false),
    section_item_id: z.string().optional(),
  })
  .refine((data) => dayjs(data.start_date).isBefore(dayjs(data.end_date)), {
    message: "Start date must be before end date",
    path: ["start_date"],
  });

type TaskData = z.infer<typeof schema>;

interface TaskModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
  projectId: string;
  taskToEdit?: any; // Pass task data if editing
}

const AddTaskModal = ({
  open,
  setOpen,
  setRefreshKey,
  projectId,
  taskToEdit,
}: TaskModalProps) => {
  return (
    <Modal open={open}>
      <ModalHeader>
        <ModalTitle>{taskToEdit ? "Edit" : "Add"} Task</ModalTitle>
        <div
          className="cursor-pointer glyph fs1"
          onClick={() => setOpen(false)}
        >
          <FaPlus className="rotate-45" />
        </div>
      </ModalHeader>
      <ModalBody>
        <TaskForm
          setOpen={setOpen}
          setRefreshKey={setRefreshKey}
          projectId={projectId}
          taskToEdit={taskToEdit}
          open={false}
        />
      </ModalBody>
    </Modal>
  );
};

const TaskForm = ({
  setOpen,
  setRefreshKey,
  projectId,
  taskToEdit,
}: TaskModalProps) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs(new Date()));
  const [endDate, setEndDate] = useState<Dayjs | null>(
    dayjs(new Date()).add(1, "day")
  );
  const [boqItems, setBoqItems] = useState<any[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TaskData>({
    resolver: zodResolver(schema),
    defaultValues: taskToEdit || {
      progress: 50,
      start_date: dayjs(startDate).format("YYYY-MM-DD").toString(),
      end_date: dayjs(endDate).format("YYYY-MM-DD").toString(),
      budget_allocated: "0.00",
    },
  });

  const { createTask, fetchTasks, getTaskSection } = useTaskContext();

  useEffect(() => {
    if (watch("free_task") && projectId) {
      const fetchSections = async () => {
        const { data } = await getTaskSection({projectId});
        if (data) {
          setBoqItems(data.data.items);
        }
      };

      fetchSections();
    } else if (!watch("free_task")) {
      setBoqItems([]);
      setValue("section_item_id", "");
    }
  }, [projectId, watch("free_task")]);

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

  const budgetAllocated = watch("budget_allocated");

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (budgetAllocated && !isNaN(Number(budgetAllocated))) {
        setValue("budget_allocated", parseFloat(budgetAllocated).toFixed(2), {
          shouldValidate: true,
        });
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [budgetAllocated, setValue]);

  const handleTaskAction = async (taskData: TaskData) => {
    try {
      // await createTask(projectId, {
      //   ...taskData,
      // });
      await createTask({
        projectId,
        taskData,
      });
      setOpen(false);
      reset();
      setRefreshKey((prev) => prev + 1);
      await fetchTasks({
        projectId: projectId,
        pageIndex: 1,
        pageSize: 10,
        searchQuery: "",
      });
    } catch (error: any) {
      console.log("Failed to create task");
    }
  };

  return (
    <form className="space-y-2" onSubmit={handleSubmit(handleTaskAction)}>
      <div className="flex flex-col gap-1">
        <label className="form-label text-gray-900 text-xs">Task Name</label>
        <input
          className="input input-sm"
          placeholder="Task Name"
          {...register("name")}
        />
        {errors.name && (
          <span className="text-danger text-xs">{errors.name.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="form-label text-gray-900 text-xs">Start Date</label>
        <CustomDatePicker label="" date={startDate} setDate={setStartDate} />
        {errors.start_date && (
          <span className="text-danger text-xs">
            {errors.start_date.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="form-label text-gray-900 text-xs">End Date</label>
        <CustomDatePicker label="" date={endDate} setDate={setEndDate} />
        {errors.end_date && (
          <span className="text-danger text-xs">{errors.end_date.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="form-label text-gray-900 text-xs">Status</label>
        <select
          className="select select-sm rounded-full"
          {...register("status")}
        >
          {statusOptions.map((statusOption, index) => (
            <option key={index}>{statusOption}</option>
          ))}
        </select>
        {errors.status && (
          <span className="text-danger text-xs">{errors.status.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="form-label text-gray-900 text-xs">Progress</label>
        <div className="w-full flex flex-row gap-2">
          <input
            type="range"
            id="progress"
            min={0}
            max={100}
            className="w-full cursor-pointer bg-gray-700 accent-current"
            {...register("progress", { valueAsNumber: true })}
          />
          <div className="w-auto text-xs">{watch("progress")}%</div>
        </div>

        {errors.progress && (
          <span className="text-danger text-xs">{errors.progress.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="form-label text-gray-900 text-xs">
          Budget Allocated
        </label>
        <input
          className="input input-sm"
          placeholder="Budget Allocated"
          {...register("budget_allocated")}
        />
        {errors.budget_allocated && (
          <span className="text-danger text-xs">
            {errors.budget_allocated.message}
          </span>
        )}
      </div>

      <label className="flex text-xs gap-2 items-center mt-2">
        <input
          type="checkbox"
          className="checkbox checkbox-sm"
          {...register("free_task")}
        />
        Task associated with a BOQ item?
      </label>

      {watch("free_task") && (
        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900 text-xs">BOQ Items</label>
          <select
            className="select select-sm rounded-full"
            {...register("section_item_id")}
          >
            {boqItems.length > 0 ? (
              boqItems.map((boqItem) => (
                <option key={boqItem.id} value={boqItem.id}>
                  {boqItem.description}
                </option>
              ))
            ) : (
              <option value="">Select</option>
            )}
          </select>
          {errors.section_item_id && (
            <span className="text-danger text-xs">
              {errors.section_item_id.message}
            </span>
          )}
        </div>
      )}
      <div className="pt-2">
        <button type="submit" className="btn btn-primary">
          {taskToEdit ? "Update" : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default AddTaskModal;
