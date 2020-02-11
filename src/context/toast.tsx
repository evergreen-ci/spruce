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

const showToastMessage = (t: keyof typeof Toast) => (toastMessage: string) =>
  message[t](toastMessage);

const toast: ToastDispatchValue = {
  success: showToastMessage(Toast.success),
  warning: showToastMessage(Toast.warning),
  error: showToastMessage(Toast.error),
  info: showToastMessage(Toast.info)
};

const MessagesProvider: React.FC = ({ children }) => {
  return (
    <MessagesDispatchContext.Provider value={toast}>
      {children}
    </MessagesDispatchContext.Provider>
  );
};

const useMessageContext = () => {
  const context = React.useContext(MessagesDispatchContext);
  if (context === undefined) {
    throw new Error("useMessageContext must be used within a MessagesProvider");
  }
  return context;
};

export { MessagesDispatchContext, MessagesProvider, useMessageContext };
