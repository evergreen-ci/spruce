import React, { useState, useCallback } from "react";
import Toast, { Variant } from "@leafygreen-ui/toast";

type ToastType = { variant: Variant; message: string; closable: boolean };

type AddToast = (message: string, closable?: boolean) => void;

interface DispatchToast {
  success: AddToast;
  warning: AddToast;
  error: AddToast;
  info: AddToast;
  hide: () => void;
}

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
    closable: true,
  });
  const [toastOpen, setToastOpen] = useState(false);

  const addToast = useCallback(
    (toast: ToastType) => {
      setVisibleToast(toast);
      setToastOpen(true);
    },
    [setVisibleToast, setToastOpen]
  );

  const hideToast = useCallback(() => {
    setToastOpen(false);
  }, [setToastOpen]);

  const toastContext = {
    success: (message: string, closable: boolean = true) =>
      addToast({ variant: Variant.Success, message, closable }),
    warning: (message: string, closable: boolean = true) =>
      addToast({ variant: Variant.Important, message, closable }),
    error: (message: string, closable: boolean = true) =>
      addToast({ variant: Variant.Warning, message, closable }),
    info: (message: string, closable: boolean = true) =>
      addToast({ variant: Variant.Note, message, closable }),
    hide: () => hideToast(),
  };
  return (
    <ToastDispatchContext.Provider value={toastContext}>
      {children}
      <Toast
        variant={visibleToast.variant}
        title={variantToTitleMap[visibleToast?.variant]}
        body={visibleToast.message}
        open={toastOpen}
        close={visibleToast.closable && (() => setToastOpen(false))}
        data-cy="toast"
      />
    </ToastDispatchContext.Provider>
  );
};

const useToastContext = (): DispatchToast => {
  const context = React.useContext(ToastDispatchContext);
  if (context === undefined) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
};

export { ToastProvider, useToastContext };
