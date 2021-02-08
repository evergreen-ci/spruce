import React from "react";
import { Tab } from "@leafygreen-ui/tabs";
import { useParams } from "react-router-dom";
import { usePatchAnalytics } from "analytics";
import { StyledTabs } from "components/styles/StyledTabs";
import { getVersionRoute, DEFAULT_PATCH_TAB } from "constants/routes";
import { useTabs, useDefaultPath } from "hooks";
import { CodeChanges } from "pages/patch/patchTabs/CodeChanges";
import { Tasks } from "pages/patch/patchTabs/Tasks";
import { PatchTab } from "types/patch";

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
    defaultPath: getVersionRoute(id, { tab: DEFAULT_PATCH_TAB }),
  });

  const patchAnalytics = usePatchAnalytics();

  const [selectedTab, selectTabHandler] = useTabs({
    tabToIndexMap,
    defaultTab: DEFAULT_PATCH_TAB,
    path: getVersionRoute(id),
    sendAnalyticsEvent: (tab: string) =>
      patchAnalytics.sendEvent({ name: "Change Tab", tab }),
  });

  return (
    <StyledTabs
      selected={selectedTab}
      setSelected={selectTabHandler}
      aria-label="Patch Tabs"
    >
      <Tab name="Tasks" id="task-tab" data-cy="task-tab">
        <Tasks taskCount={taskCount} />
      </Tab>
      <Tab name="Changes" id="changes-tab" data-cy="changes-tab">
        <CodeChanges />
      </Tab>
    </StyledTabs>
  );
};
