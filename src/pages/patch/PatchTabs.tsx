import React from "react";
import { Tab } from "@leafygreen-ui/tabs";
import { paths } from "contants/routes";
import { useTabs, useDefaultPath } from "hooks";
import { Tasks } from "pages/patch/patchTabs/Tasks";
import { CodeChanges } from "pages/patch/patchTabs/CodeChanges";
import { StyledTabs } from "components/styles/StyledTabs";
import { useParams } from "react-router-dom";

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
  const { id } = useParams<{ id: string }>();
  useDefaultPath({
    tabToIndexMap,
    defaultPath: `${paths.patch}/${id}/${DEFAULT_TAB}`,
  });
  const [selectedTab, selectTabHandler] = useTabs({
    tabToIndexMap,
    defaultTab: DEFAULT_TAB,
    path: `${paths.patch}/${id}`,
  });
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
