import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import styled from "@emotion/styled";
import Toast, { Variant } from "@leafygreen-ui/toast";
import { WordBreak } from "components/styles";
import { zIndex } from "constants/tokens";
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
  hide: () => void;
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
  const [toastOpen, setToastOpen] = useState(false);
  const [visibleToast, setVisibleToast] = useState<VisibleToast>({
    variant: Variant.Note,
    message: "",
    closable: true,
    onClose: () => {},
    shouldTimeout: true,
    title: "",
    progress: null,
  });

  useEffect(() => {
    if (!visibleToast.shouldTimeout) {
      return;
    }
    const timeout = setTimeout(() => {
      hideToast();
    }, TOAST_TIMEOUT);
    return () => clearTimeout(timeout);
  });

  const dispatchToast = useCallback(
    (toast: VisibleToast) => {
      setVisibleToast(toast);
      setToastOpen(true);
    },
    [setVisibleToast, setToastOpen]
  );

  const hideToast = useCallback(() => {
    setToastOpen(false);
  }, [setToastOpen]);

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
      hide: hideToast,
    };
  }, [dispatchToast, hideToast]);

  return (
    <ToastContext.Provider value={toastContext}>
      {children}
      <StyledToast
        body={<WordBreak>{visibleToast.message}</WordBreak>}
        close={
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
      />
    </ToastContext.Provider>
  );
};

const StyledToast = styled(Toast)`
  z-index: ${zIndex.toast};
`;

export { ToastProvider, useToastContext };
