import React from "react";
import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
import { ToastProvider } from "./toast";
import { AnalyticsProvider } from "./analytics";

export const ContextProviders: React.FC = ({ children }) => (
  <AnalyticsProvider>
    <LeafyGreenProvider baseFontSize={16}>
      <ToastProvider>{children}</ToastProvider>
    </LeafyGreenProvider>
  </AnalyticsProvider>
);
