import { useEffect } from "react";
import { NetworkStatus } from "@apollo/client";

export const useDisableTableSortersIfLoading = (
  networkStatus: NetworkStatus
): void => {
  useEffect(() => {
    const elements = document.querySelectorAll(
      "th.ant-table-column-has-actions.ant-table-column-has-sorters"
    );
    if (networkStatus < NetworkStatus.ready) {
      elements.forEach((el) => {
        // eslint-disable-next-line no-param-reassign
        (el as HTMLElement).style["pointer-events"] = "none";
      });
    } else {
      elements.forEach((el) => {
        // eslint-disable-next-line no-param-reassign
        (el as HTMLElement).style["pointer-events"] = "auto";
      });
    }
  }, [networkStatus]);
};
