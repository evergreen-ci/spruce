import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { uiColors } from "@leafygreen-ui/palette";
import { Dropdown as AntdDropdown } from "antd";

const { white } = uiColors;

interface DropdownProps {
  dataCy?: string;
  menuItems: JSX.Element;
  title: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  dataCy,
  menuItems,
  title,
}) => (
  <AntdDropdown overlay={menuItems}>
    <NavDropdownTitle
      className="ant-dropdown-link"
      data-cy={dataCy}
      onClick={(e) => e.preventDefault()}
    >
      {title}
      <Icon glyph="CaretDown" />
    </NavDropdownTitle>
  </AntdDropdown>
);

const NavDropdownTitle = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${white};
`;
