import React from "react";
import Icon from "@leafygreen-ui/icon";
import { Menu, MenuItem } from "@leafygreen-ui/menu";
import OutsideClickHandler from "react-outside-click-handler";
import { Button } from "components/Button";

interface Props {
  disabled?: boolean;
  setIsVisibleDropdown?: (v: boolean) => void;
  loading?: boolean;
  isVisibleDropdown?: boolean;
  dropdownItems: JSX.Element[];
  dataCyBtn?: string;
  dataCyDropdown?: string;
}

export const ButtonDropdown: React.FC<Props> = ({
  disabled = false,
  loading = false,
  setIsVisibleDropdown = () => undefined,
  isVisibleDropdown = true,
  dropdownItems,
  dataCyBtn = "ellipsis-btn",
  dataCyDropdown = "card-dropdown",
}: Props) => {
  const toggleDropdown = () => {
    setIsVisibleDropdown(!isVisibleDropdown);
  };
  return (
    <Menu
      trigger={
        <Button
          size="small"
          data-cy={dataCyBtn}
          disabled={disabled}
          loading={loading}
          onClick={toggleDropdown}
          glyph={<Icon glyph="Ellipsis" />}
        />
      }
      open={isVisibleDropdown}
      data-cy={dataCyDropdown}
    >
      <OutsideClickHandler
        onOutsideClick={(e) => {
          if (
            isVisibleDropdown &&
            e.path[0]?.dataset.cy !== "patch-restart-modal" &&
            e.path[0]?.classList[0] !== "ant-modal-wrap"
          ) {
            setIsVisibleDropdown(false);
          }
        }}
      >
        {dropdownItems}
      </OutsideClickHandler>
    </Menu>
  );
};

export const DropdownItem = MenuItem;
