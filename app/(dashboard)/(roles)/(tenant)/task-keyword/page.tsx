"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { DataGrid } from "@/components/data-grid";
import { FaMagnifyingGlass } from "react-icons/fa6";
import taskKeywordService from "@/services/task-keyword";
import TaskKeywordModal from "@/components/ui/task-keyword-modal";
import { DeleteModal } from "@/components/ui/delete-modal";

const TaskKeyword = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [openMemberModal, setOpenMemberModal] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [editKeyword, setEditKeyword] = useState<KeywordType | null>(null);

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setOpenDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      let response = await taskKeywordService.deleteTaskKeyword({ deleteId });
      if (response && response.status === 204) {
        setRefreshKey((prev) => prev + 1);
        setOpenDeleteModal(false);
        await fetchTaskKeyword({
          pageIndex: 1,
          pageSize: 10,
          searchQuery: "",
        });
      }
    } catch (error: any) {
      console.error("Failed to delete task keyword", error);
    }
  };

  const handleEditClick = async (id: string) => {
    try {
      const response = await taskKeywordService.getTaskKeywordById({ id });
      if (response) {
        setEditKeyword({ id, keyword: response.data.keyword });
        setOpenMemberModal(true);
      }
    } catch (error) {
      console.error("Failed to edit task keyword", error);
    }
  };
  const fetchTaskKeyword = useCallback(async (data: PaginationParams) => {
    try {
      const searchParam = debouncedSearch
        ? `&searchText=${searchQuery}`
        : "&searchText=";
      const response = await taskKeywordService.getTaskKeyword({
        pageIndex: data.pageIndex,
        pageSize: data.pageSize,
        searchQuery: data.searchQuery,
      });
      if (response && response.status === 200) {
        return {
          data: response.data.data.keywords.data || [],
          totalCount: response.data.data.keywords.total || 0,
        };
      }
      return { data: [], totalCount: 0 };
    } catch (error: any) {
      return { data: [], totalCount: 0 };
    }
  }, []);

  const columns = useMemo<ColumnDef<KeywordType, any>[]>(
    () => [
      {
        accessorFn: (row) => row.keyword,
        id: "keyword",
        header: () => "Keyword",
        cell: (info) => <div>{info.row.original.keyword}</div>,
        meta: { className: "min-w-[200px]" },
      },
      {
        accessorFn: (row) => row,
        id: "action",
        header: () => "Action",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <button onClick={() => handleEditClick(row.original.id)}>
              <FaEdit />
            </button>
            <button
              className="text-red-500 hover:text-red-700 transition-colors"
              aria-label="Delete"
              title="Delete"
              onClick={() => confirmDelete(row.original.id)}
            >
              <FaTrashAlt />
            </button>
          </div>
        ),
        meta: { className: "w-[50px] text-left" },
      },
    ],
    [fetchTaskKeyword]
  );

  return (
    <div>
      <div className="card card-grid min-h-svh h-full min-w-full ">
        <div className="card-header">
          <h1 className="text-primary-100 text-3xl font-bold w-full">
            Task Keyword
          </h1>
          <div className="flex items-center gap-2 w-full justify-end">
            <button
              className="btn btn-secondary rounded-full btn-sm"
              onClick={() => setOpenMemberModal(true)}
            >
              Add Task Keyword
            </button>
            <div className="input input-sm max-w-48">
              <FaMagnifyingGlass />
              <input
                type="text"
                placeholder="Search Task Keyword"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="card-body">
          <DataGrid
            key={`${debouncedSearch}-${refreshKey}`}
            columns={columns}
            serverSide={true}
            messages={{
              loading: "Loading Task Keyword...",
              empty: debouncedSearch
                ? "No Task keyword found"
                : "No Task Keyword available",
            }}
            onFetchData={async (params) => {
              return await fetchTaskKeyword({
                pageIndex: params.pageIndex + 1,
                pageSize: params.pageSize,
                searchQuery: debouncedSearch,
              });
            }}
          />
        </div>
      </div>

      <TaskKeywordModal
        open={openMemberModal}
        setOpen={setOpenMemberModal}
        setRefreshKey={setRefreshKey}
        editKeyword={editKeyword}
        setEditKeyword={setEditKeyword}
      />

      <DeleteModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default TaskKeyword;
