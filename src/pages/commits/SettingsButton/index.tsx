import React from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Checkbox from "@leafygreen-ui/checkbox";
import { Menu, MenuItem } from "@leafygreen-ui/menu";
import { Label } from "@leafygreen-ui/typography";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import Icon from "components/Icon";
import { INCLUDE_INACTIVE_MAINLINE_COMMIT_TASKS } from "constants/cookies";
import { useUpdateURLQueryParams } from "hooks";
import { ProjectFilterOptions } from "types/commits";
import { parseQueryString } from "utils/queryString";

const SettingsButton = () => {
  const { search } = useLocation();
  const updateQueryParams = useUpdateURLQueryParams();
  const parsed = parseQueryString(search);

  const includeInactiveTasks =
    parsed[ProjectFilterOptions.InactiveTasks] !== undefined
      ? parsed[ProjectFilterOptions.InactiveTasks] === "true"
      : Cookies.get(INCLUDE_INACTIVE_MAINLINE_COMMIT_TASKS) === "true";

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    updateQueryParams({
      [ProjectFilterOptions.InactiveTasks]: checked.toString(),
    });
    Cookies.set(INCLUDE_INACTIVE_MAINLINE_COMMIT_TASKS, checked.toString());
  };

  return (
    <Container>
      <Label htmlFor="project-task-status-select">Settings</Label>
      <Menu
        align="bottom"
        justify="start"
        trigger={<Button leftGlyph={<Icon glyph="Settings" />} />}
      >
        <MenuItem>
          <Checkbox
            label="Include Inactive tasks"
            checked={Boolean(includeInactiveTasks)}
            onChange={onChange}
          />
        </MenuItem>
      </Menu>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export { SettingsButton };
