import apiClient from "@/lib/client"; // Import your API client
import handleApiError from "@/utils/handle-error";
import { enqueueSnackbar } from "notistack";

class TaskKeywordService {
  async getTaskKeyword(data: {
    pageIndex: number;
    pageSize: number;
    searchQuery: string;
  }) {
    try {
      const response = await apiClient.get<TaskKeywordDataResponse>(
        `/task-keywords/list/?pageIndex=${data.pageIndex}&pageSize=${data.pageSize}&searchText=${data.searchQuery}`
      );
      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }

  async getTaskKeywordById(data: { id: string }) {
    try {
      const response = await apiClient.get(`/task-keywords/view/${data.id}`);
      return response.data;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }

  async updateTaskKeyword(data: { id: string; keyword: string }) {
    try {
      const response = await apiClient.put(`/task-keywords/update/${data.id}`, {
        keyword: data.keyword,
      });
      if (response) {
        enqueueSnackbar("Task keyword updated successfully", {
          variant: "success",
        });
      }

      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }

  async addTaskKeyword(data: { keyword: string }) {
    try {
      const response = await apiClient.post(`/task-keywords/create`, {
        keyword: data.keyword,
      });
      if (response && response.status === 201) {
        enqueueSnackbar("Task Keyword created successfully", {
          variant: "success",
        });
      }

      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }

  async deleteTaskKeyword(data: { deleteId: string }) {
    try {
      const response = await apiClient.delete(
        `/task-keywords/delete/${data.deleteId}`
      );
      if (response && response.status === 204) {
        enqueueSnackbar("Task keyword deleted successfully", {
          variant: "success",
        });
      }

      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }
}

export default new TaskKeywordService();
