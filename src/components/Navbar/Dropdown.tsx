import React, { useState } from "react";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { Menu, MenuItem } from "@leafygreen-ui/menu";
import { uiColors } from "@leafygreen-ui/palette";
import { Link } from "react-router-dom";

const { white } = uiColors;

const DropdownMenuIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <Icon glyph={open ? "CaretUp" : "CaretDown"} role="presentation" />
);

interface MenuItemType {
  "data-cy"?: string;
  text: string;
  href?: string;
  to?: string;
}

interface DropdownItemType extends MenuItemType {
  closeMenu: () => void;
}

const DropdownItem: React.FC<DropdownItemType> = ({
  "data-cy": itemDataCy,
  closeMenu,
  href,
  text,
  to,
}) => (
  <MenuItem
    as={to && Link}
    to={to}
    href={href}
    data-cy={itemDataCy}
    onClick={closeMenu}
  >
    {text}
  </MenuItem>
);

interface DropdownProps {
  dataCy?: string;
  menuItems: MenuItemType[];
  title: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  dataCy,
  menuItems,
  title,
}) => {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <Menu
      open={openMenu}
      setOpen={setOpenMenu}
      justify="start"
      trigger={
        <NavDropdownTitle data-cy={dataCy}>
          {title}
          <DropdownMenuIcon open={openMenu} />
        </NavDropdownTitle>
      }
    >
      {menuItems.map((menuItem) => (
        <DropdownItem
          key={`dropdown_${menuItem.text}`}
          closeMenu={() => setOpenMenu(false)}
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
  color: ${white};
`;
