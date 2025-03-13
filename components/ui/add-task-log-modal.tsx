"use client";

import { Modal, ModalBody, ModalHeader, ModalTitle } from "@/components/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, Dispatch, SetStateAction, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FaPlus } from "react-icons/fa";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { enqueueSnackbar } from "notistack";
import { useTaskContext } from "@/context/task/task-context";
import { Controller } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";

// Validation schema
const schema = z.object({
  shift_start: z.string().optional(),
  shift_end: z.string().optional(),
  no_worker: z.string().nonempty({ message: "This field is required" }),
  rate: z.string().nonempty({ message: "This field is required" }),
  rate_type: z.string().nonempty({ message: "This field is required" }),
  allow_hours: z.string().optional(),  // Make allow_hours optional for both cases
}).refine((data) => {
  if (data.rate_type === 'HOURLY') {
    return data.shift_start && data.shift_end;
  }

  if (data.rate_type === 'DAY') {
    return true;
  }

  // If rate_type is neither 'HOURLY' nor 'DAY', the fields remain as they are
  return true;
}, {
  message: "shift_start and shift_end are required when rate_type is hourly",
  path: ['shift_start', 'shift_end'], // specify the fields to be included in the error
});

type AddTaskLogData = z.infer<typeof schema>;

interface TaskModalLogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setRefreshKey: Dispatch<SetStateAction<number>>;
  projectId: string;
  taskId: string;
  logToEdit?: TaskListLogs | null;
}

const AddTaskLogModal = ({
  open,
  setOpen,
  setRefreshKey,
  projectId,
  taskId,
  logToEdit,
}: TaskModalLogProps) => {
  const ref = useRef(null);


  return (
    <Modal open={open} ref={ref}>
      <ModalHeader>
        <ModalTitle>{logToEdit ? "Edit" : "Add"} Task Log</ModalTitle>
        <div
          className="cursor-pointer glyph fs1"
          onClick={() => setOpen(false)}
        >
          <FaPlus className="rotate-45" />
        </div>
      </ModalHeader>
      <ModalBody>
        <AddTaskLogForm
          setOpen={setOpen}
          setRefreshKey={setRefreshKey}
          projectId={projectId}
          taskId={taskId}
          logToEdit={logToEdit}
          open={false}
        />
      </ModalBody>
    </Modal>
  );
};

const AddTaskLogForm = ({
  setOpen,
  setRefreshKey,
  projectId,
  taskId,
  logToEdit,
}: TaskModalLogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    getValues,
    formState: { errors },
  } = useForm<AddTaskLogData>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const { createTaskLog, updateTaskLog } = useTaskContext();

  // Watch the rate_type field to dynamically show/hide form elements
  const rateType = watch("rate_type");

  useEffect(() => {
    if (logToEdit) {
      reset({
        allow_hours: logToEdit.allow_hours.toString(),
        no_worker: logToEdit.no_worker.toString(),
        rate: logToEdit.rate,
        rate_type: logToEdit.rate_type,
        shift_start: logToEdit.shift_start,
        shift_end: logToEdit.shift_end,
      });
    } else {
      reset();
    }
  }, [reset, logToEdit]);

  const handleAddTaskLog = async (logData: AddTaskLogData) => {
    try {
      let noWorker = parseInt(logData.no_worker, 10);
      if (isNaN(noWorker) || noWorker < 1) {
        enqueueSnackbar(
          "Please enter a valid number. The two nearest values are 3 and 4.",
          { variant: "error" }
        );
        return;
      }

      let formattedData: any = {
        no_worker: noWorker,
        rate: `${parseFloat(logData.rate).toFixed(2)}`,
        rate_type: logData.rate_type,
      };

      // Handle HOURLY case: Add shift_start and shift_end
      if (logData.rate_type === "HOURLY") {
        if (!logData.shift_start || !logData.shift_end) {
          enqueueSnackbar("Both shift start and shift end times are required.", { variant: "error" });
          return;
        }

        const shiftEndDate = new Date();
        const [shiftHours, shiftMinutes] = logData.shift_end
          ? logData.shift_end.split(":").map(Number)
          : [0, 0];
        shiftEndDate.setHours(shiftHours ?? 0, shiftMinutes, 0, 0);

        if (shiftEndDate < new Date()) {
          enqueueSnackbar(
            "The shift end time has already passed. You can't create task now...",
            { variant: "error" }
          );
          return;
        }

        formattedData = {
          ...formattedData,
          shift_start: logData.shift_start ? logData.shift_start.slice(0, 5) : "",
          shift_end: logData.shift_end ? logData.shift_end.slice(0, 5) : "",
        };
      }

      // Handle DAY case: Add allow_hours
      if (logData.rate_type === "DAY") {
        if (!logData.allow_hours) {
          enqueueSnackbar("Allow hours are required for the DAY rate.", { variant: "error" });
          return;
        }
        formattedData.allow_hours = parseFloat(logData.allow_hours);
      }

      // Call API based on the presence of logToEdit (whether updating or creating a new log)
      if (logToEdit?.id) {
        await updateTaskLog({projectId,
           taskId, 
           logId: logToEdit.id, 
           updatedData:formattedData
          });
          console.log(getValues(), errors);
          
      } else {
        await createTaskLog({
          projectId,
          taskId,
          logData: formattedData,
        });
      }

      setOpen(false);
      reset();
      setRefreshKey((prev) => prev + 1);
    } catch (error: any) {
      console.error("Failed to save task log", error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>

      <form className="space-y-2" onSubmit={handleSubmit(handleAddTaskLog)}>
        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900 text-xs">
            Number of Workers
          </label>
          <input
            className="input input-sm"
            placeholder="5"
            {...register("no_worker")}
          />
          {errors.no_worker && (
            <span className="text-danger text-xs">
              {errors.no_worker.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900 text-xs">Rate</label>
          <input
            type="number"
            step="0.01"
            className="input input-sm"
            placeholder="100"
            {...register("rate")}
          />
          {errors.rate && (
            <span className="text-danger text-xs">{errors.rate.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900 text-xs">Rate Type</label>
          <select className="input input-sm" {...register("rate_type")}>
            <option value="">Select Rate Type</option>
            <option value="DAY">DAY</option>
            <option value="HOURLY">HOUR</option>
          </select>
          {errors.rate_type && (
            <span className="text-danger text-xs">
              {errors.rate_type.message}
            </span>
          )}
        </div>

        {/* Show shift start and shift end only if rate type is HOURLY */}
        {rateType === "HOURLY" && (
          <>
            <div className="flex flex-col gap-1">
              <label className="form-label text-gray-900 text-xs">Shift Start</label>
              <Controller
                name="shift_start"
                control={control}
                render={({ field }) => (
                  <MobileTimePicker
                    value={field.value ? dayjs(`2023-01-01T${field.value}`) : null}
                    onChange={(newValue) => {
                      if (newValue) {
                        field.onChange(newValue.format("HH:mm"));
                      }
                    }}
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        sx: {
                          borderRadius: "150px", // Apply border radius to the input
                          "& .MuiOutlinedInput-root": {
                            // Target the root container of the input
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#000", // Change border color on hover
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderRadius: "150px", // Apply border radius to the fieldset
                              height: "2.5rem", // Set height of the fieldset
                              borderColor: "#ccc", // Set initial border color
                            },
                            "&:focus .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#000", // Change border color on focus
                            },
                            "&:focus": {
                              boxShadow: "0 0 0 2px rgba(5, 20, 36, 0.85)", // Apply custom box shadow on focus
                            },
                          },
                        },
                      },
                    }}
                  />
                )}
              />




              {errors.shift_start && (
                <span className="text-danger text-xs">{errors.shift_start.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="form-label text-gray-900 text-xs">Shift End</label>
              <Controller
                name="shift_end"
                control={control}
                render={({ field }) => (
                  <MobileTimePicker
                    value={field.value ? dayjs(`2023-01-01T${field.value}`) : null}
                    onChange={(newValue) => field.onChange(newValue ? newValue.format("HH:mm") : "")}
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        sx: {
                          borderRadius: "150px", // Apply border radius to the input
                          "& .MuiOutlinedInput-root": {
                            // Target the root container of the input
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#000", // Change border color on hover
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderRadius: "150px", // Apply border radius to the fieldset
                              height: "2.5rem", // Set height of the fieldset
                              borderColor: "#ccc", // Set initial border color
                              borderWidth: '1px'
                            },
                            "&:focus .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#000", // Change border color on focus
                            },
                            "&:focus": {
                              boxShadow: "0 0 0 2px rgba(5, 20, 36, 0.85)", // Apply custom box shadow on focus
                            },
                          },
                        },
                      },
                    }}
                  />
                )}
              />


              {errors.shift_end && (
                <span className="text-danger text-xs">{errors.shift_end.message}</span>
              )}
            </div>

          </>
        )}

        {/* Show allow_hours only if rate type is DAY */}
        {rateType === "DAY" && (
          <div className="flex flex-col gap-1">
            <label className="form-label text-gray-900 text-xs">
              Allowed Hours
            </label>
            <input
              type="number"
              step="0.01"
              className="input input-sm"
              placeholder="8"
              {...register("allow_hours")}
            />
            {errors.allow_hours && (
              <span className="text-danger text-xs">
                {errors.allow_hours.message}
              </span>
            )}
          </div>
        )}

        <div className="pt-2">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </LocalizationProvider>

  );
};

export default AddTaskLogModal;
