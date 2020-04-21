import React from "react";
import { Tab } from "@leafygreen-ui/tabs";
import { paths } from "constants/routes";
import { useTabs, useDefaultPath } from "hooks";
import { Tasks } from "pages/patch/patchTabs/Tasks";
import { CodeChanges } from "pages/patch/patchTabs/CodeChanges";
import { StyledTabs } from "components/styles/StyledTabs";

enum PatchTab {
  Tasks = "tasks",
  Changes = "changes",
}
const DEFAULT_TAB = PatchTab.Tasks;

const tabToIndexMap = {
  [PatchTab.Tasks]: 0,
  [PatchTab.Changes]: 1,
};

interface Props {
  taskCount: string;
}

export const PatchTabs: React.FC<Props> = ({ taskCount }) => {
  useDefaultPath(tabToIndexMap, paths.patch, DEFAULT_TAB);

  const [selectedTab, selectTabHandler] = useTabs(
    tabToIndexMap,
    paths.patch,
    DEFAULT_TAB
  );

  return (
    <StyledTabs selected={selectedTab} setSelected={selectTabHandler}>
      <Tab name="Tasks" id="task-tab">
        <Tasks taskCount={taskCount} />
      </Tab>
      <Tab name="Changes" id="changes-tab">
        <CodeChanges />
      </Tab>
    </StyledTabs>
  );
};
