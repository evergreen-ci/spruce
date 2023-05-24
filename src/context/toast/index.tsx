import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Toast, Variant, useToast } from "@leafygreen-ui/toast";
import { WordBreak } from "components/styles";
import {
  mapVariantToTitle,
  mapToastToLeafyGreenVariant,
  mapLeafyGreenVariantToToast,
  TOAST_TIMEOUT,
} from "./constants";
import {
  DispatchToast,
  DispatchToastWithProgress,
  VisibleToast,
} from "./types";

interface ToastContextState {
  success: DispatchToast;
  warning: DispatchToast;
  error: DispatchToast;
  info: DispatchToast;
  progress: DispatchToastWithProgress;
}

export const ToastContext = createContext<ToastContextState | null>(null);

const useToastContext = (): ToastContextState => {
  const context = useContext(ToastContext);
  if (context === null || context === undefined) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
};

const ToastProvider: React.VFC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { pushToast } = useToast();
  const dispatchToast = useCallback(
    (toast: VisibleToast) =>
      pushToast({
        description: <WordBreak>{toast.message}</WordBreak>,
        dismissible: toast.closable,
        onClose: toast.closable ? toast.onClose : undefined,
        progress: toast.progress,
        timeout: toast.shouldTimeout ? TOAST_TIMEOUT : null,
        title: toast.title || mapVariantToTitle[toast.variant],
        variant: toast.variant,
      }),
    [pushToast]
  );

  const toastContext = useMemo(() => {
    const defaultOptions = {
      onClose: () => {},
      shouldTimeout: true,
      title: "",
    };

    return {
      success: (message = "", closable = true, options = {}) =>
        dispatchToast({
          variant: mapToastToLeafyGreenVariant.success,
          message,
          closable,
          ...defaultOptions,
          ...options,
        }),
      warning: (message = "", closable = true, options = {}) =>
        dispatchToast({
          variant: mapToastToLeafyGreenVariant.warning,
          message,
          closable,
          ...defaultOptions,
          ...options,
        }),
      error: (message = "", closable = true, options = {}) =>
        dispatchToast({
          variant: mapToastToLeafyGreenVariant.error,
          message,
          closable,
          ...defaultOptions,
          ...options,
        }),
      info: (message = "", closable = true, options = {}) =>
        dispatchToast({
          variant: mapToastToLeafyGreenVariant.info,
          message,
          closable,
          ...defaultOptions,
          ...options,
        }),
      progress: (message = "", progress = 0.5, closable = true, options = {}) =>
        dispatchToast({
          variant: mapToastToLeafyGreenVariant.progress,
          message,
          progress,
          closable,
          ...defaultOptions,
          ...options,
        }),
    };
  }, [dispatchToast]);

  return (
    <ToastContext.Provider value={toastContext}>
      {children}
      {/* <Toast
        description={<WordBreak>{visibleToast.message}</WordBreak>}
        onClose={
          visibleToast.closable
            ? () => {
                visibleToast.onClose();
                setToastOpen(false);
              }
            : undefined
        }
        data-cy="toast"
        data-variant={mapLeafyGreenVariantToToast[visibleToast.variant]}
        open={toastOpen}
        progress={visibleToast.progress}
        title={visibleToast.title || mapVariantToTitle[visibleToast.variant]}
        variant={visibleToast.variant}
      /> */}
    </ToastContext.Provider>
  );
};

export { ToastProvider, useToastContext };
