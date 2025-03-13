import axios from "axios";
import { clearData } from "./localstorage";
import { enqueueSnackbar } from "notistack";

const handleApiError = (error: unknown, customMessage?: string) => {
  let errorMessage = customMessage || "An unexpected error occurred."; // Default message

  if (axios.isAxiosError(error)) {
    const status = error.status;

    // Handle specific HTTP status codes
    if (status === 401) {
      clearData();
      window.location.href = "/login"; // Redirect to login
      return;
    } else if (status === 403) {
      enqueueSnackbar("You do not have permission to perform this action.", {
        variant: "warning",
      });
      return;
    } else if (status === 422) {
      if (error.response?.data?.error) {
        const errorMessages = Object.values(error.response.data.error)
          .flat()
          .join(", ");

        enqueueSnackbar(errorMessages, { variant: "error" });
      }
    } else if (status === 400 && error.response?.data?.error) {
      enqueueSnackbar(error.response.data.error, { variant: "error" });
    } else {
      enqueueSnackbar(errorMessage, { variant: "error" });
      return;
    }
  }
};

export default handleApiError;
