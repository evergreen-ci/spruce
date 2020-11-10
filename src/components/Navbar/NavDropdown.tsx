import React from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { uiColors } from "@leafygreen-ui/palette";
import { Menu, Dropdown } from "antd";
import get from "lodash/get";
import { Link } from "react-router-dom";
import { legacyRoutes } from "constants/externalResources";
import {
  paths,
  PreferencesTabRoutes,
  getUserPatchesRoute,
  getPreferencesRoute,
  routes,
} from "constants/routes";
import { GetUserQuery } from "gql/generated/types";
import { GET_USER } from "gql/queries";
import { getUiUrl } from "utils/getEnvironmentVariables";

const { white } = uiColors;

export const NavDropdown = () => {
  const { data } = useQuery<GetUserQuery>(GET_USER);
  const displayName = get(data, "user.displayName");

  // Could not query for the userId field with useQuery or pass it in as a prop because
  // Of how the antd Dropdown component is built. It will not render MenuItems as a
  // Functional component so i can not use hooks. If i pass in the component as JSX
  // with props the styling of the component will break.
  const userId = localStorage.getItem("userId");
  const uiURL = getUiUrl();

  const menuItems = (
    <Menu>
      <Menu.Item>
        <a data-cy="legacy_route" href={`${uiURL}${legacyRoutes.distros}`}>
          Distros
        </a>
      </Menu.Item>
      <Menu.Item>
        <Link to={routes.spawnHost}>Hosts</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to={`${getUserPatchesRoute(userId)}`}>Patches</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <Link to={paths.preferences}>Preferences</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to={getPreferencesRoute(PreferencesTabRoutes.Notifications)}>
          Notifications
        </Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menuItems}>
      <NavDropdownTitle
        className="ant-dropdown-link"
        data-cy="nav-dropdown-link"
        onClick={(e) => e.preventDefault()}
      >
        {displayName}
        <Icon glyph="CaretDown" />
      </NavDropdownTitle>
    </Dropdown>
  );
};

const NavDropdownTitle = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${white};
`;
