"use client";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { DataGrid } from "@/components/data-grid";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { GiProgression } from "react-icons/gi";
import FileUpload from "@/components/ui/file-uploadModal";
import ProjectService from "@/services/projects";
import { GoKebabHorizontal } from "react-icons/go";
import clsx from "clsx";
import { enqueueSnackbar } from "notistack";
import { secureStorage } from "@/utils/crypto";

const ProjectListings = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>(searchQuery);
  const [uploadFile, setUploadFile] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [defaultId, setDefaultId] = useState<string>("");

  const router = useRouter();

  const toggle = (id: string) => {
    setShow(true);
    setShowPopup((prev) => (prev === id ? "" : id));
  };

  const setAsDefault = async (data: { id: string }) => {
    setLoading(true);
    const res = await ProjectService.defaultProject({ id: data.id });
    secureStorage.setItem("defaultId", data.id);
    setDefaultId(data.id);

    if (res && res.status === 204) {
      setLoading(false);
      enqueueSnackbar("Project set successfully", { variant: "success" });
      toggle(data.id);
    }
  };

  const getDefaultProject = useCallback(async () => {
    const val = await secureStorage.getItem("defaultId");
    setDefaultId(val || "");
  }, []);

  useEffect(() => {
    getDefaultProject();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Table columns setup
  const columns = useMemo<ColumnDef<ProjectsType>[]>(() => {
    return [
      {
        accessorFn: (row) => row.title,
        id: "title",
        header: () => "Title",
        cell: (info) => (
          <div
            className={
              info.row.original.id === defaultId ? "text-success" : "text-red"
            }
          >
            {info.row.original.title || "----"}
          </div>
        ),
        meta: { className: "min-w-[160px]" },
      },
      {
        accessorFn: (row) => row.address,
        id: "address",
        header: () => "Address",
        cell: (info) => <div>{info.row.original.address || "----"}</div>,
        meta: { className: "min-w-[160px] " },
      },
      {
        accessorFn: (row) => row.total_budget,
        id: "total_budget",
        header: () => "Total Budget",
        cell: (info) => <div>{info.row.original.total_budget || "----"}</div>,
        meta: { className: "min-w-[160px]" }, // Added border-none
      },
      {
        accessorFn: (row) => row.employees,
        id: "employees",
        header: () => "Employees",
        cell: (info) => (
          <div>
            <span>{info.row.original.employees || "----"}</span>
          </div>
        ),
        meta: { className: "min-w-[160px]" }, // Added border-none
      },
      {
        accessorFn: (row) => row.status,
        id: "status",
        header: () => "Status",
        cell: (info) => (
          <div
            className={
              info.row.original.status === "overrun"
                ? "text-success"
                : "text-red-700"
            }
            title={
              info.row.original.status === "overrun" ? "On track" : "Over run"
            }
          >
            <span>
              <GiProgression className="size-4" />
            </span>
          </div>
        ),
        meta: { className: "min-w-[100px]" },
      },
      {
        accessorFn: (row) => row.status,
        id: "action",
        header: () => "Action",
        cell: ({ row }) => (
          <div className="relative text-left">
            <button onClick={() => toggle(row.original.id)}>
              <GoKebabHorizontal />
            </button>

            <div
              className={clsx(
                "popover min-w-32 bg-white z-10  absolute top-17 right-2",
                {
                  show: showPopup === row.original.id,
                }
              )}
            >
              {show && (
                <div
                  className="popover-body flex flex-col text-center p-0 "
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="btn hover:bg-gray-200 text-xs w-full px-2 h-8 "
                    onClick={() => {
                      router.push(`/project/${row.original.id}`);
                    }}
                  >
                    View
                  </button>

                  <button
                    className="btn hover:bg-gray-200 text-xs  w-full px-2 h-8"
                    onClick={() => setAsDefault({ id: row.original.id })}
                    disabled={loading}
                  >
                    Set As Default {""}
                  </button>
                </div>
              )}
            </div>
          </div>
        ),
        meta: { className: "min-w-[100px] text-left" },
      },
    ];
  }, [showPopup, loading, defaultId]);

  const fetchProject = useCallback(async (data: PaginationParams) => {
    try {
      setLoading(true);
      const response = await ProjectService.getAllProjects({
        pageIndex: data.pageIndex,
        pageSize: data.pageSize,
        searchQuery: data.searchQuery,
      });

      if (response && response.status === 200) {
        setLoading(false);

        const fetchedData = response.data.data.project.data;
        // setUsers(fetchedUsers);
        return {
          data: fetchedData || [],
          totalCount: response.data.data.project.total || 0,
        };
      }
      return { data: [], totalCount: 0 };
    } catch (error: any) {
      setLoading(false);
      return { data: [], totalCount: 0 };
    }
  }, []);
  return (
    <div>
      <div className="card card-grid min-h-svh h-full min-w-full ">
        <div className="flex flex-col lg:flex-row gap-4 p-6 border-b border-gray-200">
          <h1 className="text-primary-100 text-3xl font-bold w-full">
            Projects
          </h1>
          <div className="flex items-center gap-2 w-full lg:justify-end">
            <button
              className="btn btn-secondary rounded-full btn-sm"
              onClick={() => {
                setUploadFile(true); // Providing both arguments
              }}
            >
              <FaPlus className="w-5 h-5 p-1.5 bg-white text-secondary rounded-full" />
              <strong>Add Project</strong>
            </button>
            <div className="input input-sm max-w-48">
              <FaMagnifyingGlass />
              <input
                type="text"
                placeholder="Search projects"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Let useEffect handle fetching
              />
            </div>
          </div>
        </div>
        <div className="p-6">
          <DataGrid
            key={`${debouncedSearch}`}
            columns={columns}
            serverSide={true}
            messages={{
              loading: "Loading projects...",
              empty: debouncedSearch
                ? "No projects found"
                : "No Projects available",
            }}
            className="custom-table border-none divide-none"
            onFetchData={async (params) => {
              return await fetchProject({
                pageIndex: params.pageIndex + 1,
                pageSize: params.pageSize,
                searchQuery: debouncedSearch,
              });
            }}
          />
        </div>
      </div>
      <FileUpload isOpen={uploadFile} onClose={setUploadFile} />
    </div>
  );
};

export default ProjectListings;
