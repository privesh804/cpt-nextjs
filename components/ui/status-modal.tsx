"use client";

import React, { useState, useEffect } from "react";
import { Modal, Button, RadioGroup, FormControlLabel, Radio, TextField } from "@mui/material";
import { useTaskContext } from "@/context/task/task-context";

interface StatusModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
    currentStatus: string;
    logId: string;
    projectId: string;
    taskId: string;
    id: string;
}

const StatusModal: React.FC<StatusModalProps> = ({
    open,
    onClose,
    onSubmit,
    currentStatus,
    logId,
    projectId,
    taskId,
    id
}) => {
    const [status, setStatus] = useState<string>(currentStatus);
    const [reason, setReason] = useState<string>("");
    const { changeLogStatus } = useTaskContext();
    const secondaryColor = "#4CAD6D"; // Example secondary color. Replace with your actual secondary color.

    useEffect(() => {
        setStatus(currentStatus);
        setReason(""); // Reset reason when modal opens
    }, [currentStatus, open]);

    const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStatus(event.target.value);
        if (event.target.value !== "REJECT") {
            setReason("");
        }
    };

    const handleSubmit = async () => {
        try {

            await changeLogStatus({
                projectId,
                taskId,
                logId,
                updatedData: { status, reason }
            });
                        onSubmit();
            onClose();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <Modal open={open} onClose={onClose} className="flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Update Status</h2>

                {/* Radio buttons */}
                <RadioGroup
                    value={status}
                    onChange={handleStatusChange}
                    className="mb-4"
                    sx={{
                        '& .MuiRadio-root': {
                            color: secondaryColor, // Apply secondary color to the radio button
                        },
                    }}
                >
                    <FormControlLabel value="APPROVED" control={<Radio />} label="APPROVED" />
                    <FormControlLabel value="REJECTED" control={<Radio />} label="REJECTED" />
                </RadioGroup>

                {/* Reason input field */}
                {status === "REJECTED" && (
                    <TextField
                        label="Reason"
                        multiline
                        rows={3}
                        fullWidth
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter your reason..."
                        className="mb-4"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: secondaryColor, // Apply secondary color to the border
                                },
                                '&:hover fieldset': {
                                    borderColor: secondaryColor, // Hover effect with secondary color
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: secondaryColor, // Focus effect with secondary color
                                },
                            },

                        }}
                    />
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-2 mt-5">
                    <button onClick={onClose} className="btn btn-primary rounded-full btn-sm">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="btn btn-secondary rounded-full btn-sm" style={{ backgroundColor: secondaryColor }}>
                        Submit
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default StatusModal;
