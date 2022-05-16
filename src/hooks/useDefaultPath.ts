import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TabToIndexMap } from "hooks/types";

/**
 * This hook is used to automatically put the default selected tab at the end of the url path
 *
 * @param  {TabToIndexMap} tabToIndexMap a JS object that maps a tab to an index
 * the leafygreen Tab component works by using indexes which is why this is required
 * @param  {string} defaultPath the full path that should be displayed by default (including the tab)
 */
export const useDefaultPath = ({
  tabToIndexMap,
  defaultPath,
}: {
  tabToIndexMap: TabToIndexMap;
  defaultPath: string;
}): void => {
  const navigate = useNavigate();
  const { tab, id } = useParams<{ tab?: string; id: string }>();
  useEffect(() => {
    if (!tab || !(tab in tabToIndexMap)) {
      navigate(defaultPath, { replace: true });
    }
  }, [tab, navigate, tabToIndexMap, id, defaultPath]);
};
