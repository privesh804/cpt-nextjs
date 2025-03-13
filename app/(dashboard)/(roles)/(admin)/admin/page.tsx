"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { ColumnDef } from "@tanstack/react-table";
import ContractorCard from "@/components/dashboard/contractor-cards";

import {
  updateAdmin,
  addAdmins,
  setAdminLoading,
} from "@/redux/features/admin.slice";
import Link from "next/link";
import { DataGrid } from "@/components/data-grid";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import user from "@/services/admin/user";

const Admin = () => {
  const dispatch = useAppDispatch();
  const { admins } = useAppSelector((state) => state.adminData);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleChange = useCallback(
    (admin: Admin) => {
      dispatch(
        updateAdmin({
          ...admin,
          status: !admin.status,
        })
      );
    },
    [dispatch]
  );

  const columns = useMemo<ColumnDef<Admin, any>[]>(
    () => [
      {
        id: "reg",
        accessorKey: "reg",
        header: () => "Reg",
        enableSorting: true,
        meta: { className: "min-w-[135px]" },
      },
      {
        accessorFn: (row) => row.name,
        id: "name",
        header: () => "Company/Clients",
        enableSorting: true,
        cell: (info) => (
          <div className="text-left">
            <Link
              className="font-medium text-sm text-gray-900 hover:text-primary"
              href="#"
            >
              {info.row.original.name}
            </Link>
          </div>
        ),
        meta: { className: "min-w-[280px] text-left" },
      },
      {
        accessorFn: (row) => row.email,
        id: "email",
        header: () => "Email",
        enableSorting: true,
        cell: (info) => (
          <div className="text-left">
            <Link
              className="font-medium text-sm text-gray-900 hover:text-primary"
              href="#"
            >
              {info.row.original.email}
            </Link>
          </div>
        ),
        meta: { className: "min-w-[135px] text-left" },
      },
      {
        accessorFn: (row) => row.contact,
        id: "contact",
        header: () => "Contact",
        enableSorting: true,
        cell: (info) => (
          <div className="text-left">
            <Link
              className="font-medium text-sm text-gray-900 hover:text-primary"
              href="#"
            >
              {info.row.original.contact}
            </Link>
          </div>
        ),
        meta: { className: "min-w-[135px] text-left" },
      },
    ],
    [handleChange]
  );

  const fetchAdmins = useCallback(async () => {
    try {
      dispatch(setAdminLoading(true));
      const res = await user.fetchAdmin();
      if (res?.data) dispatch(addAdmins(res?.data));
    } catch (error: any) {
      console.error("Failed to fetch data:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const filteredAdmins = useMemo(() => {
    if (!searchQuery) return admins;
    return admins.filter(
      (admin) =>
        admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [admins, searchQuery]);

  return (
    <div className="card card-grid h-auto min-w-full">
      <div className="card-header flex flex-col sm:flex-row justify-between gap-4">
        <h3 className="card-title flex gap-2">
          <span
            onClick={() => setIsClient(true)}
            className={`cursor-pointer ${
              isClient ? "text-black font-semibold" : "text-gray-400"
            }`}
          >
            Clients
          </span>
          <span
            onClick={() => setIsClient(false)}
            className={`cursor-pointer ${
              !isClient ? "text-black font-semibold" : "text-gray-400"
            }`}
          >
            Contractors
          </span>
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <button className="btn btn-primary btn-sm w-full sm:w-auto">
            Add Admin
          </button>
          <div className="input input-sm flex items-center w-full xl:w-40 sm:w-20 md:w-30">
            <FaMagnifyingGlass />
            <input
              type="text"
              placeholder="Search Admins"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {isClient ? (
        <div className="card-body overflow-x-auto">
          <DataGrid data={filteredAdmins} columns={columns} />
        </div>
      ) : (
        <div className="w-full rounded-2xl p-6 flex flex-col gap-4.5 bg-tertiary">
          <ContractorCard />
        </div>
      )}
    </div>
  );
};

export default Admin;
