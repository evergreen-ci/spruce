import React from "react";
import { Tab } from "@leafygreen-ui/tabs";
import { paths, PatchTab, DEFAULT_PATCH_TAB } from "constants/routes";
import { useTabs, useDefaultPath } from "hooks";
import { Tasks } from "pages/patch/patchTabs/Tasks";
import { CodeChanges } from "pages/patch/patchTabs/CodeChanges";
import { StyledTabs } from "components/styles/StyledTabs";
import { useParams } from "react-router-dom";

const tabToIndexMap = {
  [PatchTab.Tasks]: 0,
  [PatchTab.Changes]: 1,
};

interface Props {
  taskCount: number;
}

export const PatchTabs: React.FC<Props> = ({ taskCount }) => {
  const { id } = useParams<{ id: string }>();

  useDefaultPath({
    tabToIndexMap,
    defaultPath: `${paths.version}/${id}/${DEFAULT_PATCH_TAB}`,
  });

  const [selectedTab, selectTabHandler] = useTabs({
    tabToIndexMap,
    defaultTab: DEFAULT_PATCH_TAB,
    path: `${paths.version}/${id}`,
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
