import apiClient from "@/lib/client";
import handleApiError from "@/utils/handle-error";

class GanttServices {
  async getGanttData({ projectId }: { projectId: string }) {
    try {
      const response = await apiClient.get<GANTT_RESPONSE>(
        `/budget-expense/task-progress-data/${projectId}`
      );
      return response.data;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }
}

export default new GanttServices();
