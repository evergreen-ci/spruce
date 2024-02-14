import { useState, useEffect } from "react";
import get from "lodash/get";
import { matchPath, useLocation } from "react-router-dom";
import { routes } from "constants/routes";
import { environmentVariables } from "utils";

const { getUiUrl } = environmentVariables;

export const useLegacyUIURL = (): string | null => {
  const [id, setId] = useState("");
  const [legacyUIUrl, setLegacyUIUrl] = useState(null);
  const { pathname } = useLocation();

  const uiURL = getUiUrl();

  useEffect(() => {
    setId("");
    setLegacyUIUrl(null);

    const legacyUIMap = {
      [`${routes.version}/*`]: `${uiURL}/version/${id}`,
      [`${routes.configurePatch}/*`]: `${uiURL}/patch/${id}`,
      [routes.userPatches]: `${uiURL}/patches/user/${id}`,
      [`${routes.task}/*`]: `${uiURL}/task/${id}`,
      [routes.spawnHost]: `${uiURL}/spawn#?resourcetype=hosts`,
      [routes.spawnVolume]: `${uiURL}/spawn#?resourcetype=volumes`,
      [`${routes.commits}/:id`]: `${uiURL}/waterfall/${id}`,
      [routes.hosts]: `${uiURL}/hosts`,
      [routes.host]: `${uiURL}/host/${id}`,
    };
    const legacyUIKeys = Object.keys(legacyUIMap);
    for (let i = 0; i < legacyUIKeys.length; i++) {
      const matchedPath = matchPath(legacyUIKeys[i], pathname);
      if (matchedPath !== null) {
        setId(
          get(matchedPath, "params.id", "") ||
            get(matchedPath, "params.identifier", "") ||
            get(matchedPath, "params.distroId", ""),
        );
        setLegacyUIUrl(legacyUIMap[legacyUIKeys[i]]);
        break;
      }
    }
  }, [id, pathname, uiURL]);

  return legacyUIUrl;
};
