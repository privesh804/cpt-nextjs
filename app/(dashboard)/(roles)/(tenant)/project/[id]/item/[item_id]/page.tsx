"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
// import { Modal, ModalBody, ModalHeader, ModalTitle } from "../modal";
import { FaTrashAlt } from "react-icons/fa";
import { ColumnDef } from "@tanstack/react-table";
import { DataGrid } from "@/components/data-grid";
import ProjectService from "@/services/projects";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { DeleteModal } from "@/components/ui/delete-modal";
import { enqueueSnackbar } from "notistack";
import { FaMagnifyingGlass } from "react-icons/fa6";

const SectionDetails = () => {
  // const searchParams = useSearchParams();
  const { item_id, id } = useParams();
  const section_id = item_id as string;
  const projectId = id as string;

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [count, setCount] = useState<number>(0);
  const [debouncedSearch, setDebouncedSearch] = useState<string>(searchQuery);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteItemId, setDeleteItemId] = useState<string>("");
  const [sectionName, setSectionName] = useState<string>("");

  const openDeleteModal = (id: string) => {
    setShowDeleteModal(true);
    setDeleteItemId(id);
  };

  const [headerType, setHeaderType] = useState<number>(1);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchProjectSection = useCallback(
    async (data: PaginationParams) => {
      if (!section_id || !projectId) {
        return { data: [], totalCount: 0, pageCount: 0 };
      }

      try {
        const searchParam = searchQuery
          ? `&searchText=${searchQuery}`
          : "&searchText=";

        const response = await ProjectService.getProjectSectionDetailById(
          projectId,
          section_id,
          {
            pageIndex: data.pageIndex,
            pageSize: data.pageSize,
            searchParam,
          }
        );

        if (response && response?.status === 200) {
          const fetchedData = response.data.data.project_section_detail.data;
          setSectionName(response.data.data.project_section.section_name);

          // Set header type based on first item (assuming all items in a section have same header_type)
          if (fetchedData && fetchedData.length > 0) {
            setHeaderType(fetchedData[0].header_type);
          }

          return {
            data: fetchedData || [],
            totalCount: response.data.data.project_section_detail.total || 0,
            pageCount: response.data.data.project_section_detail.last_page || 1,
          };
        }
        return { data: [], totalCount: 0, pageCount: 0 };
      } catch (error: any) {
        return { data: [], totalCount: 0, pageCount: 0 };
      }
    },
    [projectId, section_id]
  );

  const createTask = async () => {
    try {
      if (selectedIds.length === 0) {
        enqueueSnackbar("Please select the Id to create the task", {
          variant: "error",
        });
      } else {
        let response = await ProjectService.createTaskByItemId({
          projectId: projectId,
          selectedId: selectedIds,
        });
        if (response && response.status === 201) {
          setSelectedIds([]);
          enqueueSnackbar("Task created Successfully", { variant: "success" });

          const checkboxes = document.querySelectorAll(
            'input[type="checkbox"]'
          );
          checkboxes.forEach((checkbox) => {
            (checkbox as HTMLInputElement).checked = false;
          });
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleDelete = async () => {
    if (!deleteItemId || !projectId || !section_id || isDeleting) return;

    try {
      setIsDeleting(true);

      const response = await ProjectService.deleteProjectSectionItemById({
        projectId,
        section_id,
        deleteItemId,
      });
      if (response && response.status === 204) {
        enqueueSnackbar("Section Deleted Successfully", {
          variant: "success",
        });
        setShowDeleteModal(false);
        setCount((prev) => prev + 1);
        await fetchProjectSection({
          pageIndex: 1,
          pageSize: 10,
          searchQuery: debouncedSearch,
        });
      }
    } catch (error) {
      console.log("error", error);
      console.error("Error deleting row:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const generateColumnsByHeaderType = (
    headerType: number
  ): ColumnDef<ProjectSectionItem>[] => {
    const checkBoxColumns: ColumnDef<ProjectSectionItem>[] = [
      {
        accessorFn: (row) => row.id,
        id: "id",
        header: () => "Id",
        cell: (info) => {
          const handleCheckboxChange = (
            e: React.ChangeEvent<HTMLInputElement>,
            id: string
          ) => {
            if (e.target.checked) {
              setSelectedIds((prev) => [...prev, id]);
            } else {
              setSelectedIds((prev) =>
                prev.filter((selectedId) => selectedId !== id)
              );
            }
          };

          return (
            <input
              type="checkbox"
              onChange={(e) => handleCheckboxChange(e, info.row.original.id)}
            />
          );
        },
        meta: { className: "min-w-[80px] text-left" },
      },
    ];

    const baseColumns: ColumnDef<ProjectSectionItem, any>[] = [
      {
        accessorFn: (row) => row.item_no,
        id: "itemNo",
        header: () => "Item No.",
        cell: (info) => <div>{info.getValue() || "---"}</div>,
        meta: { className: "min-w-[100px]" },
      },
      {
        accessorFn: (row) => row.description,
        id: "description",
        header: () => "Description",
        cell: (info) => <div>{info.getValue() || "---"}</div>,
        meta: { className: "min-w-[160px]" },
      },
    ];

    let additionalColumns: ColumnDef<ProjectSectionItem, any>[] = [];

    if (headerType === 1) {
      additionalColumns = [
        {
          accessorFn: (row) => row.time_related_charges_xcd,
          id: "timeRelatedCharges",
          header: () => "Time Related Charges XCD",
          cell: (info) => (
            <div className="text-left">
              {info.row.original.time_related_charges_xcd
                ? Number(info.row.original.time_related_charges_xcd).toFixed(2)
                : "---"}
            </div>
          ),
          meta: { className: "min-w-[220px] text-left" },
        },
        {
          accessorFn: (row) => row.fixed_charges_xcd,
          id: "fixedCharges",
          header: () => "Fixed Charges XCD",
          cell: (info) => (
            <div className="text-left">
              {info.row.original.fixed_charges_xcd
                ? Number(info.row.original.fixed_charges_xcd).toFixed(2)
                : "---"}
            </div>
          ),
          meta: { className: "min-w-[150px] text-left" },
        },
      ];
    }

    // Type 2: Item, Description, Quantity, Unit, Rate XCD, Amount XCD
    else if (headerType === 2) {
      additionalColumns = [
        {
          accessorFn: (row) => row.quantity,
          id: "quantity",
          header: () => "Quantity",
          cell: (info) => (
            <div className="text-left">
              {info.row.original.quantity || "---"}
            </div>
          ),
          meta: { className: "min-w-[100px] text-left" },
        },
        {
          accessorFn: (row) => row.unit,
          id: "unit",
          header: () => "Unit",
          cell: (info) => <div>{info.row.original.unit || "---"}</div>,
          meta: { className: "min-w-[80px]" },
        },
        {
          accessorFn: (row) => row.rate_xcd,
          id: "rateXcd",
          header: () => "Rate XCD",
          cell: (info) => (
            <div className="text-left">
              {info.row.original.rate_xcd
                ? Number(info.row.original.rate_xcd).toFixed(2)
                : "---"}
            </div>
          ),
          meta: { className: "min-w-[120px] text-left" },
        },
        {
          accessorFn: (row) => row.amount_xcd,
          id: "amountXcd",
          header: () => "Amount XCD",
          cell: (info) => (
            <div className="text-left">
              {info.row.original.amount_xcd
                ? Number(info.row.original.amount_xcd).toFixed(2)
                : "---"}
            </div>
          ),
          meta: { className: "min-w-[120px] text-left" },
        },
      ];
    }

    // Type 3: Item, Description, Unit Rate XCD/Hr.
    else if (headerType === 3) {
      additionalColumns = [
        {
          accessorFn: (row) => row.rate_per_hour_xcd,
          id: "ratePerHour",
          header: () => "Unit Rate XCD/Hr.",
          cell: (info) => (
            <div className="text-left">
              {info.row.original.rate_per_hour_xcd
                ? Number(info.row.original.rate_per_hour_xcd).toFixed(2)
                : "---"}
            </div>
          ),
          meta: { className: "min-w-[150px] text-left" },
        },
      ];
    }

    // Type 4: Item, Description, Unit, Unit Rate XCD
    else if (headerType === 4) {
      additionalColumns = [
        {
          accessorFn: (row) => row.unit,
          id: "unit",
          header: () => "Unit",
          cell: (info) => <div>{info.row.original.unit || "---"}</div>,
          meta: { className: "min-w-[80px]" },
        },
        {
          accessorFn: (row) => row.rate_xcd,
          id: "unitRate",
          header: () => "Unit Rate XCD",
          cell: (info) => (
            <div className="text-left">
              {info.row.original.rate_xcd
                ? Number(info.row.original.rate_xcd).toFixed(2)
                : "---"}
            </div>
          ),
          meta: { className: "min-w-[120px] text-left" },
        },
      ];
    }

    // Type 5: Item, Description, Rate - XCD/Hr., Rate - XCD /Day
    else if (headerType === 5) {
      additionalColumns = [
        {
          accessorFn: (row) => row.rate_per_hour_xcd,
          id: "ratePerHour",
          header: () => "Rate - XCD/Hr.",
          cell: (info) => (
            <div className="text-left">
              {info.row.original.rate_per_hour_xcd
                ? Number(info.row.original.rate_per_hour_xcd).toFixed(2)
                : "---"}
            </div>
          ),
          meta: { className: "min-w-[130px] text-left" },
        },
        {
          accessorFn: (row) => row.rate_per_day_xcd,
          id: "ratePerDay",
          header: () => "Rate - XCD/Day",
          cell: (info) => (
            <div className="text-left">
              {info.row.original.rate_per_day_xcd
                ? Number(info.row.original.rate_per_day_xcd).toFixed(2)
                : "---"}
            </div>
          ),
          meta: { className: "min-w-[130px] text-left" },
        },
      ];
    }

    // Type 6: Item, Description, Amount XCD
    else if (headerType === 6) {
      additionalColumns = [
        {
          accessorFn: (row) => row.amount_xcd,
          id: "amountXcd",
          header: () => "Amount XCD",
          cell: (info) => (
            <div className="text-left">
              {info.row.original.amount_xcd
                ? Number(info.row.original.amount_xcd).toFixed(2)
                : "---"}
            </div>
          ),
          meta: { className: "min-w-[120px] text-left" },
        },
      ];
    }

    // Add the action column with delete button
    const actionColumn: ColumnDef<ProjectSectionItem, any> = {
      accessorFn: (row) => row.id,
      id: "actions",
      header: () => "Actions",
      cell: (info) => (
        <button
          onClick={() => openDeleteModal(info.row.original.id)}
          className="text-red-500 hover:text-red-700 transition-colors"
          aria-label="Delete"
          title="Delete"
        >
          <FaTrashAlt />
        </button>
      ),
      meta: { className: "min-w-[80px] text-left" },
    };

    return [
      checkBoxColumns,
      baseColumns,
      additionalColumns,
      actionColumn,
    ].flat();
  };

  // Generate dynamic columns based on header type
  const columns = useMemo(() => {
    return generateColumnsByHeaderType(headerType);
  }, [headerType]);

  // Handler for fetching project section data

  const handleBack = () => {
    router.push(`/project/${projectId}`);
  };

  // Effect to debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <>
      <div>
        <div className="flex justify-start ml-2 mb-4">
          <button
            className="btn btn-primary btn-sm rounded-[40px] "
            onClick={handleBack}
          >
            Back
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="card-header px-4 flex flex-row justify-between">
            <p className="capitalize font-semibold max-w-[50%] w-full line-clamp-1">
              {sectionName || "---"}
            </p>
            <div className="flex justify-end space-y-1 w-full text-sm text-end gap-3">
              <div className="input input-sm max-w-48 float-end">
                <FaMagnifyingGlass />
                <input
                  type="text"
                  placeholder="Search items"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="btn btn-primary btn-sm mb-2 h-7 rounded-full ">
                <button onClick={() => createTask()}>Create Task</button>
              </div>
            </div>
          </div>
          <DataGrid
            key={`${debouncedSearch}-${headerType}+${count}`}
            columns={columns}
            serverSide={true}
            messages={{
              loading: "Loading section details...",
              empty: debouncedSearch
                ? "No section details found"
                : "No section details available",
            }}
            onFetchData={async (params) => {
              // setSelectedIds([]);
              // const checkboxes = document.querySelectorAll(
              //   'input[type="checkbox"]'
              // );
              // checkboxes.forEach((checkbox) => {
              //   (checkbox as HTMLInputElement).checked = false;
              // });
              return await fetchProjectSection({
                pageIndex: params.pageIndex + 1,
                pageSize: params.pageSize,
                searchQuery: debouncedSearch,
              });
            }}
          />
        </div>
        <DeleteModal
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          handleDelete={handleDelete}
        />
      </div>
    </>
  );
};

export default SectionDetails;
