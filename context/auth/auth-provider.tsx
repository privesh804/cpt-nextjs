"use client";
import tenant from "@/services/tenant";

import * as authHelper from "@/utils/auth-helper";
import { secureStorage, storeRole } from "@/utils/crypto";
import { clearData } from "@/utils/localstorage";
import axios from "axios";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useState,
} from "react";
import authService from "@/services/auth";
import useFcmToken from "@/hooks/useFCMToken";

interface AuthContextProps {
  saveAuth: (auth: AuthModel | undefined) => void;
  currentUser: User | undefined;
  setCurrentUser: Dispatch<SetStateAction<User | undefined>>;
  login: (data: {
    email: string;
    password: string;
    verificationResult?: { subdomain: string; originalUrl: string };
  }) => Promise<void>;

  register: (
    email: string,
    password: string,
    firstname?: string,
    lastname?: string,
    password_confirmation?: string
  ) => Promise<void>;
  requestPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (
    email: string
  ) => Promise<{ subdomain: string; originalUrl: string }>;
  inviteTenant: (data: { email: string }) => Promise<void>;
  createTenant: (data: {
    code: string;
    name: string;
    domain: string;
    password: string;
  }) => Promise<boolean>;
}
const AuthContext = createContext<AuthContextProps | null>(null);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState(false);
  const { token } = useFcmToken();
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const router = useRouter();

  // Set auth object and save it to local storage
  const saveAuth = (auth: AuthModel | undefined) => {
    if (auth) {
      authHelper.setAuth(auth);
    } else {
      authHelper.removeAuth();
    }
  };

  const verifyEmail = async (
    email: string
  ): Promise<{ subdomain: string; originalUrl: string }> => {
    try {
      const response = await authService.verifyEmail(email);

      // If we get a URL in the response, handle redirect here
      if (response?.data.url) {
        const fullUrl = `https://${response.data.url}`;
        window.location.href = fullUrl;
        return { subdomain: "", originalUrl: fullUrl };
      }

      // If we get status:true, continue with existing subdomain logic
      if (response?.data.status) {
        let subdomain = "";
        try {
          const hostnameParts = email.split("@")[1].split(".");
          subdomain = hostnameParts[0];
        } catch (urlError) {
          console.error("Error parsing email:", urlError);
        }
        return { subdomain, originalUrl: "" };
      }

      // Default case (if no URL or status found)
      return { subdomain: "", originalUrl: "" };
    } catch (error: any) {
      // Handle error without redirecting
      if (axios.isAxiosError(error)) {
        if (
          error.response?.status === 404 ||
          error.response?.data?.error?.includes("No query results") ||
          error.response?.data?.error?.includes("SuperAdmin")
        ) {
          console.error("Verification failed, no redirect will occur.");
        } else {
          // Show error message if the issue is not related to the URL
          enqueueSnackbar(
            error.response?.data?.error || "An unexpected error occurred",
            { variant: "error" }
          );
        }
      } else {
        // Handle any other types of errors (e.g., network issues)
        enqueueSnackbar("An error occurred while verifying the email", {
          variant: "error",
        });
      }

      // Don't redirect in case of an error
      return { subdomain: "", originalUrl: "" };
    }
  };

  const inviteTenant = async (data: { email: string }) => {
    try {
      const response = await tenant.inviteTenant(data);
      if (response?.status === 201) {
        enqueueSnackbar("Invitation sent successfully", { variant: "success" });
      }
    } catch (error: any) {
      console.error("Invite error:", error);
    }
  };

  const createTenant = async (data: {
    code: string;
    name: string;
    domain: string;
    password: string;
  }) => {
    try {
      const response = await tenant.createTenant(data);
      if (response && response.status === 201) {
        enqueueSnackbar("Tenant created successfully", { variant: "success" });
        return true; // Indicate success
      } else {
        enqueueSnackbar("Failed to create tenant", { variant: "error" });
        return false; // Indicate failure
      }
    } catch (error: any) {
      return false; // Indicate failure
    }
  };

  // Login user with email and password
  const login = async (data: { email: string; password: string }) => {
    try {
      const isLocal = window.location.hostname.includes("localhost");
      await storeRole(
        window.location.hostname.split(".").length < (isLocal ? 2 : 3)
          ? "admin"
          : "tenant"
      );
      // const fcmToken = await getToken(messaging);

      console.log(token);

      const { data: auth }: any = await authService.login({ ...data, token });

      if (auth) {
        saveAuth(auth);
        setCurrentUser(auth.user);
        if (auth.projects) {
          secureStorage.setItem(
            "projectId",
            auth.projects.default ? auth.projects.default : ""
          );
        }
        router.push("/dashboard");
      }
    } catch (error: any) {
      setLoading(false); // Ensure loader stops
      saveAuth(undefined);
    } finally {
      setLoading(false); // Ensure loader stops even if there's an error
    }
  };

  // Register user using default registration information
  const register = async (
    email: string,
    password: string,
    password_confirmation?: string
  ) => {
    try {
      await authService.register(email, password, password_confirmation);
    } catch (error: any) {
      console.error("Something went wrong");
    }
  };

  // Server should return object => { result: boolean } (Is Email in DB)
  const requestPassword = async (email: string) => {
    try {
      let result = await authService.requestPassword(email);
      if (result?.status == 200) {
        router.push("/login");
      }
    } catch (error: any) {
      console.error("Something went wrong");
    }
  };

  // Delete auth local storage and resets current user state
  const logout = async () => {
    try {
      setLoading(true);
      const response = await authService.logout();
      if (response && response.status === 204) {
        saveAuth(undefined);
        setCurrentUser(undefined);
        clearData();
        router.replace("/login");
        setLoading(false);
      }
    } catch (error: any) {
      console.error(error.response.data.message, "Something went wrong");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        saveAuth,
        currentUser,
        setCurrentUser,
        login,
        register,
        requestPassword,
        logout,
        verifyEmail,
        inviteTenant,
        createTenant,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export { AuthContext, AuthProvider };
