import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
import { AuthProvider } from "context/auth";
import { ToastProvider } from "context/toast";
import { ToastProvider as LGToastProvider } from "@leafygreen-ui/toast";
export const ContextProviders: React.VFC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <AuthProvider>
    <LeafyGreenProvider baseFontSize={14}>
      <LGToastProvider>
        <ToastProvider>{children}</ToastProvider>
      </LGToastProvider>
    </LeafyGreenProvider>
  </AuthProvider>
);
