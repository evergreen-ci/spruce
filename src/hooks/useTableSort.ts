import { SortingState } from "@tanstack/react-table";
import { TableQueryParams } from "components/Table/utils";
import { SortDirection } from "gql/generated/types";
import { useQueryParams } from "hooks/useQueryParam";

interface Props {
  sendAnalyticsEvents?: (sorter?: SortingState) => void;
}

type CallbackType = (sorter: SortingState) => void;

/**
 * `useTableSort` manages sorting via query params with react-table.
 * @param props - Object containing the following:
 * @param props.sendAnalyticsEvents - Optional callback that makes a call to sendEvent.
 * @returns tableChangeHandler - Function that accepts react-table's sort state and updates query params with these values.
 */
export const useTableSort = (props?: Props): CallbackType => {
  const [queryParams, setQueryParams] = useQueryParams();

  const tableChangeHandler = ((sorter: SortingState) => {
    props?.sendAnalyticsEvents?.(sorter);

    const nextQueryParams = {
      ...queryParams,
      [TableQueryParams.Page]: "0",
    };

    if (!sorter.length) {
      nextQueryParams[TableQueryParams.SortDir] = undefined;
      nextQueryParams[TableQueryParams.SortBy] = undefined;
    } else {
      // TODO: For tables that support multi-sort, we should be able to update this to handle a sorter array with more than one entry.
      const { desc, id } = Array.isArray(sorter) ? sorter[0] : sorter;
      nextQueryParams[TableQueryParams.SortDir] = desc
        ? SortDirection.Desc
        : SortDirection.Asc;
      nextQueryParams[TableQueryParams.SortBy] = id;
    }
    setQueryParams(nextQueryParams);
  }) satisfies CallbackType;

  return tableChangeHandler;
};
