import { spacing } from "@leafygreen-ui/tokens";

// Should be used for spacing such as margins and padding.
const size = {
  xxs: `${spacing[1]}px`, // 4px
  xs: `${spacing[2]}px`, // 8px
  s: `${spacing[3]}px`, // 16px
  m: `${spacing[4]}px`, // 24px
  l: `${spacing[5]}px`, // 32px
  xl: `${spacing[6]}px`, // 64px
  xxl: `${spacing[7]}px`, // 88px
} as const;

const zIndex = {
  backdrop: 0,
  modal: 10,
  tooltip: 20,
  popover: 30,
  toast: 40,
  dropdown: 50,
} as const;

const fontSize = {
  xs: "8px",
  s: "12px",
  m: "14px",
  l: "16px",
  xl: "18px",
} as const;

export { size, zIndex, fontSize };
