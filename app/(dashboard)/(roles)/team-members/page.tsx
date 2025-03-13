"use client";
import { useCallback, useEffect, useMemo, useState, useContext } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { UserContext } from "@/context/user/user-provider";
import { FaEdit } from "react-icons/fa";
import { DataGrid } from "@/components/data-grid";
import MemberModal from "@/components/ui/member-modal";
import { FaMagnifyingGlass } from "react-icons/fa6";
import team from "@/services/team-member/user";

const TeamMembers = () => {
  const userContext = useContext(UserContext);
  if (!userContext)
    throw new Error("UserContext must be used within UserProvider");

  const { updateUser, getUserRoles, getUserById } = userContext;

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>(searchQuery);
  const [openMemberModal, setOpenMemberModal] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [editMember, setEditMember] = useState<boolean>(false);
  const [roles, setRoles] = useState<Role>({ roles: [] });
  const [loadingRoles, setLoadingRoles] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState([]);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery); // Update debouncedSearch after delay
    }, 500); // Adjust debounce delay as needed
    return () => clearTimeout(handler);
  }, [searchQuery]); // Re-run effect when searchQuery changes
  

  const handleModalOpen = useCallback(
    async (isEdit: boolean, userId: number | null) => {
      try {
        setEditMember(isEdit);
        setOpenMemberModal(true);
        setLoadingRoles(true);

        if (isEdit && userId) {
          const userData: User = await getUserById(userId);

          setSelectedUser(userData);
        } else {
          setSelectedUser(null); // Reset selected user if it's "add"
        }

        const response = await getUserRoles();
        if (response?.data) {
          setRoles(response.data);
        }
      } catch (error: any) {
        console.error("Error in modal open:", error);
      } finally {
        setLoadingRoles(false);
      }
    },
    [getUserById, getUserRoles]
  );

  // Update member status
  const handleChange = useCallback(
    async (member: User) => {
      try {
        await updateUser({
          id: member.id,

          userData: {
            id: member.id,
            email: member.email,
            role: member.roleId as unknown as "admin" | "user",
            status: member.status,
            name: member.name,
          },
        });
      } catch (error: any) {
        console.error("Failed to update member status:", error);
      }
    },
    [updateUser]
  );

  // Table columns setup
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorFn: (row) => row.name,
        id: "name",
        header: () => "Name",
        cell: (info) => <div>{info.row.original.name}</div>,
        meta: { className: "min-w-[200px]" },
      },
      {
        accessorFn: (row) => row.email,
        id: "email",
        header: () => "Email",
        cell: (info) => (
          <div className="text-center">{info.row.original.email}</div>
        ),
        meta: { className: "min-w-[180px] text-center" },
      },
      {
        accessorFn: (row) => row.roles[0]?.name || "No Role", // Correctly accessing role
        id: "role",
        header: () => "Role",
        cell: (info) => (
          <div className="text-center">
            {info.row.original.roles && info.row.original.roles.length > 0
              ? info.row.original.roles[0].name
              : "No Role"}
          </div>
        ),
        meta: { className: "min-w-[180px]  text-center" },
      },
      {
        accessorFn: (row) => row.contact,
        id: "contact",
        header: () => "Contact",
        cell: (info) => (
          <div className="text-center">
            {info.row.original.contact || "----"}
          </div>
        ),
        meta: { className: "min-w-[180px]  text-center" },
      },
      {
        accessorFn: (row) => row.status,
        id: "status",
        header: () => "Status",
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <div className="status-text">
              <span
                className={`text-xs font-semibold ${
                  row.original.status === "ACTIVE"
                    ? "text-secondary"
                    : "text-red-500"
                }`}
              >
                {row.original.status === "ACTIVE" ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>
          </div>
        ),
        meta: { className: "min-w-[180px]  text-center" },
      },
      {
        id: "actions",
        header: () => "Actions",
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <button
              onClick={() => {
                setEditMember(true);
                setSelectedUserId(row.original.id);
                handleModalOpen(true, row.original.id);
              }}
            >
              <FaEdit />
            </button>
          </div>
        ),
        meta: { className: "w-[50px] text-center" },
      },
    ],
    [handleChange, users]
  );

  const fetchUsers = useCallback(async (data: PaginationParams) => {
    try {
      const searchParam = debouncedSearch 
  
      const response = await team.fetchUser({
        pageIndex: data.pageIndex,
        pageSize: data.pageSize,
        searchParam,
      });
  
      if (response && response.status === 200) {
        return {
          data: response.data.users.data || [],
          totalCount: response.data.users.total || 0,
        };
      }
      return { data: [], totalCount: 0 };
    } catch (error: any) {
      return { data: [], totalCount: 0 };
    }
  }, [debouncedSearch]);
  

  return (
    <div>
      <div className="card card-grid  min-h-svh h-full min-w-full ">
        <div className="card-header">
          <h1 className="text-primary-100 text-3xl font-bold w-full">
            Team Members
          </h1>
          <div className="flex items-center gap-2 w-full justify-end">
            <button
              className="btn btn-secondary rounded-full btn-sm"
              onClick={async () => {
                // Since this is an "Add Member" button, `userId` can be null.
                await handleModalOpen(false, null); // Providing both arguments
              }}
            >
              Add Member
            </button>
            <div className="input input-sm max-w-48">
              <FaMagnifyingGlass />
              <input
                type="text"
                placeholder="Search Members"
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
              loading: "Loading users...",
              empty: debouncedSearch ? "No users found" : "No users available",
            }}
            onFetchData={async (params) => {
              return await fetchUsers({
                pageIndex: params.pageIndex + 1,
                pageSize: params.pageSize,
                searchQuery: debouncedSearch,
              });
            }}
          />
        </div>
        <MemberModal
          open={openMemberModal}
          setOpen={setOpenMemberModal}
          editMember={editMember} // Pass the editMember state to control the form's behavior
          selectedUser={selectedUser} // Pass the selectedUser so the modal can display user data
          setRefreshKey={setRefreshKey}
          roles={roles}
        />
      </div>
    </div>
  );
};
export default TeamMembers;
