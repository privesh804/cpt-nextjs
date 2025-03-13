"use client";
import { useState, useEffect, useMemo } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import TenantModal from "@/components/ui/tenant-modal";
import { DataGrid } from "@/components/data-grid";
import { ColumnDef } from "@tanstack/react-table";
import tenant from "@/services/tenant";

const Tenant = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [openTenantModal, setOpenTenantModal] = useState<boolean>(false);

  // Debounce effect for search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      {
        accessorKey: "name",
        id: "name",
        header: () => "Name",
        cell: (info) => <div>{info.row.original.name || "---"}</div>,
        meta: { className: "min-w-[200px]" },
      },
      {
        accessorFn: (row) => row.email,
        id: "email",
        header: () => "Email",
        cell: (info) => <div>{info.row.original.email || "---"}</div>,
        meta: { className: "min-w-[180px]" },
      },
      {
        accessorFn: (row) => row.domains?.[0]?.domain,
        id: "domain",
        header: () => "Domain",
        cell: (info) => (
          <div>{info.row.original.domains?.[0]?.domain || "---"}</div>
        ),
        meta: { className: "min-w-[180px]" },
      },
    ],
    []
  );

  // Fetch tenants with search query and pagination
  const fetchTenants = async (data: PaginationParams) => {
    try {
      const searchParam = searchQuery
        ? `&searchText=${searchQuery}`
        : "&searchText=";

      const response = await tenant.fetchTenants({
        pageIndex: data.pageIndex,
        pageSize: data.pageSize,
        searchParam,
      });

      if (response && response.status === 200) {
        return {
          data: response.data.tenants.data || [], // Access the nested data array
          totalCount: response.data.tenants.total || 0, // Access the total count from the correct path
        };
      }
      return { data: [], totalCount: 0 };
    } catch (error: any) {
      return { data: [], totalCount: 0 };
    }
  };

  return (
    <div className="card card-grid min-w-full min-h-svh h-full ">
      <div className="card-header">
        <h1 className="text-primary-100 text-3xl font-bold">Tenants</h1>

        <div className="flex items-center gap-2 w-full justify-end">
          <button
            className="btn btn-secondary rounde btn-sm"
            onClick={() => setOpenTenantModal(true)}
          >
            Invite Tenant
          </button>
          <div className="input input-sm max-w-48">
            <FaMagnifyingGlass />
            <input
              type="text"
              placeholder="Search Tenants"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Immediate search query update
            />
          </div>
        </div>
      </div>

      <div className="card-body">
        <DataGrid
          key={debouncedSearch}
          columns={columns}
          serverSide={true}
          messages={{
            loading: "Loading tenants...",
            empty: debouncedSearch
              ? "No tenants found"
              : "No tenants available",
          }}
          onFetchData={async (params) => {
            return await fetchTenants({
              pageIndex: params.pageIndex + 1,
              pageSize: params.pageSize,
              searchQuery: debouncedSearch,
            });
          }}
        />
      </div>

      <TenantModal open={openTenantModal} setOpen={setOpenTenantModal} />
    </div>
  );
};

export default Tenant;
