import * as React from "react";
import { ApiClientProvider } from "./apiClient";
import { UserContextProvider } from "./user";

export const ContextProvider: React.FC = ({ children }) => {
  return (
    <ApiClientProvider>
      <UserContextProvider>{children}</UserContextProvider>
    </ApiClientProvider>
  );
};
