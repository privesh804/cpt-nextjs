import apiClient from "@/lib/client";
import handleApiError from "@/utils/handle-error";

// Project Services
class BudgetServices {
  async getBudgetReportByID(data: PaginationParamsWithProjectId) {
    try {
      const response = await apiClient.get<BudgetDataResponse>(
        `/budget-expense/report/${data.projectId}?pageIndex=${data.pageIndex}&pageSize=${data.pageSize}&searchText=${data.searchQuery}`
      );
      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }

  async getBudgeTracking(data: { projectId: string }) {
    try {
      const response = await apiClient.get(
        `/budget-expense/tracking/${data.projectId}`
      );
      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }

  async getProjectData(data: { projectId: string }) {
    try {
      const response = await apiClient.get(
        `/budget-expense/project-data/${data.projectId}`
      );

      return response.data;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }
}

export default new BudgetServices();
