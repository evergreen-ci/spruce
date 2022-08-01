import { useState, useEffect } from "react";
import get from "lodash/get";
import { matchPath, useLocation } from "react-router-dom";
import { routes } from "constants/routes";
import { environmentalVariables } from "utils";

const { getUiUrl } = environmentalVariables;
export const useLegacyUIURL = (): string | null => {
  const [id, setId] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [legacyUIUrl, setLegacyUIUrl] = useState(null);
  const { pathname } = useLocation();

  const uiURL = getUiUrl();

  useEffect(() => {
    const legacyUIMap = {
      [`${routes.version}/*`]: `${uiURL}/version/${id}`,
      [`${routes.configurePatch}/*`]: `${uiURL}/patch/${id}`,
      [routes.userPatches]: `${uiURL}/patches/user/${id}`,
      [`${routes.task}/*`]: `${uiURL}/task/${id}`,
      [routes.spawnHost]: `${uiURL}/spawn#?resourcetype=hosts`,
      [routes.spawnVolume]: `${uiURL}/spawn#?resourcetype=volumes`,
      [`${routes.commits}/:id`]: `${uiURL}/waterfall/${id}`,
      [`${routes.projectSettings}/*`]: `${uiURL}/projects##${identifier}`,
    };
    const legacyUIKeys = Object.keys(legacyUIMap);
    for (let i = 0; i < legacyUIKeys.length; i++) {
      const matchedPath = matchPath(legacyUIKeys[i], pathname);
      if (matchedPath !== null) {
        setId(get(matchedPath, "params.id", ""));
        setIdentifier(get(matchedPath, "params.identifier", ""));
        setLegacyUIUrl(legacyUIMap[legacyUIKeys[i]]);
        break;
      }
    }
  }, [id, identifier, pathname, uiURL]);

  return legacyUIUrl;
};
