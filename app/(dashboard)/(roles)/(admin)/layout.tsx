"use client";

import React from "react";
import withRole from "@/components/common/with-role";

const AdminDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default withRole(AdminDashboardLayout, "admin");
