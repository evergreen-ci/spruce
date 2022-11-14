import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Menu, MenuItem } from "@leafygreen-ui/menu";
import { Label } from "@leafygreen-ui/typography";
import Icon from "components/Icon";
import { InactiveTasksToggle } from "components/InactiveTasksToggle";

const SettingsButton = () => (
  <Container>
    <Label htmlFor="project-task-status-select">Settings</Label>
    <Menu
      align="bottom"
      justify="start"
      trigger={<Button leftGlyph={<Icon glyph="Settings" />} />}
    >
      <MenuItem>
        <InactiveTasksToggle />
      </MenuItem>
    </Menu>
  </Container>
);

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export { SettingsButton };
