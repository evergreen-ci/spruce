import React from "react";
import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
import { ToastProvider } from "context/toast";
import { AuthProvider } from "context/auth";

export const ContextProviders: React.FC = ({ children }) => (
  <AuthProvider>
    <LeafyGreenProvider baseFontSize={16}>
      <ToastProvider>{children}</ToastProvider>
    </LeafyGreenProvider>
  </AuthProvider>
);
