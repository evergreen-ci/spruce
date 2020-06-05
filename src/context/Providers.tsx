import React from "react";
import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
import { AuthProvider } from "./auth";
import { ToastProvider } from "./toast";
import { AnalyticsProvider } from "./analytics";

export const ContextProviders: React.FC = ({ children }) => (
  <AnalyticsProvider>
    <AuthProvider>
      <LeafyGreenProvider baseFontSize={16}>
        <ToastProvider>{children}</ToastProvider>
      </LeafyGreenProvider>
    </AuthProvider>
  </AnalyticsProvider>
);
