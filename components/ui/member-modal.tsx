"use client";

import { Modal, ModalBody, ModalHeader, ModalTitle } from "@/components/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useContext, SetStateAction, Dispatch } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { FaPlus } from "react-icons/fa";
import { AuthContext } from "@/context/auth/auth-provider";
import { UserContext } from "@/context/user/user-provider";

const schema = z.object({
  name: z.string().nonempty({ message: "This field is required" }),
  email: z
    .string()
    .email({ message: "Enter a valid email" })
    .nonempty({ message: "This field is required" }),
  role: z.string().nonempty({ message: "This field is required" }),
  contact: z
    .string()
    .nullable()
    .transform((val) => val ?? "") // Then transform null to empty string
    .refine((val) => /^\d{10}$/.test(val), {
      message: "Enter a valid 10-digit phone number",
    }),

  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  password: z.string().optional(),
});

type AddMemberData = z.infer<typeof schema>;

interface MemberModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  editMember: boolean;
  selectedUser: User | null;
  roles?: Role;
  status?: string;
  setRefreshKey: Dispatch<SetStateAction<number>>;
}

const MemberModal = ({
  open,
  setOpen,
  editMember,
  selectedUser,
  roles,
  setRefreshKey,
}: MemberModalProps) => {
  const ref = useOutsideClick(() => {
    setOpen(false);
  });

  return (
    <Modal open={open} key={selectedUser?.user.id ?? "new"} ref={ref}>
      <ModalHeader>
        <ModalTitle>{editMember ? "Edit" : "Add"} Member</ModalTitle>
        <div
          className="cursor-pointer glyph fs1"
          onClick={() => setOpen(false)}
        >
          <FaPlus className="rotate-45" />
        </div>
      </ModalHeader>
      <ModalBody>
        <MemberForm
          setOpen={setOpen}
          editMember={editMember}
          roles={roles}
          setRefreshKey={setRefreshKey}
          selectedUser={selectedUser}
        />
      </ModalBody>
    </Modal>
  );
};

const MemberForm = ({
  setOpen,
  editMember,
  roles,
  selectedUser,
  setRefreshKey,
}: Omit<MemberModalProps, "open">) => {
  const authContext = useContext(AuthContext);
  if (!authContext)
    throw new Error("AuthContext must be used within AuthProvider");

  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext must be used within UserProvider");
  }
  const { createUser, updateUser, getUsers } = userContext;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    clearErrors,
    watch,
  } = useForm<AddMemberData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!open) {
      reset({
        name: "",
        email: "",
        role: "",
        contact: "",
        status: "ACTIVE",
        password: "",
      });
      clearErrors();
    }
  }, [open, reset, clearErrors]);

  const handleAddMember = async (memberData: AddMemberData) => {
    try {
      if (editMember && selectedUser) {
        // If editing an existing user, update user
        await updateUser({
          id: selectedUser.user.id,
          userData: {
            name: memberData.name,
            email: memberData.email,
            contact: memberData.contact,
            role: memberData.role,
            status: memberData.status,
          },
        });
      } else {
        // If adding a new member, create a new user
        await createUser({
          name: memberData.name,
          email: memberData.email,
          contact: memberData.contact,
          role: memberData.role, // Default to "user" role unless modified
          status: "ACTIVE", // Default status
          password: memberData.password,
        });
      }
      await getUsers(0, 10); // Fetch the latest user data
      setOpen(false); // Close the modal after the operation
      reset(); // Reset form after submission
      setRefreshKey((prev) => prev + 1);
    } catch (error: any) {
      console.error("Failed to add or update member");
    }
  };
  const onSubmitForm = async (data: AddMemberData, e: any) => {
    e.preventDefault();
    try {
      const userData = {
        name: data.name,
        email: data.email,
        contact: data.contact,
        role: data.role, // Here data.role should be a string
        status: data.status,
        password: data.password,
        selectedUser,
        roles,
      };

      // Call the handleAddMember function with the userData
      await handleAddMember(userData);
    } catch (error: any) {
      console.error("Failed to add or update member.");
    }
  };

  // Set form values when editing
  useEffect(() => {
    if (editMember && selectedUser) {
      setValue("name", selectedUser.user.name);
      setValue("email", selectedUser.user.email);
      if (selectedUser.user.role && selectedUser.user.role.length > 0) {
        setValue("role", selectedUser.user.role[0] || ""); // Assuming role is an array of objects with a `name` field
      }
      setValue("contact", selectedUser.user.contact);
      setValue("status", selectedUser.user.status);
      setValue("password", ""); // Reset password field for security
    }
  }, [editMember, selectedUser, setValue]);

  return (
    <form className="space-y-2" onSubmit={handleSubmit(onSubmitForm)}>
      <div className="flex flex-col gap-1">
        <label className="form-label text-gray-900 text-xs">Name</label>
        <input
          className="input input-sm"
          placeholder="John Doe"
          autoComplete="off"
          {...register("name")}
        />
        {errors.name && (
          <span role="alert" className="text-danger text-xs">
            {errors.name.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="form-label text-gray-900 text-xs">Email</label>
        <input
          className="input input-sm"
          placeholder="abc@xyz.com"
          autoComplete="off"
          {...register("email")}
        />
        {errors.email && (
          <span role="alert" className="text-danger text-xs">
            {errors.email.message}
          </span>
        )}
      </div>

      {!editMember && (
        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900 text-xs">Password</label>
          <input
            type="password"
            className="input input-sm"
            placeholder="Enter password"
            autoComplete="off"
            {...register("password")}
          />
          {errors.password && (
            <span role="alert" className="text-danger text-xs">
              {errors.password.message}
            </span>
          )}
        </div>
      )}

      {editMember && (
        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900 text-xs">Status</label>
          <select
            className="input input-sm"
            value={watch("status")}
            {...register("status")}
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          {errors.status && (
            <span role="alert" className="text-danger text-xs">
              {errors.status.message}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label className="form-label text-gray-900 text-xs">Role</label>
        <select
          className="input input-sm"
          value={watch("role")}
          {...register("role")}
        >
          <option value="">Select Role</option>
          {roles &&
            roles.roles.map((role, index) => (
              <option key={index} value={role}>
                {role}
              </option>
            ))}
        </select>
        {errors.role && (
          <span role="alert" className="text-danger text-xs">
            {errors.role.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="form-label text-gray-900 text-xs">Contact</label>
        <input
          type="text"
          onKeyDown={(event) => {
            if (!/^\d$/.test(event.key) && event.key !== "Backspace") {
              event.preventDefault();
            }
          }}
          className="input input-sm"
          placeholder="+1234567890"
          autoComplete="off"
          {...register("contact")}
        />
        {errors.contact && (
          <span role="alert" className="text-danger text-xs">
            {errors.contact.message}
          </span>
        )}
      </div>

      <div className="pt-2">
        <button type="submit" className="btn btn-secondary rounded-full">
          Submit
        </button>
      </div>
    </form>
  );
};

export default MemberModal;
