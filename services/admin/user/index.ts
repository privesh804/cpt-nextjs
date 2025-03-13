import apiClient from "@/lib/client";
import handleApiError from "@/utils/handle-error";
import axios from "axios";

class UserService {
  async getUserById(userId: number): Promise<any> {
    try {
      const response = await apiClient.get(`/user/${userId}/edit`);
      return response.data;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }
  async getUserRoles(): Promise<any> {
    try {
      const response = await apiClient.get<Role>(`/user/create`);
      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }
  async addRole(newRoleName: string): Promise<any> {
    try {
      const response = await apiClient.post("/role/store", {
        name: newRoleName,
      });
      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }

  async saveEdit(editedRoleName: string, roleId: any): Promise<any> {
    try {
      const response = await apiClient.put(`/role/${roleId}/update`, {
        name: editedRoleName,
      });

      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }

  async switchChange(roleId: string, payload: any): Promise<any> {
    try {
      const response = await apiClient.post(`/role/${roleId}/permission`, {
        payload,
      });

      return response;
    } catch (error: any) {
      console.log("error", error);
      handleApiError(error, error.response.data.message);
    }
  }

  async getRole(): Promise<any> {
    try {
      const response = await apiClient.get(`/role/`);
      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }

  async getPermission(): Promise<any> {
    try {
      const response = await apiClient.get(`/permission/`);
      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }

  async fetchAdmin() {
    try {
      const response = await axios.get<AdminData>("/data/admin.json");
      return response.data;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }
}

export default new UserService();
