import { ToastTypeKeys } from "context/toast";

interface AnnouncementToast {
  closable: boolean;
  expires?: number;
  message: string;
  title?: string;
  variant: ToastTypeKeys;
}

// Hardcode the toastData value to display a sitewide announcment toast
export const toastData: AnnouncementToast | null = null;
