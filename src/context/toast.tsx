import React from "react";
import { message } from "antd";
import { MessageType } from "antd/es/message";

type Message = (toastMessage: string) => MessageType;

interface ToastDispatchValue {
  success: Message;
  warning: Message;
  error: Message;
  info: Message;
}

const MessagesDispatchContext = React.createContext<ToastDispatchValue | null>(
  null
);

enum Toast {
  success = "success",
  warning = "warning",
  error = "error",
  info = "info"
}

const showToastMessage = (t: Toast) => (toastMessage: string) =>
  message[t](toastMessage);

const toast: ToastDispatchValue = {
  success: showToastMessage(Toast.success),
  warning: showToastMessage(Toast.warning),
  error: showToastMessage(Toast.error),
  info: showToastMessage(Toast.info)
};

const ToastProvider: React.FC = ({ children }) => {
  return (
    <MessagesDispatchContext.Provider value={toast}>
      {children}
    </MessagesDispatchContext.Provider>
  );
};

const useToastContext = () => {
  const context = React.useContext(MessagesDispatchContext);
  if (context === undefined) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
};

export { ToastProvider, useToastContext };
