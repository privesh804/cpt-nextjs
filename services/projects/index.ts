import apiClient from "@/lib/client";
import handleApiError from "@/utils/handle-error";
import { enqueueSnackbar } from "notistack";

// Project Services
class ProjectServices {
  async getProjectById(userId: number) {
    try {
      const response = await apiClient.get(`/user/${userId}/edit`);
      return response.data;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }

  async addProject(newRoleName: string) {
    try {
      const response = await apiClient.post("/role/store", {
        name: newRoleName,
      });
      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }

  async uploadBoq(file: File) {
    try {
      const formData = new FormData();
      formData.append("excel_file", file);

      const response = await apiClient.post(
        "/task-management/project/upload-boq",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.error);
    }
  }


  // async fetchUser(data: { pageIndex: number; pageSize: number; searchParam: string }) {
  //   try {
  //     return await apiClient.get<TemaDataResponse>("/user/", {
  //       params: {
  //         pageIndex: data.pageIndex,
  //         pageSize: data.pageSize,
  //         searchText: data.searchParam, // Ensure the search text is passed correctly
  //       },
  //     });
  //   } catch (error: any) {
  //     handleApiError(error, error.response?.data?.message || "An error occurred");
  //   }


  //==================================done===========================
  async getAllProjects(data: {
    pageIndex: number;
    pageSize: number;
    searchQuery: string;
  }): Promise<any> {
    try {
      const response = await apiClient.get<ProjectDataResponse>(
        `/task-management/project?pageIndex=${data.pageIndex}&pageSize=${data.pageSize}&searchText=${data.searchQuery}`
      );
      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }

  async getProjectDetailsById(data: { id: string }) {
    try {
      const response = await apiClient.get(
        `/task-management/project/${data.id}`
      );
      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }

  //============================done==========================
  async getProjectSectionDetails(
    id: string,
    data: {
      pageIndex: number;
      pageSize: number;
      searchParam: string;
    }
  ) {
    try {
      const response = await apiClient.get<ProjectSectionResponse>(
        `/task-management/project/${id}/section?pageIndex=${data.pageIndex}&pageSize=${data.pageSize}${data.searchParam}`
      );
      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }

  // =========================================done====================================
  async getProjectSectionDetailById(
    id: string,
    section_id: string,
    data: {
      pageIndex: number;
      pageSize: number;
      searchParam: string;
    }
  ): Promise<any> {
    try {
      const response = await apiClient.get<ProjectSectionDataResponse>(
        `/task-management/project/${id}/section/${section_id}/detail?pageIndex=${data.pageIndex}&pageSize=${data.pageSize}${data.searchParam}`
      );
      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }

  //=====================done=========================
  async deleteProjectSectionItemById(data: {
    projectId: string;
    section_id: string;
    deleteItemId: string;
  }): Promise<any> {
    try {
      const response = await apiClient.delete(
        `/task-management/project/${data.projectId}/section/${data.section_id}/detail/${data.deleteItemId}/delete`
      );
      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }

  //====================================done============================
  async deleteSection(data: { sectionId: string; id: string }) {
    try {
      const response = await apiClient.delete(
        `/task-management/project/${data.id}/section/${data.sectionId}/delete`
      );
      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }

  //=============================================done////////////////////////////
  async updateProjectDetails(data: { id: string; details: any }) {
    try {
      const response = await apiClient.put(
        `/task-management/project/${data.id}/update`,
        data.details
      );
      if (response && response?.status === 200) {
        enqueueSnackbar("Updated successfully", { variant: "success" });
      }
      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }

  //=================================done=============================
  async defaultProject(data: { id: string }) {
    try {
      const response = await apiClient.patch(
        `task-management/project/${data.id}/make-primary`
      );
      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }

  async getProjectName() {
    try {
      const response = await apiClient.get(`task-management/list-project`);
      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }

  async createTaskByItemId(data: { projectId: string; selectedId: string[] }) {
    try {
      const response = await apiClient.post(
        `task-management/create-task-by-item-id/${data.projectId}`,
        {
          items_id: data.selectedId,
        }
      );
      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }
}

export default new ProjectServices();
