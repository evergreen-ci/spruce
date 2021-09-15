import Icon from "@leafygreen-ui/icon";
import { Menu, MenuItem } from "@leafygreen-ui/menu";
import { Button } from "components/Button";

interface Props {
  disabled?: boolean;
  loading?: boolean;
  dropdownItems: JSX.Element[];
  "data-cy"?: string;
}

export const ButtonDropdown: React.FC<Props> = ({
  disabled = false,
  loading = false,
  dropdownItems,
  "data-cy": dataCy = "ellipsis-btn",
}: Props) => (
  <Menu
    trigger={
      <Button
        size="small"
        data-cy={dataCy}
        disabled={disabled}
        loading={loading}
      >
        <Icon glyph="Ellipsis" />
      </Button>
    }
    data-cy="card-dropdown"
    adjustOnMutation
  >
    {dropdownItems}
  </Menu>
);

export const DropdownItem = MenuItem;
