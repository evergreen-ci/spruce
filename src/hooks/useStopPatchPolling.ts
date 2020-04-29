import React, { useEffect } from "react";
import { PatchStatus } from "types/patch";

interface Props {
  hasData: boolean;
  status: string;
  activated: boolean;
  stopPolling: () => void;
}

export const useStopPatchPolling = ({
  hasData,
  status,
  activated,
  stopPolling,
}: Props) => {
  if (
    hasData &&
    (status === PatchStatus.Failed ||
      status === PatchStatus.Success ||
      activated === false)
  ) {
    stopPolling();
  }
};
