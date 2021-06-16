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

  const DropdownItem: React.FC<MenuItemType> = ({
    "data-cy": itemDataCy,
    href,
    text,
    to,
  }) => (
    <MenuItem
      as={to && Link}
      to={to}
      href={href}
      data-cy={itemDataCy}
      onClick={() => {
        setOpenMenu(false);
      }}
    >
      {text}
    </MenuItem>
  );

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
        <DropdownItem key={`dropdown_${menuItem.text}`} {...menuItem} />
      ))}
    </Menu>
  );
};

export const DropdownItem = (props) => {
  const { closeModal, to } = props;
  return <MenuItem as={to && Link} onClick={closeModal} {...props} />;
};

const NavDropdownTitle = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${white};
`;
