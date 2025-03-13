"use client";

import { Modal, ModalBody, ModalHeader, ModalTitle } from "@/components/modal";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import taskKeywordService from "@/services/task-keyword";

interface TaskKeywordModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setRefreshKey: Dispatch<SetStateAction<number>>;
  editKeyword: { id: string; keyword: string } | null;
  setEditKeyword: Dispatch<
    SetStateAction<{ id: string; keyword: string } | null>
  >;
}

const TaskKeywordModal: React.FC<TaskKeywordModalProps> = ({
  open,
  setOpen,
  setRefreshKey,
  editKeyword,
  setEditKeyword,
}) => {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editKeyword) {
      setKeyword(editKeyword.keyword);
      setError("");
    } else {
      setKeyword("");
    }
  }, [editKeyword]);

  const handleClose = () => {
    setOpen(false);
    setEditKeyword(null);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!keyword.trim()) {
      setError("This field is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      if (editKeyword) {
        let response = await taskKeywordService.updateTaskKeyword({
          id: editKeyword.id,
          keyword: keyword,
        });
        if (response) {
          setOpen(false);
          setKeyword("");
          setEditKeyword(null);
          setRefreshKey((prev) => prev + 1);
        }
      } else {
        let response = await taskKeywordService.addTaskKeyword({
          keyword,
        });
        if (response) {
          setOpen(false);
          setKeyword("");
          setRefreshKey((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.error("Error submitting keyword:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open}>
      <ModalHeader>
        <ModalTitle>
          {editKeyword ? "Edit Task Keyword" : "Add Task Keyword"}
        </ModalTitle>
        <FaPlus className="rotate-45 cursor-pointer" onClick={handleClose} />
      </ModalHeader>
      <ModalBody>
        <form className="space-y-2" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label className="form-label text-gray-900 text-xs">
              {editKeyword ? "Edit Keyword" : "Add Keyword"}
            </label>
            <input
              className="input input-sm border ${error ? 'border-red-500' : 'border-gray-300'}"
              placeholder="Enter Keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="btn btn-secondary rounded-full"
              disabled={loading}
            >
              {editKeyword ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default TaskKeywordModal;
