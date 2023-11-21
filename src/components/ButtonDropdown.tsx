import Icon from "@leafygreen-ui/icon";
import { Menu, MenuItem } from "@leafygreen-ui/menu";
import { LoadingButton } from "components/Buttons";
import { zIndex } from "constants/tokens";

interface Props {
  disabled?: boolean;
  loading?: boolean;
  dropdownItems: JSX.Element[];
  size?: "default" | "small" | "large";
  "data-cy"?: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

export const ButtonDropdown: React.FC<Props> = ({
  "data-cy": dataCy = "ellipsis-btn",
  disabled = false,
  dropdownItems,
  loading = false,
  open = undefined,
  setOpen = undefined,
  size = "small",
}) => (
  <Menu
    trigger={
      <LoadingButton
        size={size}
        data-cy={dataCy}
        disabled={disabled}
        loading={loading}
      >
        <Icon glyph="Ellipsis" />
      </LoadingButton>
    }
    data-cy="card-dropdown"
    popoverZIndex={zIndex.popover}
    adjustOnMutation
    open={open}
    setOpen={setOpen}
  >
    {dropdownItems}
  </Menu>
);

export const DropdownItem = MenuItem;
