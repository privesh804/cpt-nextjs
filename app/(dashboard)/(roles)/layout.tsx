"use client";

import Navbar from "@/components/common/navbar";
import CustomSidebar from "@/components/common/sidebar";
import LoadingProvider from "@/context/loading/loading-provider";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PuffLoader } from "react-spinners";

const SkeletonLoader = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-secondary/80 z-50 rounded-3xl">
      <PuffLoader color="#4CAD6D" size={60} />
    </div>
  );
};

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);

    () => setMounted(false);
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const startLoading = () => {
      setIsLoading(true);
      timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };
    const stopLoading = () => {
      setIsLoading(false);
      timeoutId && clearTimeout(timeoutId);
    };
    startLoading();
    return () => {
      timeoutId && clearTimeout(timeoutId);
      stopLoading();
    };
  }, [pathname]);

  return (
    <>
      <div className="fixed w-full h-full inset-0 flex bg-primary gap-5">
        <div className="h-full">
          <CustomSidebar />
        </div>

        <div className="wrapper grow h-screen overflow-auto scrollbar-hide p-8 relative">
          <div className="border overflow-auto bg-tertiary-100 border-tertiary p-10 rounded-3xl w-full h-full min-h-[calc(100svh-4rem)]">
            <Navbar pageTitle="" />

            {isLoading && mounted ? (
              <SkeletonLoader />
            ) : mounted ? (
              <LoadingProvider>{children}</LoadingProvider>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardLayout;
