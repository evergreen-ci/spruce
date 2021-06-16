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

interface DropdownProps {
  dataCy?: string;
  title: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  children,
  dataCy,
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
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            closeModal: () => setOpenMenu(false),
          });
        }
      })}
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
