"use client";

import { getRole } from "@/utils/crypto";
import { useRouter } from "next/navigation";
import React, { ComponentType, useEffect } from "react";

export default function withRole<P extends Record<string, unknown>>(
  WrappedComponent: ComponentType<P>,
  requiredRole: string
): ComponentType<P> {
  return (props: P) => {
    const router = useRouter();

    const fetchRole = async () => {
      await getRole().then((role) => {
        if (role && role !== requiredRole) {
          router.push("/unauthorized"); // Redirect to unauthorized page if role doesn't match
        }
      });
    };

    useEffect(() => {
      fetchRole();
    }, []);

    return <WrappedComponent {...props} />;
  };
}
