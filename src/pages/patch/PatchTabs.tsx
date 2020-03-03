import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "@leafygreen-ui/tabs";
import { useParams, useHistory } from "react-router-dom";

enum PatchTab {
  Tasks = "tasks",
  Changes = "changes"
}
const DEFAULT_TAB = PatchTab.Tasks;

const mapTabToIndex = {
  [PatchTab.Tasks]: 0,
  [PatchTab.Changes]: 1
};

const getIndexFromTab = (tab: string) => {
  if (tab && tab in mapTabToIndex) {
    return mapTabToIndex[tab];
  }
  return mapTabToIndex[PatchTab.Tasks];
};
const getTabFromIndex = (index: number) =>
  Object.keys(mapTabToIndex).find(key => mapTabToIndex[key] === index);

export const PatchTabs: React.FC = () => {
  const { tab, patchID } = useParams<{ tab?: Tab; patchID: string }>();
  const history = useHistory();
  const [selectedTab, setSelectedTab] = useState<number>(getIndexFromTab(tab));

  const selectTabHandler = (tabIndex: number) => {
    setSelectedTab(tabIndex);
    history.replace(`/patch/${patchID}/${getTabFromIndex(tabIndex)}`);
  };

  useEffect(() => {
    if (!tab || !(tab in mapTabToIndex)) {
      history.replace(`/patch/${patchID}/${DEFAULT_TAB}`);
    }
  }, [tab, patchID, history]);

  return (
    <Tabs selected={selectedTab} setSelected={selectTabHandler}>
      <Tab name="Tasks"></Tab>
      <Tab name="Changes"></Tab>
    </Tabs>
  );
};
