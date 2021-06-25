import { Variant } from "@leafygreen-ui/toast";

interface AnnouncementToast {
  closable: boolean;
  expires?: number;
  message: string;
  title?: string;
  variant: Variant;
}

export const toastData: AnnouncementToast | null = {
  closable: true,
  message: "Placeholder navigation copy text.",
  title: "Navigation Update",
  variant: "note",
};
