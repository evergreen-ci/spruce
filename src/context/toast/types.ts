import { Variant } from "@leafygreen-ui/toast";

type ToastVariant = "success" | "warning" | "error" | "info" | "progress";

type ToastParams = {
  variant: Variant;
  message: string;
  closable: boolean;
  onClose?: () => void;
  shouldTimeout?: boolean;
  title?: string;
  progress?: number;
};

type DispatchToast = (
  message: string,
  closable?: boolean,
  options?: {
    onClose?: () => void;
    shouldTimeout?: boolean;
    title?: string;
  },
) => void;

type DispatchToastWithProgress = (
  message: string,
  progress?: number,
  closable?: boolean,
  options?: {
    onClose?: () => void;
    shouldTimeout?: boolean;
    title?: string;
  },
) => void;

export type {
  DispatchToast,
  DispatchToastWithProgress,
  ToastVariant,
  ToastParams,
};
