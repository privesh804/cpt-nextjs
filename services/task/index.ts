import apiClient from "@/lib/client"; // Import your API client
import handleApiError from "@/utils/handle-error";
import { enqueueSnackbar } from "notistack";
class TaskService {
  // Fetch task list by tenantId
  async getTaskList(data: {
    projectId: string;
    pageIndex: number;
    pageSize: number;
    searchParam: string;
  }) {
    try {
      
      const response = await apiClient.get<TaskManagementDataResponse>(
        `/task-management/list/${data.projectId}?pageIndex=${data.pageIndex}&pageSize=${data.pageSize}&${data.searchParam}`
      );
      return response.data;
    } catch (error: any) {
      handleApiError(error.response.data.message);
      throw error;
    }
  }
  async getTaskById(data:{projectId: string, taskId: string}) {
    try {
      const response = await apiClient.get(
        `task-management/view/${data.projectId}/task/${data.taskId}`
      );
      return response.data;
    } catch (error: any) {
      handleApiError(error.response.data.message);
      throw error;
    }
  }
  // Create a new task
  async createTask( data:{projectId: string, taskData: any}) {
    try {
      const response = await apiClient.post(
        `/task-management/create/${data.projectId}`,
        data.taskData
      );
      return response;
    } catch (error: any) {
      handleApiError(error.response.data.message);
      throw error;
    }
  }
  async getTaskSections(data:{projectId: string}) {
    try {
      return await apiClient.get(`/task-management/create/${data.projectId}`);
    } catch (error: any) {
      handleApiError(error.response.data.message);
    }
  }
  // Update an existing task
  async updateTask(data: { projectId: string; taskId: string; updatedData: {}; }) {
    // async createTask( data:{projectId: string, taskData: any}) {

    try {
      const response = await apiClient.put(
        `/task-management/update/${data.projectId}/task/${data.taskId}`,
        data.updatedData
      );
      return response;
    } catch (error: any) {
      handleApiError(error);
      throw error;
    }
  }
  // Delete a task
  async deleteTask(taskId: string) {
    try {
      const response = await apiClient.delete(
        `/task-management/delete/${taskId}`
      );
      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
      throw error;
    }
  }
  async createTaskLog( data:{
    projectId: string,
     taskId: string,
      logData:any
 } ) 

      {
    try {
      const response = await apiClient.post(
        `/task-management/create/${data.projectId}/task/${data.taskId}`,
        data.logData
      );
      enqueueSnackbar("Task log created successfully", { variant: "success" });
      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
      throw error;
    }
  }
  async updateTaskLog(data:{

  
    projectId: string,
    taskId: string,
    logId: string,
    updatedData: {}
  }) {
    try {
      const response = await apiClient.put(
        `/task-management/create/${data.projectId}/task/${data.taskId}/log/${data.logId}`,
        data.updatedData
      );
      enqueueSnackbar("Task log updated successfully", { variant: "success" });
      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
      throw error;
    }
  }
  async viewTaskLogData(data:{

  
    projectId: string,
    taskId: string,
    logId: string,
    pageIndex: number,
    pageSize: number,
    searchParam: string
  }) {
    try {
      const response = await apiClient.get(
        `/task-management/create/${data.projectId}/task/${data.taskId}/log/${data.logId}?pageIndex=${data.pageIndex}&pageSize=${data.pageSize}&${data.searchParam}`
      );
      return response.data;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }
  async changeLogStatus(data:{
    projectId: string,
    taskId: string,
    logId: string,
    updatedData: {}
  }) {
    try {
      const response = await apiClient.patch(
        `/task-management/create/${data.projectId}/task/${data.taskId}/log/${data.logId}`,
        data.updatedData
      );
      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
      throw error;
    }
  }
}
export default new TaskService();
