import Icon from "@leafygreen-ui/icon";
import { Menu, MenuItem } from "@leafygreen-ui/menu";
import { LoadingButton } from "components/Buttons";

interface Props {
  disabled?: boolean;
  loading?: boolean;
  dropdownItems: JSX.Element[];
  "data-cy"?: string;
}

export const ButtonDropdown: React.VFC<Props> = ({
  disabled = false,
  loading = false,
  dropdownItems,
  "data-cy": dataCy = "ellipsis-btn",
}) => (
  <Menu
    trigger={
      <LoadingButton
        size="small"
        data-cy={dataCy}
        disabled={disabled}
        loading={loading}
      >
        <Icon glyph="Ellipsis" />
      </LoadingButton>
    }
    data-cy="card-dropdown"
    adjustOnMutation
  >
    {dropdownItems}
  </Menu>
);

export const DropdownItem = MenuItem;
