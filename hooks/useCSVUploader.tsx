// hooks/useCSVUploader.ts
import { useState } from "react";
import ProjectServices from "@/services/projects/index";
import { enqueueSnackbar } from "notistack";
import { AxiosResponse } from "axios";

interface UseCsvUploader {
  uploadCsv: (file: File) => Promise<AxiosResponse<any, any> | undefined>;
  isUploading: boolean;
}

export const useCsvUploader = (): UseCsvUploader => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadCsv = async (
    file: File
  ): Promise<AxiosResponse<any, any> | undefined> => {
    if (!file) return;

    setIsUploading(true);

    try {
      // Upload file using the service
      const response = await ProjectServices.uploadBoq(file);
      if (response && response.status === 200) {
        enqueueSnackbar("File uploaded successfully", { variant: "success" });
        return response;
      }
    } catch (error: any) {
      console.log("error", error);
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadCsv, isUploading };
};
