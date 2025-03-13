"use client";
import { createContext, useState, Dispatch, SetStateAction } from "react";
import taskService from "@/services/task"; // Import task service to make API calls
import { enqueueSnackbar } from "notistack";
import handleApiError from "@/utils/handle-error";
interface TaskContextProps {
  tasks: Task[];
  task?: Task;
  setTasks: Dispatch<SetStateAction<Task[]>>;
  getTaskSection: (data:{projectId: string}) => Promise<any>;
  fetchTasks: (data: {
    projectId: string;
    pageIndex: number;
    pageSize: number;
    searchQuery: string;
  }) => Promise<{ data: Task[]; totalCount: number }>;
  createTask: (data: {
    projectId: string, // Include projectId in the type definition
    taskData: {
      name: string;
      start_date: string;
      end_date: string;
      status: string;
      progress: number;
      budget_allocated: string;
    }
  }) => Promise<void>;
  updateTask: (data: {
    projectId: string;
    taskId: string;
    updatedData: { // Change from `formData` to `updatedData`
      name?: string;
      start_date?: string;
      end_date?: string;
      status?: string;
      progress?: number;
      budget_allocated?: string;
    };
  }) => Promise<void>;
  
  deleteTask: (taskId: string) => Promise<void>;
  createTaskLog: (data: {
    projectId: string,
    taskId: string,
    logData: {
      no_worker: number;
      rate: string;
      rate_type: string;
      allow_hours: number;
    }
  }) => Promise<void>;
  updateTaskLog: (data:{
    projectId: string,
    taskId: string,
    logId: string,
    updatedData: {
      no_worker: number;
      rate: string;
      rate_type: string;
      allow_hours: number;
    }
}) => Promise<void>;
  changeLogStatus: ( data:{
    projectId: string,
    taskId: string,
    logId: string,
    updatedData: {
      status: string;
      reason: string;
    }
}) => Promise<void>;
  fetchTaskById: (data:{
    projectId: string,
    taskId: string
}) => Promise<{ data: Task[]; totalCount: number }>;
  viewTaskLogData: (data:{
    projectId: string,
    taskId: string,
    logId: string,
    pageIndex: number,
    pageSize: number,
    searchQuery: string
}) => Promise<{ data: []; totalCount: number }>;
}
const TaskContext = createContext<TaskContextProps | null>(null);
const TaskProvider = ({ children }: React.PropsWithChildren) => {
  const [tasks, setTasks] = useState<Task[]>([]); // State to hold the task list
  const [task, setTask] = useState<Task>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  // Fetch tasks by tenantId
  const fetchTasks = async (data: PaginationParamsWithProjectId) => {

    try {
      const searchParam = data.searchQuery
        ? `&searchText=${data.searchQuery}`
        : "&searchText=";
      const response = await taskService.getTaskList({
        projectId: data.projectId,
        pageIndex: data.pageIndex,
        pageSize: data.pageSize,
        searchParam,
      }); // Using the taskService to fetch tasks
      setTasks(response.data.task.data);
      return {
        data: response.data.task.data || [],
        totalCount: response.data.task.total,
      };
      
      // Assuming response.data contains the task list
    } catch (error: any) {
      console.error("Failed to fetch tasks");
      return {
        data: [],
        totalCount: 0,
      };
    }
  };
  const fetchTaskById = async (data:{projectId: string, taskId: string}) => {
    try {
      const res = await taskService.getTaskById(data);
      setTask(res.task);
      return {
        data: res.task.logs || [],
        totalCount: res.task.logs.length,
      };
    } catch (error: any) {
      console.error("Failed to fetch tasks");
      return {
        data: [],
        totalCount: 0,
      };
    }
  };
  const getTaskSection = async (data:{projectId: string}) => {
    return await taskService.getTaskSections(data);
  };
  // Create a new task
  const createTask = async (data: {


    projectId: string,
    taskData: {
      name: string;
      start_date: string;
      end_date: string;
      status: string;
      progress: number;
      budget_allocated: string;
    }
  }) => {
    try {
      const response = await taskService.createTask(data);
      
      setTasks([...tasks, response.data]);
      enqueueSnackbar("Task created successfully", { variant: "success" });
    } catch (error: any) {
      handleApiError(error);
    }
  };
  // Update an existing task
  const updateTask = async (data: {
    projectId: string;
    taskId: string;
    updatedData: {
      name?: string;
      start_date?: string;
      end_date?: string;
      status?: string;
      progress?: number;
      budget_allocated?: string;
    };
  }) => {
    try {
      const response = await taskService.updateTask(data);
      
      // Update tasks in state dynamically
      const updatedTasks = tasks.map((task) =>
        task.id === data.taskId ? { ...task, ...data.updatedData } : task
      );
      setTasks(updatedTasks);
  
      enqueueSnackbar("Task updated successfully", { variant: "success" });
    } catch (error: any) {
      handleApiError(error.response?.data?.message || "Failed to update task");
    }
  };
  
  // Delete a task
  const deleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId); // Using taskService to delete the task
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
      enqueueSnackbar("Task deleted successfully", { variant: "success" });
    } catch (error: any) {
      enqueueSnackbar("Failed to delete task", { variant: "error" });
    }
  };
  const createTaskLog = async (data: {
    projectId: string,
    taskId: string,
    logData: {
      no_worker: number;
      rate: string;
      rate_type: string;
      allow_hours: number;
    }
  }) => {
    try {
      await taskService.createTaskLog(data);
      enqueueSnackbar("Task log created successfully", { variant: "success" });
    } catch (error: any) { }
  };
  const updateTaskLog = async (data:{

  
    projectId: string,
    taskId: string,
    logId: string,
    updatedData: {
      no_worker: number;
      rate: string;
      rate_type: string;
      allow_hours: number;
    }
  }) => {
    try {
      await taskService.updateTaskLog(data);
      enqueueSnackbar("Task log updated successfully", { variant: "success" });
    } catch (error: any) {
      console.log("error", error);
    }
  };
  const viewTaskLogData = async (data: IdParams) => {
    try {
        const searchParam = data.searchQuery
            ? `&searchText=${data.searchQuery}`
            : "&searchText=";

        const response = await taskService.viewTaskLogData({
            projectId: data.projectId,
            taskId: data.taskId,
            logId: data.logId,
            pageIndex: data.pageIndex,
            pageSize: data.pageSize,
            searchParam
        });

        const logs = response.task_log.history; // Rename `data` to `logs`
        return {
            data: logs || [],
            totalCount: logs?.length || 0
        };
    } catch (error: any) {
        console.error("Failed to fetch log details");
        return {
            data: [],
            totalCount: 0
        };
    }
};

  const changeLogStatus = async (data:{
    projectId: string,
    taskId: string,
    logId: string,
    updatedData: {
      status: string;
      reason: string;
    }
 } ) => {
    try {
      await taskService.changeLogStatus(data);
      enqueueSnackbar("Task log status updated successfully", {
        variant: "success",
      });
    } catch (error: any) {
      console.log("error", error);
    }
  };
  return (
    <TaskContext.Provider
      value={{
        tasks,
        task,
        getTaskSection,
        setTasks,
        fetchTasks,
        fetchTaskById,
        createTask,
        updateTask,
        deleteTask,
        createTaskLog,
        updateTaskLog,
        viewTaskLogData,
        changeLogStatus,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
export { TaskContext, TaskProvider };
