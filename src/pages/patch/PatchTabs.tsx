import React, { useState, useEffect } from "react";
import { Tab } from "@leafygreen-ui/tabs";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { usePatchAnalytics } from "analytics";
import { StyledTabs } from "components/styles/StyledTabs";
import { getVersionRoute, DEFAULT_PATCH_TAB } from "constants/routes";
import { usePrevious } from "hooks";
import { CodeChanges } from "pages/patch/patchTabs/CodeChanges";
import { Tasks } from "pages/patch/patchTabs/Tasks";
import { ChildPatch, PatchTab } from "types/patch";
import { queryString } from "utils";
import { DownstreamTasks } from "./patchTabs/DownstreamTasks";

const { parseQueryString } = queryString;
const tabToIndexMap = {
  [PatchTab.Tasks]: 0,
  [PatchTab.Changes]: 1,
  [PatchTab.DownstreamTasks]: 2,
};

interface Props {
  taskCount: number;
  childPatches?: ChildPatch[];
}

export const PatchTabs: React.FC<Props> = ({ taskCount, childPatches }) => {
  const { id, tab } = useParams<{ id: string; tab: PatchTab }>();
  const history = useHistory();
  const location = useLocation();

  const patchAnalytics = usePatchAnalytics();
  const [selectedTab, setSelectedTab] = useState(
    tabToIndexMap[tab] || tabToIndexMap[DEFAULT_PATCH_TAB]
  );
  // This is used to keep track of the first tab transition so we dont accidently trigger an analytics event for it
  const previousTab = usePrevious(selectedTab);
  useEffect(() => {
    const query = parseQueryString(location.search);
    const newRoute = getVersionRoute(id, {
      tab: Object.keys(tabToIndexMap)[selectedTab] as PatchTab,
      ...query,
    });
    history.replace(newRoute);
    if (previousTab !== undefined && previousTab !== selectedTab) {
      patchAnalytics.sendEvent({
        name: "Change Tab",
        tab: Object.keys(tabToIndexMap)[selectedTab] as PatchTab,
      });
    }
  }, [selectedTab]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StyledTabs
      selected={selectedTab}
      setSelected={setSelectedTab}
      aria-label="Patch Tabs"
    >
      <Tab name="Tasks" id="task-tab" data-cy="task-tab">
        <Tasks taskCount={taskCount} />
      </Tab>
      <Tab name="Changes" id="changes-tab" data-cy="changes-tab">
        <CodeChanges />
      </Tab>
      {childPatches && (
        <Tab
          name="Downstream Tasks"
          id="downstream-tab"
          data-cy="downstream-tasks-tab"
        >
          <DownstreamTasks childPatches={childPatches} />
        </Tab>
      )}
    </StyledTabs>
  );
};
