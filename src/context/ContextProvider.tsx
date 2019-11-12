import * as React from "react";
import { ApiClientProvider } from "./apiClient";

export const ContextProvider: React.FC = ({ children }) => {
  return <ApiClientProvider>{children}</ApiClientProvider>;
};
