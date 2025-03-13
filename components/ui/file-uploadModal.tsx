"use client";
import React, { useState, useCallback, SetStateAction } from "react";
import { useDropzone } from "react-dropzone";
import { Modal, ModalBody, ModalHeader, ModalTitle } from "@/components/modal";
import { useCsvUploader } from "@/hooks/useCSVUploader";
import { useAppDispatch } from "@/redux/store";
import { setOrderLoading } from "@/redux/features/order.slice";
import { enqueueSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa6";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: React.Dispatch<SetStateAction<boolean>>;
  details?: any[];
}

const FileUpload: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  details,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { uploadCsv, isUploading } = useCsvUploader();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    multiple: false,
    onDropAccepted: (files) => {
      if (files.length > 0) {
        const file = files[0];
        const fileExtension = file.name.split(".").pop()?.toLowerCase();

        if (fileExtension !== "xlsx") {
          enqueueSnackbar("Only .xlsx files are allowed", { variant: "error" });
          return;
        }

        setSelectedFile(file);
      }
    },
  });

  const handleModalClose = useCallback(() => {
    if (details && details.length === 0) {
      return;
    }
    setSelectedFile(null);
    onClose(false);
  }, [onClose, details]);

  const handleConfirm = async () => {
    if (!selectedFile) {
      enqueueSnackbar("Please select a file first", { variant: "warning" });
      return;
    }

    dispatch(setOrderLoading(true));
    try {
      const response: any = await uploadCsv(selectedFile);
      handleModalClose();
      // Optional: Redirect or refresh data after successful upload
      if (response?.status === 200 || response?.data?.data?.project_id) {
        router.push(`/project/${response?.data?.data.project_id}`);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      dispatch(setOrderLoading(false));
    }
  };

  return (
    <Modal
      open={isOpen}
      setOpen={onClose}
      className="!w-half mx-auto relative z-[1100]"
    >
      <ModalHeader className="relative z-[1100]">
        <ModalTitle>
          {details?.length === 0
            ? "Create Your Project First... "
            : "Upload Your Project"}
        </ModalTitle>

        {details?.length === 0 ? (
          ""
        ) : (
          <FaPlus
            className="rotate-45 cursor-pointer"
            onClick={handleModalClose}
          />
        )}
      </ModalHeader>
      <ModalBody className="p-6 relative z-[1100] h-[300px]">
        <div>
          <div
            className="border-2 border-dashed border-gray-300 p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="text-gray-500">Drop the file here...</p>
            ) : (
              <p className="text-gray-500">
                {selectedFile
                  ? `Selected: ${selectedFile.name}`
                  : "Click or drag and drop your Excel file here"}
              </p>
            )}
          </div>
          <div className="fixed w-full bg-white flex justify-end gap-4 bottom-4 border-t border-gray-400 pt-4 pe-4 md:pe-10 right-0">
            {details?.length === 0 ? (
              ""
            ) : (
              <button
                onClick={handleModalClose}
                className="btn text-danger btn-sm justify-center border-1 border-solid border-danger"
                disabled={isUploading}
              >
                Cancel
              </button>
            )}

            <button
              onClick={handleConfirm}
              className="btn btn-primary btn-sm flex justify-center"
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? "Uploading..." : "Confirm"}
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default FileUpload;
