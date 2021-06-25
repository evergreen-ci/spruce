import React, { useState, useCallback, useEffect } from "react";
import Toast, { Variant } from "@leafygreen-ui/toast";
import { WordBreak } from "components/Typography";
import { TOAST_TIMEOUT } from "constants/index";

export type ToastType = {
  variant: Variant;
  message: string;
  closable: boolean;
  onClose: () => void;
  title?: string;
};

type AddToast = (message: string, closable?: boolean) => void;

interface DispatchToast {
  success: AddToast;
  warning: AddToast;
  error: AddToast;
  note: AddToast;
  hide: () => void;
}

const variantToTitleMap = {
  [Variant.Success]: "Success!",
  [Variant.Important]: "Warning!",
  [Variant.Warning]: "Error!",
  [Variant.Note]: "Something Happened!",
};

export const ToastDispatchContext = React.createContext<any | null>(null);

const ToastProvider: React.FC = ({ children }) => {
  const [visibleToast, setVisibleToast] = useState<ToastType>({
    variant: Variant.Note,
    message: "",
    closable: true,
    onClose: () => {},
    title: null,
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
      message: string,
      closable: boolean = true,
      onClose: () => void = () => {},
      title?: string
    ) =>
      addToast({ variant: Variant.Success, message, closable, onClose, title }),
    warning: (
      message: string,
      closable: boolean = true,
      onClose: () => void = () => {},
      title?: string
    ) =>
      addToast({
        variant: Variant.Important,
        message,
        closable,
        onClose,
        title,
      }),
    error: (
      message: string,
      closable: boolean = true,
      onClose: () => void = () => {},
      title?: string
    ) =>
      addToast({ variant: Variant.Warning, message, closable, onClose, title }),
    note: (
      message: string,
      closable: boolean = true,
      onClose: () => void = () => {},
      title?: string
    ) => addToast({ variant: Variant.Note, message, closable, onClose, title }),
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
        title={visibleToast?.title || variantToTitleMap[visibleToast?.variant]}
        body={<WordBreak>{visibleToast.message}</WordBreak>}
        open={toastOpen}
        close={
          visibleToast.closable &&
          (() => {
            visibleToast.onClose();
            setToastOpen(false);
          })
        }
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
