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
}

export const ButtonDropdown: React.VFC<Props> = ({
  "data-cy": dataCy = "ellipsis-btn",
  disabled = false,
  dropdownItems,
  loading = false,
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
  >
    {dropdownItems}
  </Menu>
);

export const DropdownItem = MenuItem;
