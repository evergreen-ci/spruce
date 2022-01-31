import { spacing } from "@leafygreen-ui/tokens";

const size = {
  xxs: spacing[1], // 4px
  xs: spacing[2], // 8px
  s: spacing[3], // 16px
  m: spacing[4], // 24px
  l: spacing[5], // 32px
  xl: spacing[6], // 64px
  xxl: spacing[7], // 88px
} as const;

const zIndex = {
  backdrop: 0,
  modal: 10,
  tooltip: 20,
  popover: 30,
  toast: 40,
  dropdown: 50,
} as const;

export { size, zIndex };
