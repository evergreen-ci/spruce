import { useState } from "react";
import { TabToIndexMap } from "hooks/types";
import { useParams, useHistory } from "react-router-dom";

type TabSelectHandler = (index: number) => void;

/**
 * This hook is used to get the state and handler function associated with using the leafygreen <Tab/> component
 *
 * @param  {TabToIndexMap} tabToIndexMap a JS object that maps a tab to an index
 * the leafygreen Tab component works by using indexes which is why this is required
 * @param  {string} path the route path, e.g. on patch page the route is "/patch"
 * @param  {string} defaultTab the tab that is selected by default
 * @returns {[number, (index: number) => void]}
 * first item in returned array represents the selected tab index
 * second item in returned array is a handler function for selecting a tab. Pass it to the <Tab/> component
 */
export const useTabs = (
  tabToIndexMap: TabToIndexMap,
  path: string,
  defaultTab: string
): [number, TabSelectHandler] => {
  const { tab, id } = useParams<{ tab?: string; id: string }>();
  const history = useHistory();

  const getIndexFromTab = (t: string) => {
    if (t && t in tabToIndexMap) {
      return tabToIndexMap[t];
    }
    return tabToIndexMap[defaultTab];
  };

  const getTabFromIndex = (index: number) =>
    Object.keys(tabToIndexMap).find((key) => tabToIndexMap[key] === index);

  const [selectedTab, setSelectedTab] = useState<number>(getIndexFromTab(tab));

  const selectTabHandler = (tabIndex: number) => {
    setSelectedTab(tabIndex);
    history.replace(`${path}/${id}/${getTabFromIndex(tabIndex)}`);
  };

  return [selectedTab, selectTabHandler];
};
