import React from "react";
import { AuthProvider } from "./auth";
import { ToastProvider } from "./toast";

export const ContextProviders: React.FC = ({ children }) => (
  <AuthProvider>
    <ToastProvider>{children}</ToastProvider>
  </AuthProvider>
);
