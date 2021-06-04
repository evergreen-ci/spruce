import React from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { uiColors } from "@leafygreen-ui/palette";
import { Menu, Dropdown } from "antd";
import { Link } from "react-router-dom";
import { legacyRoutes } from "constants/externalResources";
import {
  PreferencesTabRoutes,
  getUserPatchesRoute,
  getPreferencesRoute,
  routes,
} from "constants/routes";
import { GetUserQuery } from "gql/generated/types";
import { GET_USER } from "gql/queries";
import { environmentalVariables } from "utils";

const { getUiUrl } = environmentalVariables;
const { white } = uiColors;

export const NavDropdown = () => {
  const { data } = useQuery<GetUserQuery>(GET_USER);
  const { user } = data || {};
  const { displayName, userId } = user || {};

  const uiURL = getUiUrl();

  const menuItems = (
    <Menu>
      <Menu.Item>
        <a data-cy="legacy_route" href={`${uiURL}${legacyRoutes.distros}`}>
          Distros
        </a>
      </Menu.Item>
      <Menu.Item>
        <a
          data-cy="legacy_route_project"
          href={`${uiURL}${legacyRoutes.projects}`}
        >
          Projects
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
        <Link to={getPreferencesRoute(PreferencesTabRoutes.Profile)}>
          Preferences
        </Link>
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
