"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import clsx from "clsx";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useAuthContext } from "@/context/auth/auth-context";
import { ScreenLoader } from "@/components/common/screen-loader";
import { useSearchParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";

const classicSchema = z.object({
  email: z
    .string({ message: "This field is required" })
    .email({ message: "Please enter a valid email" }),
  password: z
    .string({ message: "This field is required" })
    .min(1, "This field is required"),
});

const emailSchema = z.object({
  email: z
    .string({ message: "This field is required" })
    .email({ message: "Please enter a valid email" }),
});

const passwordSchema = z.object({
  password: z
    .string({ message: "This field is required" })
    .min(1, "This field is required"),
});

type ClassicFormData = z.infer<typeof classicSchema>;

type EmailFormData = z.infer<typeof emailSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const LoginForm = () => {
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showClassic, setShowClassic] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { login, verifyEmail } = useAuthContext();
  const emailFromQuery = searchParams.get("email") || "";
  const [storedEmail, setStoredEmail] = useState("");
  const { hostname } = window.location;
  const isLocal = hostname.includes("localhost");
  const isSubdomain = hostname.split(".").length > (isLocal ? 1 : 2);
  useEffect(() => {
    const storedError = localStorage.getItem("errorMessage");

    if (storedError) {
      enqueueSnackbar(storedError, { variant: "error" });
      localStorage.removeItem("errorMessage"); // Clear error after displaying
    }
  }, []);

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: searchParams.get("email") || "",
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  const classicForm = useForm<ClassicFormData>({
    resolver: zodResolver(classicSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleEmailSubmit = async (data: EmailFormData) => {
    try {
      setIsVerifying(true);

      // Verifying the email
      const { subdomain, originalUrl } = await verifyEmail(data.email);

      // If there is an original URL, just return (no need to show password field)
      if (originalUrl) {
        return;
      }

      // Check if the email verification was successful and show the password field
      if (subdomain) {
        setEmailValue(data.email);
        setShowPasswordField(true);
      } else {
        // If verification fails, don't show the password field
        setShowPasswordField(false);
      }
    } catch (error) {
      console.error(error);
      setShowPasswordField(false); // Ensure password field is not shown on error
    } finally {
      // Only clear verifying state if we're not redirecting
      if (!isRedirecting) {
        setIsVerifying(false);
      }
    }
  };

  const handlePasswordSubmit = async (data: PasswordFormData) => {
    try {
      setIsRedirecting(true);
      await login({ email: emailValue, password: data.password });
    } catch (error) {
      console.error(error);
      setIsRedirecting(false);
    }
  };

  const handleClassicSubmit = async (data: ClassicFormData) => {
    try {
      // setIsRedirecting(true);
      await login({ email: data.email, password: data.password });
    } catch (error) {
      console.error(error);
      // setIsRedirecting(false);
    }
    // finally{
    // setIsRedirecting(false);

    // }
  };
  useEffect(() => {
    if (isSubdomain && !emailFromQuery) {
      setShowPassword(true);
      setShowClassic(true);
    }
  }, [isSubdomain, emailFromQuery]);

  useEffect(() => {
    if (emailFromQuery) {
      setStoredEmail(emailFromQuery);
      setEmailValue(emailFromQuery);
    }
  }, [emailFromQuery]);

  useEffect(() => {
    if (storedEmail) {
      setShowPasswordField(true);
    }
  }, [storedEmail]);

  if (isRedirecting || isVerifying) {
    return <ScreenLoader />;
  }

  return (
    <div className="card md:w-[420px] w-full">
      {showClassic ? (
        // Classic form rendering
        <form
          className="card-body flex flex-col gap-5 p-10"
          onSubmit={classicForm.handleSubmit(handleClassicSubmit)}
          noValidate
        >
          <div className="text-center mb-2.5">
            <h3 className="text-lg font-semibold text-gray-900 leading-none mb-2.5">
              Sign in
            </h3>
          </div>
          <div className="flex flex-col gap-1 relative">
            <label className="form-label text-gray-900">Email</label>
            <label className="input">
              <input
                placeholder="Enter email"
                autoComplete="off"
                {...classicForm.register("email")}
              />
            </label>
            {classicForm.formState.errors &&
              classicForm.formState.errors.email && (
                <span role="alert" className="text-danger text-xs">
                  {classicForm.formState.errors.email.message}
                </span>
              )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex flex-row">
              <label className="form-label text-gray-900 w-auto">
                Password
              </label>
              <Link href="/forgot-password" className="flex-grow-1 w-full">
                <p className="text-primary text-xs text-right">
                  Forgot password?
                </p>
              </Link>
            </div>
            <label className="input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                autoComplete="off"
                {...classicForm.register("password")}
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
            {classicForm.formState.errors &&
              classicForm.formState.errors.password && (
                <span role="alert" className="text-danger text-xs">
                  {classicForm.formState.errors.password.message}
                </span>
              )}
          </div>
          <div className="flex gap-3">
            {/* <button
              type="button"
              className="btn bg-transparent text-secondary rounded-full border border-secondary flex justify-center w-full "
              onClick={() => setShowPasswordField(false)}
            >
              Back
            </button> */}
            <button
              type="submit"
              className="w-full justify-center btn btn-secondary rounded-full"
            >
              Sign In
            </button>
          </div>
        </form>
      ) : !showPasswordField ? (
        // Email form rendering
        <form
          className="card-body flex flex-col gap-5 p-10"
          onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
          noValidate
        >
          <div className="text-center mb-2.5">
            <h3 className="text-lg font-semibold text-gray-900 leading-none mb-2.5">
              Sign in
            </h3>
          </div>

          <div className="flex flex-col gap-1 relative">
            <label className="form-label text-gray-900">Email</label>
            <label className="input">
              <input
                placeholder="Enter email"
                autoComplete="off"
                {...emailForm.register("email")}
              />
            </label>
            {emailForm.formState.errors && emailForm.formState.errors.email && (
              <span role="alert" className="text-danger text-xs">
                {emailForm.formState.errors.email.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-secondary justify-center rounded-full"
            disabled={isVerifying}
          >
            {isVerifying ? "Please wait..." : "Continue"}
          </button>
        </form>
      ) : (
        // Password form rendering
        <form
          className="card-body flex flex-col gap-5 p-10"
          onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
          noValidate
        >
          <div className="text-center mb-2.5">
            <h3 className="text-lg font-semibold text-gray-900 leading-none mb-2.5">
              Enter Password
            </h3>
          </div>

          {storedEmail ? (
            <div className="flex flex-col gap-1 relative">
              <label className="form-label text-gray-900">Email</label>
              <label className="input">
                <input
                  placeholder="Enter email"
                  autoComplete="off"
                  {...emailForm.register("email")}
                />
              </label>
              {emailForm.formState.errors &&
                emailForm.formState.errors.email && (
                  <span role="alert" className="text-danger text-xs">
                    {emailForm.formState.errors.email.message}
                  </span>
                )}
            </div>
          ) : null}

          <div className="flex flex-col gap-1">
            <div className="flex flex-row">
              <label className="form-label text-gray-900 w-auto">
                Password
              </label>
              <Link href="/forgot-password" className="flex-grow-1 w-full">
                <p className="text-primary text-xs text-right">
                  Forgot password?
                </p>
              </Link>
            </div>
            <label className="input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                autoComplete="off"
                {...passwordForm.register("password")}
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
            {passwordForm.formState.errors &&
              passwordForm.formState.errors.password && (
                <span role="alert" className="text-danger text-xs">
                  {passwordForm.formState.errors.password.message}
                </span>
              )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              className="btn bg-transparent text-secondary rounded-full border border-secondary flex justify-center grow"
              onClick={() => setShowPasswordField(false)}
            >
              Back
            </button>
            <button
              type="submit"
              className="btn btn-secondary rounded-full flex justify-center grow"
            >
              Sign In
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default LoginForm;
