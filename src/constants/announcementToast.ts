import { ToastVariant } from "context/toast/types";

interface AnnouncementToast {
  closable: boolean;
  expires?: number;
  message: string;
  progress?: number;
  title?: string;
  variant: ToastVariant;
}

// Hardcode the toastData value to display a sitewide announcement toast
export const toastData: AnnouncementToast | null = null;
