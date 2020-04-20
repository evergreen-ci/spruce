import { useEffect } from "react";
import { TabToIndexMap } from "hooks/types";
import { useParams, useHistory } from "react-router-dom";

/**
 * This hook is used to automatically put the default selected tab at the end of the url path
 *
 * @param  {TabToIndexMap} tabToIndexMap a JS object that maps a tab to an index
 * the leafygreen Tab component works by using indexes which is why this is required
 * @param  {string} path the route path, e.g. on patch page the route is "/patch"
 * @param  {string} defaultTab the tab that is selected by default
 */
export const useDefaultPath = ({
  tabToIndexMap,
  defaultPath,
}: {
  tabToIndexMap: TabToIndexMap;
  defaultPath: string;
}) => {
  const history = useHistory();
  const { tab, id } = useParams<{ tab?: string; id: string }>();
  useEffect(() => {
    if (!tab || !(tab in tabToIndexMap)) {
      history.replace(defaultPath);
    }
  }, [tab, history, tabToIndexMap, id, defaultPath]);
};
