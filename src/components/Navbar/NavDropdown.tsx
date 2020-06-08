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
import {
  paths,
  preferencesTabRoutes,
  getUserPatchesRoute,
} from "constants/routes";

const { white } = uiColors;

export const NavDropdown = () => {
  const { data } = useQuery<GetUserQuery>(GET_USER);
  const displayName = get(data, "user.displayName");
  const userId = get(data, "user.userId");
  return (
    <Dropdown overlay={<MenuItems userId={userId} />}>
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

interface MenuItemsProps {
  userId: string;
}
const MenuItems: React.FC<MenuItemsProps> = ({ userId }) => {
  const uiURL = getUiUrl();
  return (
    <Menu>
      <Menu.Item>
        <a data-cy="legacy_route" href={`${uiURL}${legacyRoutes.distros}`}>
          Distros
        </a>
      </Menu.Item>
      <Menu.Item>
        <a href={`${uiURL}${legacyRoutes.hosts}`}>Hosts</a>
      </Menu.Item>
      <Menu.Item>
        <Link to={`${getUserPatchesRoute(userId)}`}>Patches</Link>
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
