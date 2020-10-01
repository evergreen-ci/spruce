import { useEffect } from "react";

export const useDisableTableSortersIfLoading = (loading: boolean): void => {
  useEffect(() => {
    const elements = document.querySelectorAll(
      "th.ant-table-column-has-actions.ant-table-column-has-sorters"
    );
    if (loading) {
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
  }, [loading]);
};
