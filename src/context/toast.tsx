import React, { useState, useCallback, useEffect } from "react";
import styled from "@emotion/styled";
import Toast, { Variant } from "@leafygreen-ui/toast";
import { WordBreak } from "components/Typography";
import { TOAST_TIMEOUT } from "constants/index";
import { InvertedObject } from "types/utils";

type ToastProps = {
  variant: Variant;
  message: string;
  closable: boolean;
  onClose?: () => void;
  shouldTimeout?: boolean;
  title?: string;
};

type ToastOptions = {
  onClose?: () => void;
  shouldTimeout?: boolean;
  title?: string;
};

type AddToast = (
  message: string,
  closable?: boolean,
  options?: ToastOptions
) => void;

interface ToastType {
  success: string;
  warning: string;
  error: string;
  info: string;
}
export type ToastTypeKeys = keyof ToastType;

const mapToastToLeafyGreenVariant: { [key in ToastTypeKeys]: Variant } = {
  success: Variant.Success,
  warning: Variant.Important,
  error: Variant.Warning,
  info: Variant.Note,
};

const mapLeafyGreenVariantToToastVariant: Omit<
  InvertedObject<typeof mapToastToLeafyGreenVariant>,
  "progress"
> = {
  [Variant.Success]: "success",
  [Variant.Important]: "warning",
  [Variant.Warning]: "error",
  [Variant.Note]: "info",
};
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

export const ToastDispatchContext = React.createContext<any | null>(null);

const ToastProvider: React.FC = ({ children }) => {
  const [visibleToast, setVisibleToast] = useState<ToastProps>({
    variant: Variant.Note,
    message: "",
    closable: true,
    onClose: () => {},
    shouldTimeout: true,
    title: null,
  });
  const [toastOpen, setToastOpen] = useState(false);

  const addToast = useCallback(
    (toast: ToastProps) => {
      setVisibleToast(toast);
      setToastOpen(true);
    },
    [setVisibleToast, setToastOpen]
  );

  const hideToast = useCallback(() => {
    setToastOpen(false);
  }, [setToastOpen]);

  const defaultOptions = {
    onClose: () => {},
    shouldTimeout: true,
    title: null,
  };

  const toastContext: DispatchToast = {
    success: (message = "", closable = true, options = defaultOptions) =>
      addToast({
        variant: mapToastToLeafyGreenVariant.success,
        message,
        closable,
        ...options,
      }),
    warning: (message = "", closable = true, options = defaultOptions) =>
      addToast({
        variant: mapToastToLeafyGreenVariant.warning,
        message,
        closable,
        ...options,
      }),
    error: (message = "", closable = true, options = defaultOptions) =>
      addToast({
        variant: mapToastToLeafyGreenVariant.error,
        message,
        closable,
        ...options,
      }),
    info: (message = "", closable = true, options = defaultOptions) =>
      addToast({
        variant: mapToastToLeafyGreenVariant.info,
        message,
        closable,
        ...options,
      }),
    hide: hideToast,
  };

  useEffect(() => {
    if (!visibleToast.shouldTimeout) {
      return;
    }

    const timeout = setTimeout(() => {
      hideToast();
    }, TOAST_TIMEOUT);
    return () => clearTimeout(timeout);
  });

  return (
    <ToastDispatchContext.Provider value={toastContext}>
      {children}
      <StyledToast
        variant={visibleToast.variant}
        title={visibleToast?.title || variantToTitleMap[visibleToast?.variant]}
        body={<WordBreak>{visibleToast.message}</WordBreak>}
        open={toastOpen}
        close={
          visibleToast.closable
            ? () => {
                visibleToast.onClose();
                setToastOpen(false);
              }
            : undefined
        }
        data-cy="toast"
        data-variant={mapLeafyGreenVariantToToastVariant[visibleToast.variant]}
      />
    </ToastDispatchContext.Provider>
  );
};

const useToastContext = (): DispatchToast => {
  const context = React.useContext(ToastDispatchContext);
  if (context === null || context === undefined) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
};

const StyledToast = styled(Toast)`
  z-index: 10;
`;

export { ToastProvider, useToastContext };
