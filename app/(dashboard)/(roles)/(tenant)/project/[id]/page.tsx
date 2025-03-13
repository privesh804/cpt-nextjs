"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataGrid } from "@/components/data-grid";
import { GoKebabHorizontal } from "react-icons/go";
import clsx from "clsx";
import ProjectService from "@/services/projects";
import { useParams, useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { DeleteModal } from "@/components/ui/delete-modal";

interface BoqType {
  id: string;
  order_id: number;
  section_name: number;
  total_cost: number;
  project_id: number;
}

const Project = () => {
  const router = useRouter();

  const { id } = useParams();
  const [show, setShow] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [showPopup, setShowPopup] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteItemId, setDeleteItemId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>(searchQuery);

  const [formData, setFormData] = useState<projectUpdateDetails>({
    title: "",
    address: "",
    nature: "",
    employer: "",
    project_name: "",
  });

  const toggle = (id: string) => {
    setShow(true);
    setShowPopup((prev) => (prev === id ? "" : id));
  };

  const fetchProjectSection = useCallback(async (data: PaginationParams) => {
    try {
      const searchParam = searchQuery
        ? `&searchText=${searchQuery}`
        : "&searchText=";

      const response = await ProjectService.getProjectSectionDetails(
        String(id),
        {
          pageIndex: data.pageIndex,
          pageSize: data.pageSize,
          searchParam,
        }
      );

      if (response && response?.status === 200) {
        const fetchedData = response.data.data.project_section.data;

        return {
          data: fetchedData || [],
          totalCount: response.data.data.project_section.total || 0,
          pageCount: response.data.data.project_section.last_page || 1,
        };
      }
      return { data: [], totalCount: 0 };
    } catch (error: any) {
      return { data: [], totalCount: 0 };
    }
  }, []);

  const openDeleteModal = (id: string) => {
    setShowDeleteModal(true);
    setDeleteItemId(id);
    setLoading(true);
  };

  const handleDelete = async () => {
    try {
      if (deleteItemId) {
        setLoading(true);
        const response = await ProjectService.deleteSection({
          sectionId: deleteItemId,
          id: String(id),
        });

        if (response && response.status === 204) {
          enqueueSnackbar("Section Deleted Successfully", {
            variant: "success",
          });
          setLoading(false);
          setCount((prev) => prev + 1);
          await fetchProjectSection({
            pageIndex: 1,
            pageSize: 10,
            searchQuery: "",
          });
          toggle(String(id));
        }
      }
    } finally {
      setShowDeleteModal(false);
      setLoading(false);
    }
  };

  const columns = useMemo<ColumnDef<BoqType, any>[]>(
    () => [
      {
        accessorFn: (row) => row.order_id,
        id: "orderId",
        header: () => "Order Id",
        cell: (info) => <div>{info.row.original.order_id || "---"}</div>,
        meta: { className: "min-w-[80px] " },
      },
      {
        accessorFn: (row) => row.section_name,
        id: "sectionName",
        header: () => "Section Name",
        cell: (info) => (
          <div className="text-primary text-left">
            {info.row.original.section_name || "---"}
          </div>
        ),
        meta: { className: "min-w-[180px] text-left " },
      },
      {
        accessorFn: (row) => row.section_name,
        id: "totalCost",
        header: () => "Total Cost",
        cell: (info) => (
          <div className="text-primary text-left">
            {info.row.original.total_cost || "---"}
          </div>
        ),
        meta: { className: "min-w-[180px] text-left " },
      },

      {
        accessorFn: (row) => row,
        id: "action",
        header: () => "Action",
        cell: ({ row }) => (
          <div>
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
                    className="popover-body flex flex-col gap-2   "
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => {
                        router.push(`/project/${id}/item/${row.original.id}`);
                      }}
                      className="btn !h-full !p-0 text-xs  "
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => openDeleteModal(row.original.id)}
                      className="btn !h-full !p-0 text-xs "
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ),
        meta: { className: "min-w-[100px] text-left " },
      },
    ],
    [showPopup, fetchProjectSection, id]
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchProjectByID = useCallback(async (data: { id: string }) => {
    try {
      const response = await ProjectService.getProjectDetailsById({
        id: data.id,
      });
      if (response && response.status === 200) {
        const fetchedData = response.data.data.project;
        setFormData({
          title: fetchedData?.title || "",
          address: fetchedData?.address || "",
          project_name: fetchedData?.project_name || "",
          nature: fetchedData?.nature || "",
          employer: fetchedData?.employer || "",
        });
        return {
          data: fetchedData || [],
          totalCount: fetchedData.length || 0,
        };
      }
      return { data: [], totalCount: 0 };
    } catch (error: any) {
      return { data: [], totalCount: 0 };
    }
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await ProjectService.updateProjectDetails({
        id: String(id),
        details: formData,
      });
      if (res?.status === 200) {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/project");
  };
  useEffect(() => {
    fetchProjectByID({ id: String(id) });
  }, []);

  return (
    <div>
      <div className="card card-grid h-auto min-w-full px-3 my-4">
        <div className="card-header flex flex-row justify-between">
          <p className="capitalize font-semibold">{formData.title}</p>
          <div className="space-y-1 w-1/4 text-sm text-end">
            <div className="flex justify-end gap-2">
              <button
                className="btn btn-primary btn-sm rounded-[40px]"
                onClick={handleBack}
              >
                Back
              </button>
            </div>
          </div>
        </div>
        <hr />

        <div className="my-4">
          <div className="flex flex-row p-4">
            <label
              htmlFor="title"
              className="form-label w-full max-w-48 text-gray-900"
            >
              Title
            </label>

            <div className="w-full max-w-48">
              <input
                id="title"
                placeholder="Enter Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input input-sm w-full max-w-48 p-2 border rounded-md"
              />
            </div>
          </div>
          <div className="flex flex-row p-5">
            <label
              htmlFor="address"
              className="form-label w-full max-w-48 text-gray-900"
            >
              Address
            </label>
            <div className="w-full max-w-48">
              {" "}
              <textarea
                id="address"
                name="address"
                placeholder="Enter address"
                value={formData.address}
                onChange={handleChange}
                className="textarea textarea-sm w-full max-w-48 p-2 border rounded-md"
              />
            </div>
          </div>
          <div className="flex flex-row p-5">
            <label
              htmlFor="project"
              className="form-label w-full max-w-48 text-gray-900"
            >
              Employer
            </label>

            <div className="w-full max-w-48">
              {" "}
              <textarea
                id="employer"
                name="employer"
                placeholder="Enter Employer"
                value={formData.employer}
                onChange={handleChange}
                className="textarea textarea-sm w-full max-w-48 p-2 border rounded-md"
              />
            </div>
          </div>
          <div className="flex flex-row p-5">
            <label
              htmlFor="project"
              className="form-label w-full max-w-48 text-gray-900"
            >
              Nature Of Projects
            </label>

            <div className="w-full max-w-48">
              {" "}
              <textarea
                id="nature"
                name="nature"
                placeholder="Enter nature of project"
                value={formData.nature}
                onChange={handleChange}
                className="textarea textarea-sm w-full max-w-48 p-2 border rounded-md"
              />
            </div>
          </div>
          <div className="flex flex-row p-5">
            <label
              htmlFor="project"
              className="form-label w-full max-w-48 text-gray-900"
            >
              Project Name
            </label>

            <div className="w-full max-w-48">
              {" "}
              <textarea
                id="project_name"
                name="project_name"
                placeholder="Enter Project Name"
                value={formData.project_name}
                onChange={handleChange}
                className="textarea textarea-sm w-full max-w-48 p-2 border rounded-md"
              />
            </div>
          </div>
          <div className="p-5">
            <button
              className="btn btn-success btn-sm rounded-[40px]"
              onClick={handleUpdate}
              disabled={loading}
            >
              Update Project
            </button>
          </div>
        </div>

        <hr className="border border-primary-light" />
        <div className="px-3 space-y-4 my-8">
          <h3 className="font-semibold">Bills</h3>

          <div className="p-6 ">
            <DataGrid
              key={count}
              columns={columns}
              serverSide={true}
              messages={{
                loading: "Loading bills...",
                empty: "No bills available",
              }}
              onFetchData={async (params) => {
                return await fetchProjectSection({
                  pageIndex: params.pageIndex + 1,
                  pageSize: params.pageSize,
                  searchQuery: debouncedSearch,
                });
              }}
            />
          </div>
        </div>
      </div>

      <DeleteModal
        open={showDeleteModal}
        setOpen={setShowDeleteModal}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default Project;
