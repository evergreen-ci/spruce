import React from "react";
import { useQuery } from "@apollo/react-hooks";
import styled from "@emotion/styled";
import { Menu, Dropdown } from "antd";
import Icon from "@leafygreen-ui/icon";
import { uiColors } from "@leafygreen-ui/palette";
import get from "lodash/get";
import { Link } from "react-router-dom";

import { GET_USER } from "gql/queries";
import { GetUserQuery } from "gql/generated/types";
import { getUiUrl } from "utils/getEnvironmentVariables";
import { legacyRoutes } from "constants/externalResources";
import { paths, preferencesTabRoutes } from "constants/routes";

const { white } = uiColors;

export const NavDropdown = () => {
  const { data } = useQuery<GetUserQuery>(GET_USER);
  const displayName = get(data, "user.displayName");
  return (
    <Dropdown overlay={MenuItems}>
      <NavDropdownTitle
        className="ant-dropdown-link"
        onClick={(e) => e.preventDefault()}
      >
        {displayName}
        <Icon glyph="CaretDown" />
      </NavDropdownTitle>
    </Dropdown>
  );
};

const MenuItems = () => {
  const uiURL = getUiUrl();
  return (
    <Menu>
      <Menu.Item>
        <a href={`${uiURL}${legacyRoutes.distros}`}>Distros</a>
      </Menu.Item>
      <Menu.Item>
        <a href={`${uiURL}${legacyRoutes.hosts}`}>Hosts</a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <Link to={paths.preferences}>Preferences</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to={`${paths.preferences}/${preferencesTabRoutes.Notifications}`}>
          Notifications
        </Link>
      </Menu.Item>
    </Menu>
  );
};

const NavDropdownTitle = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${white};
`;
