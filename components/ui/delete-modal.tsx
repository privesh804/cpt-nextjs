"use client";
import { useState } from "react";
import { Modal, ModalBody, ModalHeader, ModalTitle } from "@/components/modal";
import { FaPlus } from "react-icons/fa6";
import { useOutsideClick } from "@/hooks/useOutsideClick";

export const DeleteModal = ({
  open,
  setOpen,
  handleDelete,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: () => Promise<void>;
}) => {
  const [loading, setLoading] = useState(false);
  const ref = useOutsideClick(() => {
    setOpen(false);
  });

  const handleClick = async () => {
    setLoading(true);
    try {
      await handleDelete();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} ref={ref}>
      <ModalHeader>
        <ModalTitle>Delete Section</ModalTitle>
        <FaPlus
          className="rotate-45 cursor-pointer"
          onClick={() => setOpen(false)}
        />
      </ModalHeader>
      <ModalBody>
        <p>Are you sure you want to delete ?</p>

        <div className="flex items-center gap-2 w-full justify-end p-3">
          <button
            className="btn  rounded-full border-danger-active btn-danger btn-sm"
            onClick={handleClick}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
          <button
            className="btn  rounded-full btn-primary btn-sm"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};
