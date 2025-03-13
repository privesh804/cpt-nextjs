import apiClient from "@/lib/client";
import handleApiError from "@/utils/handle-error";

class TeamMemberService {
  async fetchUser(data: { pageIndex: number; pageSize: number; searchParam: string }) {
    try {
      return await apiClient.get<TemaDataResponse>("/user/", {
        params: {
          pageIndex: data.pageIndex,
          pageSize: data.pageSize,
          searchText: data.searchParam, // Ensure the search text is passed correctly
        },
      });
    } catch (error: any) {
      handleApiError(error, error.response?.data?.message || "An error occurred");
    }
  }
}


export default new TeamMemberService();
