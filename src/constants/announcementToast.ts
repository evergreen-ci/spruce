import { ToastTypeKeys } from "context/toast";

interface AnnouncementToast {
  closable: boolean;
  expires?: number;
  message: string;
  title?: string;
  variant: ToastTypeKeys;
}

export const toastData: AnnouncementToast | null = {
  closable: true,
  message:
    "Hey there! If you’re looking for a link under your user dropdown on the top navigation on the right, it may have moved to the main top navigation on the left, or under the ‘More’ menu. My Patches and My Hosts (aka Spawn Hosts) are now standalone links in the main top navigation for easier access.",
  title: "Navigation Update",
  variant: "info",
};
