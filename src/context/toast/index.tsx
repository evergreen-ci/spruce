import { createContext, useCallback, useContext, useMemo } from "react";
import { css } from "@leafygreen-ui/emotion";
import {
  ToastProvider as LGToastProvider,
  Variant,
  useToast,
} from "@leafygreen-ui/toast";
import { WordBreak } from "components/styles";
import { zIndex } from "constants/tokens";
import {
  mapLeafyGreenVariantToTitle,
  mapLeafyGreenVariantToToast,
  TOAST_TIMEOUT,
} from "./constants";
import { DispatchToast, DispatchToastWithProgress, ToastParams } from "./types";

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

const ToastProviderCore: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { pushToast } = useToast();
  const dispatchToast = useCallback(
    ({
      closable,
      message,
      onClose,
      progress,
      shouldTimeout,
      title,
      variant,
    }: ToastParams) =>
      pushToast({
        description: <WordBreak>{message}</WordBreak>,
        dismissible: closable,
        onClose: closable ? onClose : undefined,
        progress,
        timeout: shouldTimeout ? TOAST_TIMEOUT : null,
        title: title || mapLeafyGreenVariantToTitle[variant],
        variant,
        // @ts-ignore
        "data-variant": mapLeafyGreenVariantToToast[variant],
        "data-cy": "toast",
      }),
    [pushToast],
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
          variant: Variant.Success,
          message,
          closable,
          ...defaultOptions,
          ...options,
        }),
      warning: (message = "", closable = true, options = {}) =>
        dispatchToast({
          variant: Variant.Important,
          message,
          closable,
          ...defaultOptions,
          ...options,
        }),
      error: (message = "", closable = true, options = {}) =>
        dispatchToast({
          variant: Variant.Warning,
          message,
          closable,
          ...defaultOptions,
          ...options,
        }),
      info: (message = "", closable = true, options = {}) =>
        dispatchToast({
          variant: Variant.Note,
          message,
          closable,
          ...defaultOptions,
          ...options,
        }),
      progress: (message = "", progress = 0.5, closable = true, options = {}) =>
        dispatchToast({
          variant: Variant.Progress,
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
    </ToastContext.Provider>
  );
};

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <LGToastProvider
    portalClassName={css`
      z-index: ${zIndex.toast};
    `}
  >
    <ToastProviderCore>{children}</ToastProviderCore>
  </LGToastProvider>
);

export { ToastProvider, useToastContext };
