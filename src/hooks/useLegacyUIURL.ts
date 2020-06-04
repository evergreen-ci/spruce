import { useState, useEffect } from "react";
import { matchPath } from "react-router-dom";
import get from "lodash/get";
import { getUiUrl } from "utils/getEnvironmentVariables";

import { routes } from "constants/routes";

export const useLegacyUIURL = (route: string, userId: string) => {
  const [id, setId] = useState("");
  const [legacyUIUrl, setLegacyUIUrl] = useState(null);
  const uiURL = getUiUrl();
  const legacyUIMap = {
    [routes.version]: `${uiURL}/version/${id}`,
    [routes.configurePatch]: `${uiURL}/patch/${id}`,
    [routes.userPatches]: `${uiURL}/patches/${id}`,
    [routes.task]: `${uiURL}/task/${id}`,
  };
  useEffect(() => {
    const legacyUIKeys = Object.keys(legacyUIMap);
    for (let i = 0; i < legacyUIKeys.length; i++) {
      const matchedPath = matchPath(route, {
        path: legacyUIKeys[i],
        exact: true,
      });
      if (matchedPath !== null) {
        setId(get(matchedPath, "params.id", ""));
        setLegacyUIUrl(legacyUIMap[legacyUIKeys[i]]);
        break;
      }
    }
  }, [id, userId, route, legacyUIMap]);

  return legacyUIUrl;
};
