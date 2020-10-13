import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { TabToIndexMap } from "hooks/types";

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

interface Props {
  tabToIndexMap: TabToIndexMap;
  defaultTab: string;
  path?: string;
  query?: URLSearchParams;
  sendAnalyticsEvent?: (tab: string) => void;
}

export const useTabs = ({
  tabToIndexMap,
  defaultTab,
  path,
  query,
  sendAnalyticsEvent = () => undefined,
}: Props): [number, TabSelectHandler] => {
  const { tab } = useParams<{ tab?: string }>();
  const history = useHistory();

  const getIndexFromTab = (t: string): number => {
    if (t && t in tabToIndexMap) {
      return tabToIndexMap[t];
    }
    return tabToIndexMap[defaultTab];
  };
  const getTabFromIndex = (index: number): string =>
    Object.keys(tabToIndexMap).find((key) => tabToIndexMap[key] === index);

  const [selectedTab, setSelectedTab] = useState<number>(getIndexFromTab(tab));

  const selectTabHandler = (tabIndex: number): void => {
    setSelectedTab(tabIndex);
    const currentTab = getTabFromIndex(tabIndex);
    history.replace(`${path}/${currentTab}?${query ? query.toString() : ""}`);
    sendAnalyticsEvent(currentTab);
  };
  useEffect(() => {
    setSelectedTab(getIndexFromTab(tab));
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps
  return [selectedTab, selectTabHandler];
};
