import apiClient from "@/lib/client";
import handleApiError from "@/utils/handle-error";

class TaskService {
  async fetchTenants(data: {
    pageIndex: number;
    pageSize: number;
    searchParam: string;
  }) {
    try {
      return await apiClient.get<TenantDataResponse>(
        `/tenant/?pageIndex=${data.pageIndex}&pageSize=${data.pageSize}${data.searchParam}`
      );
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }

  async inviteTenant(data: { email: string }) {
    try {
      return await apiClient.post<{ url: string }>("/invite-tenant", data);
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }

  async createTenant(data: {
    code: string;
    name: string;
    domain: string;
    password: string;
  }) {
    try {
      return await apiClient.post<any>("/create-tenant", data);
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }
}

export default new TaskService();
