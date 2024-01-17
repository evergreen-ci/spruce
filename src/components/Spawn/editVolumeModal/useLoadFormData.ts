import { useDisableSpawnExpirationCheckbox, useSpruceConfig } from "hooks";
import { TableVolume } from "types/spawn";
import { getNoExpirationCheckboxTooltipCopy } from "../utils";

export const useLoadFormData = (volume: TableVolume) => {
  const spruceConfig = useSpruceConfig();
  const disableExpirationCheckbox = useDisableSpawnExpirationCheckbox(
    true,
    volume,
  );
  const noExpirationCheckboxTooltip = getNoExpirationCheckboxTooltipCopy({
    disableExpirationCheckbox,
    limit: spruceConfig?.spawnHost?.unexpirableVolumesPerUser,
    isVolume: true,
  });

  return { disableExpirationCheckbox, noExpirationCheckboxTooltip };
};
