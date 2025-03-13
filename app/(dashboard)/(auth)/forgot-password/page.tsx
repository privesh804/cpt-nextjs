"use client";

import { useAuthContext } from "@/context/auth/auth-context";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z
    .string({ message: "This field is required" })
    .email({ message: "Please enter a valid email" }),
});

type FormData = z.infer<typeof schema>;

const ForgotPassword = () => {
  const { requestPassword } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "demo@keenthemes.com",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await requestPassword(data.email);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="card md:w-[420px] w-full">
      <form
        className="card-body flex flex-col gap-5 p-10"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="text-center mb-2.5">
          <h3 className="text-lg font-semibold text-gray-900 leading-none mb-2.5">
            Forgot Password
          </h3>
        </div>

        <div className="flex flex-col gap-1 relative">
          <label className="form-label text-gray-900">Email</label>
          <label className="input">
            <input
              placeholder="Enter email"
              autoComplete="off"
              {...register("email")}
            />
          </label>
          {errors && errors.email && (
            <span role="alert" className="text-danger text-xs">
              {errors.email.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary flex justify-center grow"
        >
          Request Password
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
