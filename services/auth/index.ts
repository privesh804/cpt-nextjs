import apiClient from "@/lib/client";
import handleApiError from "@/utils/handle-error";
import { enqueueSnackbar } from "notistack";

class AuthService {
  async logout() {
    try {
      const response = await apiClient.get("/logout");
      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }

  async requestPassword(email: string) {
    try {
      const response = await apiClient.post("/forgotpassword", {
        email,
      });
      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }
  async register(
    email: string,
    password: string,
    password_confirmation: string | undefined
  ) {
    try {
      let response = await apiClient.post("/register", {
        email,
        first_name: "DefaultName",
        last_name: "DefaultSurname",
        password,
        password_confirmation,
      });
      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }

  async login(data: { email: string; password: string; token: string }) {
    try {
      let response = await apiClient.post("/login", data);

      if (response && response.status === 200) {
        return response;
      }
    } catch (error: any) {
      handleApiError(error);
    }
  }

  async getUser(params: any) {
    try {
      let response = await apiClient.get(`/user`, {
        params,
      });
      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }

  async createUser(data: { userData: Partial<User> }) {
    try {
      const { status, ...dataToSend } = data.userData;

      let response = await apiClient.post(`/user/store`, dataToSend);
      return response;
    } catch (error: any) {
      console.log("error", error);
      handleApiError(error, error.response.data.message);
    }
  }

  async updateUser(data: { id: number; userData: Partial<User> }) {
    try {
      const { password, ...dataToSend } = data.userData;

      let response = await apiClient.put(`/user/${data.id}/update`, dataToSend);
      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }

  async verifyEmail(email: string) {
    try {
      let response = await apiClient.post(
        `${process.env.NEXT_PUBLIC_API_URL}/email-verify`,
        {
          email,
        }
      );
      return response;
    } catch (error: any) {
      handleApiError(error, error.response.data.message);
    }
  }
}

export default new AuthService();
