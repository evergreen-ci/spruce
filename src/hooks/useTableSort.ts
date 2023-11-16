import { useCallback } from "react";
import { SortingState } from "@tanstack/react-table";
import { TableQueryParams } from "components/Table/utils";
import { SortDirection } from "gql/generated/types";
import { useQueryParams } from "hooks/useQueryParam";

interface Params {
  sendAnalyticsEvents?: () => void;
}

/**
 * `useTableSort` manages sorting via query params with react-table.
 * @param params - Object containing the following:
 * @param params.sendAnalyticsEvents - Optional callback that makes a call to sendEvent.
 * @returns tableChangeHandler - Function that accepts react-table's sort state and updates query params with these values.
 */
export const useTableSort = ({
  sendAnalyticsEvents = () => undefined,
}: Params = {}) => {
  const [queryParams, setQueryParams] = useQueryParams();

  const tableChangeHandler = useCallback(
    (sorter: SortingState) => {
      sendAnalyticsEvents();

      const nextQueryParams = {
        ...queryParams,
        [TableQueryParams.Page]: "0",
      };

      if (!sorter.length) {
        nextQueryParams[TableQueryParams.SortDir] = undefined;
        nextQueryParams[TableQueryParams.SortBy] = undefined;
      } else {
        // TODO: For other tables that support multi-sort, we should be able to update this to handle a sorter array with more than one entry.
        const { desc, id } = Array.isArray(sorter) ? sorter[0] : sorter;
        nextQueryParams[TableQueryParams.SortDir] = desc
          ? SortDirection.Desc
          : SortDirection.Asc;
        nextQueryParams[TableQueryParams.SortBy] = id;
      }
      setQueryParams(nextQueryParams);
    },
    [queryParams, sendAnalyticsEvents, setQueryParams]
  );

  return tableChangeHandler;
};
