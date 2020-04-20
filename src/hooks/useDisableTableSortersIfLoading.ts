import { useEffect } from "react";
import { NetworkStatus } from "apollo-client";

export const useDisableTableSortersIfLoading = (
  networkStatus: NetworkStatus
) => {
  useEffect(() => {
    const elements = document.querySelectorAll(
      "th.ant-table-column-has-actions.ant-table-column-has-sorters"
    );
    if (networkStatus < NetworkStatus.ready) {
      elements.forEach((el) => {
        (el as HTMLElement).style["pointer-events"] = "none";
      });
    } else {
      elements.forEach((el) => {
        (el as HTMLElement).style["pointer-events"] = "auto";
      });
    }
  }, [networkStatus]);
};
