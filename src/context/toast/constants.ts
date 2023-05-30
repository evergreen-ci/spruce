import { Variant } from "@leafygreen-ui/toast";
import { ToastVariant } from "./types";

type VariantMapping<P> = {
  [K in (typeof Variant)[keyof typeof Variant]]: P;
};
const mapLeafyGreenVariantToToast: VariantMapping<ToastVariant> = {
  [Variant.Important]: "warning",
  [Variant.Note]: "info",
  [Variant.Progress]: "progress",
  [Variant.Success]: "success",
  [Variant.Warning]: "error",
};

const mapLeafyGreenVariantToTitle: VariantMapping<string> = {
  [Variant.Important]: "Warning!",
  [Variant.Note]: "Something Happened!",
  [Variant.Progress]: "Loading...",
  [Variant.Success]: "Success!",
  [Variant.Warning]: "Error!",
};

const SECOND = 1000;
const TOAST_TIMEOUT = 30 * SECOND;

export {
  mapLeafyGreenVariantToToast,
  mapLeafyGreenVariantToTitle,
  TOAST_TIMEOUT,
};
