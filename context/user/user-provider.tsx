"use client";

import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useCallback,
  useState,
} from "react";
import user from "@/services/admin/user";
import authService from "@/services/auth";

interface UserContextProps {
  isLoading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  users: User[];
  totalUsers: number;
  setUsers: Dispatch<SetStateAction<User[]>>;
  selectedUser: User | undefined;
  setSelectedUser: Dispatch<SetStateAction<User | undefined>>;
  getUsers: (
    page: number,
    pageSize: number,
    searchQuery?: string
  ) => Promise<void>;
  getUserById: (id: number) => Promise<User>;
  createUser: (userData: Partial<User>) => Promise<void>;
  updateUser: (data: { id: number; userData: Partial<User> }) => Promise<void>;
  getUserRoles: () => Promise<AxiosResponse<Role, any>>;
  handlePageChange?: any;
  handlePageSizeChange?: any;
}

const UserContext = createContext<UserContextProps | null>(null);

const UserProvider = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  // const [user, setUser] = useState<User | undefined>();
  const router = useRouter();

  /**
   * ✅ Get Users with Pagination & Search
   */
  const getUsers = useCallback(
    async (page: number, pageSize: number): Promise<void> => {
      try {
        const params = {
          page: page + 1,
          pageSize,
          sorting: JSON.stringify([{ id: "name", desc: false }]),
        };

        const response = await authService.getUser(params);

        if (response?.data?.users) {
          setUsers(response.data.users.data || []);
          setTotalUsers(response.data.total || 0);
        }
      } catch (error: any) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      }
    },
    []
  );

  /**
   * ✅ Get User by ID
   */
  const getUserById = async (userId: number) => {
    try {
      return await user.getUserById(userId);
    } catch (error: any) {
      console.error(error.response.data.message, "Failed to fetch user data.");
    }
  };

  /**
   * ✅ Get User Roles
   */
  const getUserRoles = useCallback(async () => {
    try {
      return await user.getUserRoles();
    } catch (error: any) {
      console.error(error.response.data.message, "Failed to fetch user roles.");
    }
  }, []);

  /**
   * ✅ Create User
   */
  const createUser = useCallback(
    async (userData: Partial<User>) => {
      try {
        if (!userData?.name || !userData?.email || !userData?.contact) {
          enqueueSnackbar("Please provide all required fields", {
            variant: "warning",
          });
          return;
        }

        const response = await authService.createUser({ userData });
        if (response && response?.status === 201) {
          setUsers((prevUsers) => [...prevUsers, response?.data]);

          enqueueSnackbar("Member created successfully", {
            variant: "success",
          });
        }
      } catch (error: any) {
        enqueueSnackbar(error.response.data.message);
        const errorMessage =
          error.response?.data?.message || "Failed to create user.";

        // Show the backend error message in the snackbar
        enqueueSnackbar(errorMessage, {
          variant: "error",
        });
      }
    },
    [getUsers]
  );

  /**
   * ✅ Update User
   */
  const updateUser = useCallback(
    async (data: { id: number; userData: Partial<User> }) => {
      try {
        let res = await authService.updateUser({
          id: data.id,
          userData: data.userData,
        });
        if (res && res.status == 201) {
          enqueueSnackbar("Member updated successfully", {
            variant: "success",
          });
        }
      } catch (error: any) {
        console.error(error.response.data.message, "Failed to update user.");
      }
    },
    []
  );

  /**
   * ✅ Delete User
   */
  // const deleteUser = useCallback(async (id: number) => {
  //   try {
  //     await apiClient.delete(`/user/${id}`);
  //     enqueueSnackbar("User deleted successfully", { variant: "success" });

  //     // Update UI after deletion
  //     setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  //   } catch (error) {
  //      console.error(error, "Failed to delete user.");
  //   }
  // }, []);

  return (
    <UserContext.Provider
      value={{
        // user,
        // saveUser,
        isLoading: loading,
        setLoading,
        users,
        setUsers,
        selectedUser,
        setSelectedUser,
        getUsers,
        getUserById,
        createUser,
        updateUser,
        // deleteUser,
        getUserRoles,
        totalUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
