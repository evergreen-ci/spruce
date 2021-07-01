import { ToastTypeKeys } from "context/toast";

interface AnnouncementToast {
  closable: boolean;
  expires?: number;
  message: string;
  title?: string;
  variant: ToastTypeKeys;
}

export const toastData: AnnouncementToast | null = null;
