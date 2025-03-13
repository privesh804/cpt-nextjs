"use client";
import withRole from "@/components/common/with-role";

const TenantLayout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default withRole(TenantLayout, "tenant");
