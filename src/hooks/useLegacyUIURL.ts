import { useState, useEffect } from "react";
import { matchPath, useLocation } from "react-router-dom";
import get from "lodash/get";
import { getUiUrl } from "utils/getEnvironmentVariables";

import { routes } from "constants/routes";

export const useLegacyUIURL = (): string | null => {
  const [id, setId] = useState("");
  const [legacyUIUrl, setLegacyUIUrl] = useState(null);
  const { pathname } = useLocation();

  const uiURL = getUiUrl();

  const legacyUIMap = {
    [routes.version]: `${uiURL}/version/${id}`,
    [routes.configurePatch]: `${uiURL}/patch/${id}`,
    [routes.userPatches]: `${uiURL}/patches/user/${id}`,
    [routes.task]: `${uiURL}/task/${id}`,
  };
  useEffect(() => {
    const legacyUIKeys = Object.keys(legacyUIMap);
    for (let i = 0; i < legacyUIKeys.length; i++) {
      const matchedPath = matchPath(pathname, {
        path: legacyUIKeys[i],
        exact: true,
      });
      if (matchedPath !== null) {
        setId(get(matchedPath, "params.id", ""));
        setLegacyUIUrl(legacyUIMap[legacyUIKeys[i]]);
        break;
      }
    }
  }, [id, pathname, legacyUIMap]);

  return legacyUIUrl;
};
