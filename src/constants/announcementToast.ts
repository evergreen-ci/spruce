interface AnnouncementToast {
  closable: boolean;
  expires?: number;
  message: string;
  title?: string;
  variant: "success" | "warning" | "error" | "info";
}

// Hardcode the toastData value to display a sitewide announcement toast
export const toastData: AnnouncementToast | null = null;
