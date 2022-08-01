import { ToastTypeKeys } from "context/toast";

interface AnnouncementToast {
  closable: boolean;
  expires?: number;
  message: string;
  title?: string;
  variant: ToastTypeKeys;
}

// Hardcode the toastData value to display a sitewide announcement toast
export const toastData: AnnouncementToast | null = null;
