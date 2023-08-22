import { commitQueueAlias } from "constants/patch";

interface IsPatchUnconfiguredParams {
  alias: string;
  activated: boolean;
}

export const isPatchUnconfigured = ({
  activated,
  alias,
}: IsPatchUnconfiguredParams): boolean =>
  !activated && alias !== commitQueueAlias;
