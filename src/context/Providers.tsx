import React from "react";
import { AuthProvider } from "./auth";
import { ToastProvider } from "./toast";
import { BannerContextProvider } from "./banners";

export const ContextProviders: React.FC = ({ children }) => {
  return (
    <BannerContextProvider>
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    </BannerContextProvider>
  );
};
