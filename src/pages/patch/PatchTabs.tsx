import React from "react";
import { Tabs, Tab } from "@leafygreen-ui/tabs";
import { paths } from "contants/routes";
import { useTabs, useDefaultPath } from "hooks";

enum PatchTab {
  Tasks = "tasks",
  Changes = "changes"
}
const DEFAULT_TAB = PatchTab.Tasks;

const tabToIndexMap = {
  [PatchTab.Tasks]: 0,
  [PatchTab.Changes]: 1
};

export const PatchTabs: React.FC = () => {
  useDefaultPath(tabToIndexMap, paths.patch, DEFAULT_TAB);

  const [selectedTab, selectTabHandler] = useTabs(
    tabToIndexMap,
    paths.patch,
    DEFAULT_TAB
  );

  return (
    <Tabs selected={selectedTab} setSelected={selectTabHandler}>
      <Tab name="Tasks" id="task-tab">
        I am the tasks table
      </Tab>
      <Tab name="Changes" id="changes-tab">
        I am the patch code changes
      </Tab>
    </Tabs>
  );
};
