import { useState, useEffect, useMemo } from "react";
import { Tab } from "@leafygreen-ui/tabs";
import { useVersionAnalytics } from "analytics";
import { CodeChanges } from "components/CodeChanges/CodeChanges";
import { StyledTabs } from "components/styles/StyledTabs";
import { getVersionRoute, DEFAULT_PATCH_TAB } from "constants/routes";
import { VersionQuery } from "gql/generated/types";
import { usePrevious } from "hooks";
import { DownstreamTasks } from "pages/version/DownstreamTasks";
import { Tasks } from "pages/version/Tasks";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { PatchTab } from "types/patch";
import { queryString } from "utils";

const { parseQueryString } = queryString;

interface Props {
  taskCount: number;
  isPatch: boolean;
  childPatches: VersionQuery["version"]["patch"]["childPatches"];
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
export const Tabs: React.VFC<Props> = ({
  taskCount,
  childPatches,
  isPatch,
}) => {
  const { id, tab } = useParams<{ id: string; tab: PatchTab }>();
  const { sendEvent } = useVersionAnalytics(id);
  const history = useHistory();
  const location = useLocation();

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
  const isValidTab = tabIsActive[tab];
  const [selectedTab, setSelectedTab] = useState(
    activeTabs.indexOf(isValidTab ? tab : DEFAULT_PATCH_TAB)
  );
  const previousTab = usePrevious(selectedTab);

  useEffect(() => {
    // If tab is not valid, set to task tab.
    if (!isValidTab) {
      history.replace(getVersionRoute(id));
    }
    // If tab updates in URL without having clicked a tab (e.g. clicked build variant), update state here.
    else if (selectedTab !== activeTabs.indexOf(tab)) {
      setSelectedTab(activeTabs.indexOf(tab));
    }
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update the URL and selectedTab state based on new tab selected.
  const selectNewTab = (newTabIndex: number) => {
    const queryParams = parseQueryString(location.search);
    const newTab = Object.keys(allTabs)[newTabIndex];
    const newRoute = getVersionRoute(id, {
      tab: newTab as PatchTab,
      ...queryParams,
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
      setSelected={selectNewTab}
      aria-label="Patch Tabs"
    >
      {activeTabs.map((t: string) => allTabs[t])}
    </StyledTabs>
  );
};
