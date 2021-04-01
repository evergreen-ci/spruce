import React, { useState, useCallback, useEffect, ReactNode } from "react";
import Toast, { Variant } from "@leafygreen-ui/toast";
import { TOAST_TIMEOUT } from "constants/index";

type ToastType = {
  variant: Variant;
  message: ReactNode;
  closable: boolean;
  title: ReactNode;
};

type AddToast = (
  message: ReactNode,
  closable?: boolean,
  title?: string
) => void;

interface DispatchToast {
  success: AddToast;
  warning: AddToast;
  error: AddToast;
  info: AddToast;
  hide: () => void;
}

const variantToDefaultTitleMap = {
  [Variant.Success]: "Success!",
  [Variant.Important]: "Warning!",
  [Variant.Warning]: "Error!",
  [Variant.Note]: "Something Happened!",
};

export const ToastDispatchContext = React.createContext<any | null>(null);

const ToastProvider: React.FC = ({ children }) => {
  const [visibleToast, setVisibleToast] = useState<ToastType>({
    variant: Variant.Note,
    title: variantToDefaultTitleMap[Variant.Note],
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
    success: (
      message: ReactNode,
      closable: boolean = true,
      title: ReactNode = variantToDefaultTitleMap[Variant.Success]
    ) => addToast({ variant: Variant.Success, message, closable, title }),
    warning: (
      message: ReactNode,
      closable: boolean = true,
      title: ReactNode = variantToDefaultTitleMap[Variant.Important]
    ) => addToast({ variant: Variant.Important, message, closable, title }),
    error: (
      message: ReactNode,
      closable: boolean = true,
      title: ReactNode = variantToDefaultTitleMap[Variant.Warning]
    ) => addToast({ variant: Variant.Warning, message, closable, title }),
    info: (
      message: ReactNode,
      closable: boolean = true,
      title: ReactNode = variantToDefaultTitleMap[Variant.Note]
    ) => addToast({ variant: Variant.Note, message, closable, title }),
    hide: hideToast,
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      hideToast();
    }, TOAST_TIMEOUT);
    return () => clearTimeout(timeout);
  });

  return (
    <ToastDispatchContext.Provider value={toastContext}>
      {children}
      <Toast
        variant={visibleToast.variant}
        title={visibleToast.title}
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
