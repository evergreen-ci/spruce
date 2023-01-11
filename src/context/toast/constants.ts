import { Variant } from "@leafygreen-ui/toast";
import { InvertedObject } from "types/utils";
import { ToastVariants } from "./types";

const mapToastToLeafyGreenVariant: {
  [key in ToastVariants]: Variant;
} = {
  success: Variant.Success,
  warning: Variant.Important,
  error: Variant.Warning,
  info: Variant.Note,
  progress: Variant.Progress,
};

const mapLeafyGreenVariantToToast: InvertedObject<
  typeof mapToastToLeafyGreenVariant
> = {
  [Variant.Success]: "success",
  [Variant.Important]: "warning",
  [Variant.Warning]: "error",
  [Variant.Note]: "info",
  [Variant.Progress]: "progress",
};

const mapVariantToTitle = {
  [Variant.Success]: "Success!",
  [Variant.Important]: "Warning!",
  [Variant.Warning]: "Error!",
  [Variant.Note]: "Something Happened!",
  [Variant.Progress]: "Loading...",
};

const SECOND = 1000;
const TOAST_TIMEOUT = 30 * SECOND;

export {
  mapToastToLeafyGreenVariant,
  mapLeafyGreenVariantToToast,
  mapVariantToTitle,
  TOAST_TIMEOUT,
};
