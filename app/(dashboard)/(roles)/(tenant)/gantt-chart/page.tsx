"use client";

import React, { useEffect, useState } from "react";
import { Gantt, Task, ViewMode } from "@rsagiev/gantt-task-react-19";
import "@rsagiev/gantt-task-react-19/dist/index.css";
import ganttService from "@/services/gantt";
import { useAppSelector } from "@/redux/store";

const today = new Date();

const addDays = (date: Date, days: number) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

const getTaskStyles = (task: Task) => {
  const isOverdue = task.end < today;
  const isCompleted = task.progress === 100;

  if (isCompleted && isOverdue) {
    return {
      progressColor: "orange",
      progressSelectedColor: "darkorange",
      backgroundColor: "#A9A9A9",
    };
  } else if (isOverdue && !isCompleted) {
    return {
      progressColor: "red",
      progressSelectedColor: "darkred",
      backgroundColor: "#A9A9A9",
    };
  } else {
    return task.styles;
  }
};

const getDueStatus = (task: Task) => {
  const daysLeft = Math.ceil(
    (task.end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysLeft < 0) {
    return `Overdue by ${Math.abs(daysLeft)} days`;
  } else if (daysLeft === 0) {
    return "Due today!";
  } else {
    return `Due in ${daysLeft} days`;
  }
};

type CustomTooltipProps = {
  task: Task;
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({ task }) => {
  return (
    <div
      style={{
        padding: "12px",
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "4px",
        boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <p className="text-[12px] text-black-600 max-w-60">
        <strong>{task.name}</strong>
      </p>
      <p className="text-[12px] text-gray-600" style={{ margin: 0 }}>
        Start: {task.start.toDateString()}
      </p>
      <p className="text-[12px] text-gray-600" style={{ margin: 0 }}>
        End: {task.end.toDateString()}
      </p>
      <p className="text-[12px] text-green-600" style={{ margin: 0 }}>
        Progress:{" "}
        <span style={{ fontWeight: "bold", color: "green" }}>
          {task.progress}%
        </span>
      </p>
      <p
        className="font-normal text-primary-100 text-xs truncate"
        style={{ margin: 0, color: task.end < today ? "red" : "blue" }}
      >
        {getDueStatus(task)}
      </p>
    </div>
  );
};

const GanttChart: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Day);

  const [constructionTasks, setConstructionTasks] = useState<GANTT_DATA[]>([]);
  const { projectId } = useAppSelector((state) => state.project);

  useEffect(() => {
    const fetchData = async () => {
      if (projectId) {
        const data = await ganttService.getGanttData({ projectId });
        if (data) {
          setConstructionTasks(data.data);
        }
      }
    };

    if (projectId) fetchData();
  }, [projectId]);
  console.log(constructionTasks);

  return (
    <div style={{ width: "100%", height: "600px", padding: "10px" }}>
      {/* Dropdown for Filter */}
      <div className="flex items-center mb-4">
        <label htmlFor="viewMode" className="text-gray-700 font-semibold mr-2">
          Filter by:
        </label>
        <select
          id="viewMode"
          className="select-sm select max-w-32"
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value as ViewMode)}
        >
          <option value={ViewMode.Day}>Day</option>
          <option value={ViewMode.Week}>Week</option>
          <option value={ViewMode.Month}>Month</option>
          <option value={ViewMode.Year}>Year</option>
        </select>
      </div>

      {constructionTasks.length > 0 ? (
        <Gantt
          TaskListTable={({ tasks, ...props }) =>
            tasks.map((task) => (
              <div
                key={task.id}
                className="border border-gray-300 border-t border-b-0 last:border-b first:border-t-0 border-r-0 px-2 overflow-hidden flex items-start justify-center flex-col"
                style={{
                  height: props.rowHeight,
                  width: "220px",
                  fontFamily: props.fontFamily,
                  fontSize: props.fontSize,
                }}
              >
                <p className="line-clamp-1 text-ellipsis">{task.name}</p>
              </div>
            ))
          }
          TaskListHeader={(props) => (
            <div
              className="border border-gray-300 border-r-0 px-2 text-left flex items-center"
              style={{
                height: props.headerHeight,
                width: "220px",
                fontFamily: props.fontFamily,
                fontSize: props.fontSize,
              }}
            >
              Task Name
            </div>
          )}
          tasks={constructionTasks.map((item) => ({
            ...item,
            start: new Date(item.start),
            end: new Date(item.end),
            type: "task",
          }))}
          viewMode={viewMode}
          TooltipContent={CustomTooltip}
          columnWidth={120}
        />
      ) : null}
    </div>
  );
};

export default GanttChart;
