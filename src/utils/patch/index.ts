import { commitQueueAlias } from "constants/patch";

interface IsPatchUnconfiguredParams {
  alias: string;
  activated: boolean;
}

/**
 * `isPatchUnconfigured` returns true if the patch is not activated and the patch is not on the commit queue.
 * @param param - The alias and activated status of the patch.
 * @param param.alias - The alias of the patch.
 * @param param.activated - The activated status of the patch.
 * @returns - Whether or not the patch is unconfigured.
 */
export const isPatchUnconfigured = ({
  activated,
  alias,
}: IsPatchUnconfiguredParams): boolean =>
  !activated && alias !== commitQueueAlias;
