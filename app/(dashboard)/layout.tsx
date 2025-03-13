"use client";

import { AuthProvider } from "@/context/auth/auth-provider";
import { TaskProvider } from "@/context/task/task-provider";
import { UserProvider } from "@/context/user/user-provider";
import FcmTokenComp from "@/hooks/firebaseForeground";
import ReduxProvider from "@/redux/providers";
import { getAuth } from "@/utils/auth-helper";
import { storeRole } from "@/utils/crypto";
import { usePathname, useRouter } from "next/navigation";
import { SnackbarProvider } from "notistack";
import { useEffect, useMemo } from "react";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const restrictedRoutes = useMemo(
    () => ["/login", "/forgot-password", "/reset-password"],
    []
  );
  const protectedRoutes = useMemo(() => ["/create-tenant"], []);

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const isLocal = window.location.hostname.includes("localhost");
        await storeRole(
          window.location.hostname.split(".").length < (isLocal ? 2 : 3)
            ? "admin"
            : "tenant"
        );

        const token = await getAuth();
        if (protectedRoutes.includes(pathname)) {
          return;
        }
        if (token) {
          if (restrictedRoutes.includes(pathname)) {
            router.push("/dashboard");
            return;
          }
        } else {
          if (!restrictedRoutes.includes(pathname)) {
            router.push("/login");
            return;
          }
        }
      } catch (error) {
        console.error("error", error);
      }
    };

    fetchAuth();
  }, [pathname, router]);

  return (
    <SnackbarProvider
      maxSnack={2}
      preventDuplicate
      autoHideDuration={3000}
      anchorOrigin={{
        horizontal: "right",
        vertical: "top",
      }}
    >
      <AuthProvider>
        <ReduxProvider>
          <UserProvider>
            <TaskProvider>{children}</TaskProvider>
            <FcmTokenComp />
          </UserProvider>
        </ReduxProvider>
      </AuthProvider>
    </SnackbarProvider>
  );
}

export default DashboardLayout;
