import React from "react";
import { Tab } from "@leafygreen-ui/tabs";
import { paths } from "contants/routes";
import { useTabs, useDefaultPath } from "hooks";
import { Tasks } from "pages/patch/patchTabs/Tasks";
import { StyledTabs } from "components/styles/StyledTabs";
import { Patch } from "gql/queries/patch";

enum PatchTab {
  Tasks = "tasks",
  Changes = "changes"
}
const DEFAULT_TAB = PatchTab.Tasks;

const tabToIndexMap = {
  [PatchTab.Tasks]: 0,
  [PatchTab.Changes]: 1
};

interface Props {
  patch: Patch;
  patchLoading: boolean;
}

export const PatchTabs: React.FC<Props> = ({ patch, patchLoading }) => {
  useDefaultPath(tabToIndexMap, paths.patch, DEFAULT_TAB);

  const [selectedTab, selectTabHandler] = useTabs(
    tabToIndexMap,
    paths.patch,
    DEFAULT_TAB
  );

  return (
    <StyledTabs selected={selectedTab} setSelected={selectTabHandler}>
      <Tab name="Tasks" id="task-tab">
        <Tasks patch={patch} patchLoading={patchLoading}/>
      </Tab>
      <Tab name="Changes" id="changes-tab">
        I am the patch code changes
      </Tab>
    </StyledTabs>
  );
};
