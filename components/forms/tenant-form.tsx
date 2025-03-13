"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import { ScreenLoader } from "@/components/common/screen-loader";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/auth/auth-context"; // Import useAuthContext
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import clsx from "clsx";

// Define the schema for validation, including only name and domain
const tenantSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  name: z.string().min(1, { message: "Name is required" }),
  domain: z.string().min(1, { message: "Domain is required" }),
  password: z
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
      message:
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number",
    })
    .min(8, { message: "Password must be at least 8 characters" }),
});

type TenantFormData = z.infer<typeof tenantSchema>;

const TenantForm = () => {
  const [email, setEmail] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [code, setCode] = useState<string | null>(null);
  const router = useRouter();
  const { createTenant } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      email: "",
      name: "",
      domain: "",
      password: "",
    },
  });

  // Extract code from the URL when the component mounts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const extractedCode = urlParams.get("verify");
    const extractedEmail = urlParams.get("email");

    if (extractedEmail) setEmail(extractedEmail);
    if (extractedCode) {
      if (extractedCode === "invalid") {
        enqueueSnackbar("Invalid verification code", { variant: "error" });
        router.push("/login");
      } else {
        setCode(extractedCode);
      }
    } else {
      enqueueSnackbar("Missing verification code", { variant: "error" });
      router.push("/login"); // Redirect if code is missing
    }
  }, [router]);

  useEffect(() => {
    if (email) {
      setValue("email", email);
    }
  }, [email]);

  // Function to handle form submission
  const handleFormSubmit = async (data: TenantFormData) => {
    if (!code) {
      enqueueSnackbar("No verification code found", { variant: "error" });
      return;
    }

    try {
      setIsVerifying(true);
      const success = await createTenant({ ...data, code });

      if (success) {
        // Redirect after successful tenant creation
        const tenantDomain = data.domain.startsWith("https")
          ? data.domain
          : `https://${data.domain}`;

        window.location.href = `${tenantDomain}.${window.location.hostname}/login?email=${data.email}`;
      } else {
        enqueueSnackbar("Failed to create tenant", { variant: "error" });
      }
    } finally {
      setIsVerifying(false);
    }
  };

  if (isVerifying) {
    return <ScreenLoader />;
  }

  return (
    <div className="card md:w-[420px] w-full">
      {/* Tenant Form */}
      <form
        className="card-body flex flex-col gap-5 p-10"
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
      >
        <div className="text-center mb-2.5">
          <h3 className="text-lg font-semibold text-gray-900 leading-none mb-2.5">
            Create Tenant
          </h3>
        </div>

        {/* Email Input */}
        <div className="flex flex-col gap-1 relative">
          <label className="form-label text-gray-900">Email</label>
          <label className="input">
            <input
              type="email"
              placeholder="Enter tenant's email"
              autoComplete="off"
              readOnly={true}
              {...register("email")}
            />
          </label>
          {errors && errors.name && (
            <span role="alert" className="text-danger text-xs">
              {errors.email && errors.email.message}
            </span>
          )}
        </div>

        {/* Name Input */}
        <div className="flex flex-col gap-1 relative">
          <label className="form-label text-gray-900">Name</label>
          <label className="input">
            <input
              placeholder="Enter tenant's name"
              autoComplete="off"
              {...register("name")}
            />
          </label>
          {errors && errors.name && (
            <span role="alert" className="text-danger text-xs">
              {errors.name.message}
            </span>
          )}
        </div>

        {/* Domain Input */}
        <div className="flex flex-col gap-1 relative">
          <label className="form-label text-gray-900">Subdomain</label>
          <label className="input">
            <input
              placeholder="Enter tenant's subdomain"
              autoComplete="off"
              {...register("domain")}
            />
          </label>
          {errors && errors.domain && (
            <span role="alert" className="text-danger text-xs">
              {errors.domain.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex flex-row">
            <label className="form-label text-gray-900 w-auto">Password</label>
          </div>
          <label className="input">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              autoComplete="off"
              {...register("password")}
            />
            <button
              type="button"
              className="btn btn-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              <VscEye
                size={16}
                className={clsx("text-gray-500", { hidden: showPassword })}
              />
              <VscEyeClosed
                size={16}
                className={clsx("text-primary", { hidden: !showPassword })}
              />
            </button>
          </label>
          {errors && errors.password && (
            <span role="alert" className="text-danger text-xs">
              {errors.password.message}
            </span>
          )}
        </div>
        <div>
          <span>
            <p className="text-black text-[12px]">
              <b>Note:</b> Choose a subdomain representing your organization
              (e.g., your-subdomain.example.com) for direct workspace access and
              future logins without using the main site.
            </p>
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-secondary rounded-full flex justify-center grow"
          disabled={isVerifying}
        >
          {isVerifying ? "Please wait..." : "Create Tenant"}
        </button>
      </form>
    </div>
  );
};

export default TenantForm;
