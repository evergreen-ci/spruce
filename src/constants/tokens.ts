import { spacing } from "@leafygreen-ui/tokens";

// Should be used for spacing such as margins and padding.
const size = {
  // 16px
  m: `${spacing[4]}px`,

  // 4px
  xs: `${spacing[2]}px`,
  xxs: `${spacing[1]}px`,

  // 24px
  l: `${spacing[5]}px`,
  // 8px
  s: `${spacing[3]}px`, // 32px
  xl: `${spacing[6]}px`, // 64px
  xxl: `${spacing[7]}px`, // 88px
} as const;

const zIndex = {
  backdrop: -1,

  // Set these values to 1 to utilize LeafyGreen's built-in stacking context
  modal: 1,
  popover: 1,
  sideNav: 1,

  dropdown: 50,
  max_do_not_use: 1000,
  toast: 40,
  tooltip: 20, // should only be used for things like the welcome modal that need to overlay EVERYTHING
} as const;

const fontSize = {
  l: "18px",
  m: "14px",
  s: "8px",
} as const;

export { size, zIndex, fontSize };
