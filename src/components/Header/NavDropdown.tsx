import { useState } from "react";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { Menu, MenuItem } from "@leafygreen-ui/menu";
import { palette } from "@leafygreen-ui/palette";
import { Link } from "react-router-dom";
import { zIndex } from "constants/tokens";

const { white } = palette;

const NavDropdownMenuIcon: React.VFC<{ open: boolean }> = ({ open }) => (
  <Icon glyph={open ? "CaretUp" : "CaretDown"} role="presentation" />
);

interface MenuItemType {
  "data-cy"?: string;
  text: string;
  href?: string;
  to?: string;
  onClick?: () => void;
}

interface NavDropdownItemType extends MenuItemType {
  closeMenu: () => void;
}

const NavDropdownItem: React.VFC<NavDropdownItemType> = ({
  "data-cy": itemDataCy,
  closeMenu,
  href,
  text,
  to,
}) => (
  <MenuItem
    as={to && Link}
    // LG typing should permit props associated with the `as`
    // component, but right now it doesn't. ¯\_(ツ)_/¯
    // @ts-expect-error
    to={to}
    href={href}
    data-cy={itemDataCy}
    onClick={closeMenu}
  >
    {text}
  </MenuItem>
);

interface NavDropdownProps {
  dataCy?: string;
  menuItems: MenuItemType[];
  title: string;
}

export const NavDropdown: React.VFC<NavDropdownProps> = ({
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
