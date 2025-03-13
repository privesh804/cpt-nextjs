"use client";

import { useMemo, useState } from "react";
import { Modal, ModalBody, ModalHeader, ModalTitle } from "@/components/modal";
import { FaPlus } from "react-icons/fa6";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { DataGrid } from "../data-grid";
import { useTaskContext } from "@/context/task/task-context";
import { ColumnDef } from "@tanstack/react-table";

export const LogHistoryModal = ({
  open,
  setOpen,
  projectId,
  id,
  logId,
  taskId,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  projectId: string;
  id: string;
  logId: string;
  taskId: string;

}) => {
  const { viewTaskLogData } = useTaskContext();
  const ref = useOutsideClick(() => {
    setOpen(false);
  });

  const columns = useMemo<ColumnDef<TaskLogHistory, any>[]>(
    () => [
      {
        id: "no_of_workers",
        header: () => "No of workers",
        meta: { className: "min-w-[120px]" },
        cell: ({ row }) =>
          row.original.data ? (
            <div>{JSON.parse(row.original.data).data.no_worker}</div>
          ) : null,
      },
      {
        id: "rate",
        header: () => "Rate",
        meta: { className: "min-w-[120px]" },
        cell: ({ row }) =>
          row.original.data ? (
            <div>{JSON.parse(row.original.data).data.rate}</div>
          ) : null,
      },
      {
        id: "rate_type",
        header: () => "Rate Type",
        meta: { className: "min-w-[120px]" },
        cell: ({ row }) =>
          row.original.data ? (
            <div>{JSON.parse(row.original.data).data.rate_type}</div>
          ) : null,
      },
      {
        id: "allow_hours",
        header: () => "Allowed Hours",
        meta: { className: "min-w-[120px]" },
        cell: ({ row }) =>
          row.original.data ? (
            <div>{JSON.parse(row.original.data).data.allow_hours}</div>
          ) : null,
      },
      {
        id: "total_hours",
        header: () => "Total Hours",
        meta: { className: "min-w-[120px]" },
        cell: ({ row }) =>
          row.original.data ? (
            <div>{JSON.parse(row.original.data).data.total_hours}</div>
          ) : null,
      },
    ],
    []
  );

  return (
    <Modal open={open} ref={ref} className="!w-1/2">
      <ModalHeader>
        <ModalTitle>Log History</ModalTitle>
        <FaPlus
          className="rotate-45 cursor-pointer"
          onClick={() => setOpen(false)}
        />
      </ModalHeader>
      <ModalBody>
        <DataGrid
          columns={columns}
          serverSide={true}
          onFetchData={async (params) => {
            if (projectId && id && logId) {
              return await viewTaskLogData({
                projectId: projectId,
                taskId: taskId,
                logId: logId,
                pageIndex: params.pageIndex + 1,
                pageSize: params.pageSize,
                searchQuery: params.searchParam,
              });
            } else {
              return {
                data: [],
                totalCount: 0,
              };
            }
          }}
        />
      </ModalBody>
    </Modal>
  );
};
