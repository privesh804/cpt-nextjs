import { useContext } from "react";
import { TaskContext } from "./task-provider"; // Import the task provider context

export const useTaskContext = () => {
  const context = useContext(TaskContext);

  if (!context)
    throw new Error("useTaskContext must be used within TaskProvider");

  return context;
};
