"use client";

import { Modal, ModalBody, ModalHeader, ModalTitle } from "@/components/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { FaPlus } from "react-icons/fa";
import { useAuthContext } from "@/context/auth/auth-context";

const schema = z.object({
  email: z
    .string()
    .email({ message: "Enter a valid email" })
    .nonempty({ message: "This field is required" }),
});

type AddTenantData = z.infer<typeof schema>;

const TenantModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const ref = useOutsideClick(() => {
    setOpen(false);
  });
  return (
    <Modal open={open} className="p-3" ref={ref}>
      <ModalHeader>
        <ModalTitle>Add Tenant</ModalTitle>
        <div
          className="cursor-pointer glyph fs1"
          onClick={() => setOpen(false)}
        >
          <FaPlus className="rotate-45" />
        </div>
      </ModalHeader>
      <ModalBody>
        <TenantForm setOpen={setOpen} />
      </ModalBody>
    </Modal>
  );
};

const TenantForm = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { inviteTenant } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddTenantData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: AddTenantData) => {
    try {
      await inviteTenant({ email: data.email });
      setOpen(false);
      reset();
    } catch (error) {
      console.error("Failed to invite tenant:", error);
    }
  };

  useEffect(() => {
    if (!open) {
      reset({
        email: "",
      });
    }
  }, [open, reset]);

  return (
    <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-1">
        <label className="form-label text-gray-900 text-xs">Email</label>
        <input
          className="input input-sm"
          placeholder="tenant@xyz.com"
          autoComplete="off"
          {...register("email")}
        />
        {errors && errors.email && (
          <span role="alert" className="text-danger text-xs">
            {errors.email.message}
          </span>
        )}
      </div>
      <div className="pt-2">
        <button
          type="submit"
          className="btn btn-secondary rounded-full"
          disabled={isSubmitting}
        >
          Invite Tenant
        </button>
      </div>
    </form>
  );
};

export default TenantModal;
