"use client";
import React, { ReactNode } from "react";

interface LoadingProviderProps {
  children: ReactNode;
}

const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  return <div className="relative h-auto min-h-20 w-full">{children}</div>;
};

export default LoadingProvider;
