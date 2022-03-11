import { useState, useEffect, useMemo } from "react";
import { Tab } from "@leafygreen-ui/tabs";
import { useParams, useHistory } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import { CodeChanges } from "components/CodeChanges/CodeChanges";
import { StyledTabs } from "components/styles/StyledTabs";
import { getVersionRoute, DEFAULT_PATCH_TAB } from "constants/routes";
import { Patch } from "gql/generated/types";
import { usePrevious } from "hooks";
import { DownstreamTasks } from "pages/version/DownstreamTasks";
import { Tasks } from "pages/version/Tasks";
import { PatchTab } from "types/patch";

interface Props {
  taskCount: number;
  isPatch: boolean;
  childPatches: Partial<Patch>[];
}

const tabMap = ({ taskCount, childPatches }) => ({
  [PatchTab.Tasks]: (
    <Tab name="Tasks" id="task-tab" data-cy="task-tab" key="tasks-tab">
      <Tasks taskCount={taskCount} />
    </Tab>
  ),
  [PatchTab.Changes]: (
    <Tab
      name="Changes"
      id="changes-tab"
      data-cy="changes-tab"
      key="changes-tab"
    >
      <CodeChanges />
    </Tab>
  ),
  [PatchTab.DownstreamTasks]: (
    <Tab
      name="Downstream Tasks"
      id="downstream-tab"
      data-cy="downstream-tasks-tab"
      key="downstream-tab"
    >
      <DownstreamTasks childPatches={childPatches} />
    </Tab>
  ),
});
export const Tabs: React.FC<Props> = ({ taskCount, childPatches, isPatch }) => {
  const { id, tab } = useParams<{ id: string; tab: PatchTab }>();
  const { sendEvent } = useVersionAnalytics(id);
  const history = useHistory();

  const tabIsActive = useMemo(
    () => ({
      [PatchTab.Tasks]: true,
      [PatchTab.Changes]: isPatch,
      [PatchTab.DownstreamTasks]: childPatches,
    }),
    [isPatch, childPatches]
  );

  const allTabs = useMemo(() => tabMap({ taskCount, childPatches }), [
    taskCount,
    childPatches,
  ]);
  const activeTabs = useMemo(
    () => Object.keys(allTabs).filter((t) => tabIsActive[t] as PatchTab[]),
    [allTabs, tabIsActive]
  );
  const defaultTab = tabIsActive[tab] ? tab : DEFAULT_PATCH_TAB;
  const [selectedTab, setSelectedTab] = useState(
    activeTabs.indexOf(defaultTab)
  );
  const previousTab = usePrevious(selectedTab);

  useEffect(() => {
    // If tab is undefined, set to task tab.
    if (!tab) {
      history.replace(
        getVersionRoute(id, {
          tab: PatchTab.Tasks,
        })
      );
    }
    // If tab updates in URL without having clicked a tab (e.g. clicked build variant), update here.
    if (tab && selectedTab !== activeTabs.indexOf(tab)) {
      setSelectedTab(activeTabs.indexOf(tab));
    }
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  // Function to update the URL and selectedTab state based on new tab selected.
  const processNewTab = (newTabIndex: number) => {
    const newTab = Object.keys(allTabs)[newTabIndex];
    const newRoute = getVersionRoute(id, {
      tab: newTab as PatchTab,
    });
    history.replace(newRoute);

    if (previousTab !== undefined && previousTab !== newTabIndex) {
      sendEvent({
        name: "Change Tab",
        tab: newTab as PatchTab,
      });
    }
    setSelectedTab(newTabIndex);
  };

  return (
    <StyledTabs
      selected={selectedTab}
      setSelected={processNewTab}
      aria-label="Patch Tabs"
    >
      {activeTabs.map((t: string) => allTabs[t])}
    </StyledTabs>
  );
};
