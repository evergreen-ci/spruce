import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
import { AuthProvider } from "context/Auth";
import { ToastProvider } from "context/toast";

export const ContextProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <AuthProvider>
    <LeafyGreenProvider baseFontSize={14}>
      <ToastProvider>{children}</ToastProvider>
    </LeafyGreenProvider>
  </AuthProvider>
);
