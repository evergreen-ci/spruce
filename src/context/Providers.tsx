import React from "react";
import { AuthProvider } from "./auth";
import { MessagesProvider } from "./toast";

export const ContextProviders: React.FC = ({ children }) => {
  return (
    <AuthProvider>
      <MessagesProvider>{children}</MessagesProvider>
    </AuthProvider>
  );
};
