import React, { useState, useCallback } from "react";
import Toast, { Variant } from "@leafygreen-ui/toast";

type ToastType = { variant: Variant; message: string };

const variantToTitleMap = {
  [Variant.Success]: "Success!",
  [Variant.Important]: "Warning!",
  [Variant.Warning]: "Error!",
  [Variant.Note]: "Something Happened!",
};
const ToastDispatchContext = React.createContext<any | null>(null);

const ToastProvider: React.FC = ({ children }) => {
  const [visibleToast, setVisibleToast] = useState<ToastType>({
    variant: Variant.Note,
    message: "",
  });
  const [toastOpen, setToastOpen] = useState(false);
  const addToast = useCallback(
    (toast: ToastType) => {
      setVisibleToast(toast);
      setToastOpen(true);
    },
    [setVisibleToast, setToastOpen]
  );

  const toastContext = {
    success: (message: string) =>
      addToast({ variant: Variant.Success, message }),
    warning: (message: string) =>
      addToast({ variant: Variant.Important, message }),
    error: (message: string) => addToast({ variant: Variant.Warning, message }),
    info: (message: string) => addToast({ variant: Variant.Note, message }),
  };
  return (
    <ToastDispatchContext.Provider value={toastContext}>
      {children}
      <Toast
        variant={visibleToast?.variant}
        title={variantToTitleMap[visibleToast?.variant]}
        body={visibleToast?.message}
        open={toastOpen}
        close={() => setToastOpen(false)}
      />
    </ToastDispatchContext.Provider>
  );
};

const useToastContext = () => {
  const context = React.useContext(ToastDispatchContext);
  if (context === undefined) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
};

export { ToastProvider, useToastContext };
