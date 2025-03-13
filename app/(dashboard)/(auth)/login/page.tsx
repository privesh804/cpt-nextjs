import { ScreenLoader } from "@/components/common/screen-loader";
import LoginForm from "@/components/forms/login-form";
import React, { Suspense } from "react";

const LoginPage = () => {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <LoginForm />
    </Suspense>
  );
};

export default LoginPage;
