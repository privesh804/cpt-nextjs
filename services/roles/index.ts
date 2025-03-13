import apiClient from "@/lib/client";
import handleApiError from "@/utils/handle-error";
import { AxiosResponse } from "axios";
import { enqueueSnackbar } from "notistack";

// Project Services
class RoleService {
  async fetchRoles() {
    try {
      const response = await Promise.all([
        apiClient.get("role/"),
        apiClient.get("permission/"),
      ]);
      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
      return error;
    }
  }

  async addRole(data: { newRoleName: string }) {
    try {
      let res = await apiClient.post("role/store", {
        name: data.newRoleName,
      });
      if (res && res.status === 201) {
        enqueueSnackbar("Added role successfully", { variant: "success" });
      }
      return res;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
      return error;
    }
  }

  async saveRole(data: {
    roleId: string;
    editedRoleName: string;
  }): Promise<AxiosResponse<any>> {
    try {
      let res = await apiClient.put(`role/${data.roleId}/update`, {
        name: data.editedRoleName,
      });
      if (res && res.status === 200) {
        enqueueSnackbar("Role saved  successfully", { variant: "success" });
      }
      return res;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
      return error;
    }
  }

  async changePermission(data: {
    roleId: string;
    data: {
      permission_name: string;
      permission_status: boolean;
    };
  }) {
    try {
      let res = await apiClient.post(`role/${data.roleId}/permission`, {
        permission_name: data.data.permission_name,
        permission_status: data.data.permission_status,
      });

      if (res && res.status === 200) {
        enqueueSnackbar("Updated successfully", { variant: "success" });
      }
      return res;
    } catch (error: any) {
      handleApiError(error, error.response.data.error);
      return error;
    }
  }
}

export default new RoleService();
