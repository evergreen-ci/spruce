import { commitQueueAlias } from "constants/patch";

interface IsPatchUnconfiguredParams {
  alias: string;
  activated: boolean;
}

export const isPatchUnconfigured = ({
  alias,
  activated,
}: IsPatchUnconfiguredParams): boolean =>
  !activated && alias !== commitQueueAlias;
