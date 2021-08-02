import { useState, useEffect } from "react";
import { Tab } from "@leafygreen-ui/tabs";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { usePatchAnalytics } from "analytics";
import { CodeChanges } from "components/PatchTabs/CodeChanges";
import { DownstreamTasks } from "components/PatchTabs/DownstreamTasks";
import { Tasks } from "components/PatchTabs/Tasks";
import { StyledTabs } from "components/styles/StyledTabs";
import { getVersionRoute, DEFAULT_PATCH_TAB } from "constants/routes";
import { Patch } from "gql/generated/types";
import { usePrevious } from "hooks";
import { PatchTab } from "types/patch";
import { queryString } from "utils";

const { parseQueryString } = queryString;

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
  const history = useHistory();
  const location = useLocation();

  const tabIsActive = {
    [PatchTab.Tasks]: true,
    [PatchTab.Changes]: isPatch,
    [PatchTab.DownstreamTasks]: childPatches,
  };

  const patchAnalytics = usePatchAnalytics();

  const allTabs = tabMap({ taskCount, childPatches });
  const activeTabs = Object.keys(allTabs).filter(
    (t) => tabIsActive[t]
  ) as PatchTab[];

  const defaultTab = tabIsActive[tab] ? tab : DEFAULT_PATCH_TAB;
  const [selectedTab, setSelectedTab] = useState(
    activeTabs.indexOf(defaultTab)
  );

  // This is used to keep track of the first tab transition so we dont accidently trigger an analytics event for it
  const previousTab = usePrevious(selectedTab);
  useEffect(() => {
    const query = parseQueryString(location.search);
    const newTab = Object.keys(tabMap({ taskCount, childPatches }))[
      selectedTab
    ];
    const newRoute = getVersionRoute(id, {
      tab: newTab as PatchTab,
      ...query,
    });
    history.replace(newRoute);
    if (previousTab !== undefined && previousTab !== selectedTab) {
      patchAnalytics.sendEvent({
        name: "Change Tab",
        tab: newTab as PatchTab,
      });
    }
  }, [selectedTab]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StyledTabs
      selected={selectedTab}
      setSelected={setSelectedTab}
      aria-label="Patch Tabs"
    >
      {activeTabs.map((t: string) => tabMap({ taskCount, childPatches })[t])}
    </StyledTabs>
  );
};

// const ActiveTabs = ({ taskCount, childPatches, isPatch }) => {
//   return activateTabs.
