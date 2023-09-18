import { useState } from "react";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { Menu, MenuItem } from "@leafygreen-ui/menu";
import { palette } from "@leafygreen-ui/palette";
import { Link } from "react-router-dom";
import { zIndex } from "constants/tokens";

const { white } = palette;

const NavDropdownMenuIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <Icon glyph={open ? "CaretUp" : "CaretDown"} role="presentation" />
);

export interface MenuItemType {
  "data-cy"?: string;
  text: string;
  href?: string;
  to?: string;
  onClick?: () => void;
}

interface NavDropdownItemType extends MenuItemType {
  closeMenu: () => void;
}

const NavDropdownItem: React.FC<NavDropdownItemType> = ({
  closeMenu,
  "data-cy": itemDataCy,
  href,
  text,
  to,
}) => {
  const isInternalLink = to !== undefined;

  return isInternalLink ? (
    <MenuItem as={Link} data-cy={itemDataCy} onClick={closeMenu} to={to}>
      {text}
    </MenuItem>
  ) : (
    <MenuItem as="a" data-cy={itemDataCy} onClick={closeMenu} href={href}>
      {text}
    </MenuItem>
  );
};

interface NavDropdownProps {
  dataCy?: string;
  menuItems: MenuItemType[];
  title: string;
}

export const NavDropdown: React.FC<NavDropdownProps> = ({
  dataCy,
  menuItems,
  title,
}) => {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <Menu
      open={openMenu}
      setOpen={setOpenMenu}
      popoverZIndex={zIndex.popover}
      justify="start"
      trigger={
        <NavDropdownTitle data-cy={dataCy}>
          {title}
          <NavDropdownMenuIcon open={openMenu} />
        </NavDropdownTitle>
      }
    >
      {menuItems.map((menuItem) => (
        <NavDropdownItem
          key={`dropdown_${menuItem.text}`}
          closeMenu={() => {
            menuItem.onClick?.(); // call if exists
            setOpenMenu(false);
          }}
          {...menuItem}
        />
      ))}
    </Menu>
  );
};

const NavDropdownTitle = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${white};
  cursor: pointer;
`;
