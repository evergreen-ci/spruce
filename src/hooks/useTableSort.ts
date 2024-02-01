import { SortingState } from "@tanstack/react-table";
import { TableQueryParams } from "components/Table/utils";
import { SortDirection } from "gql/generated/types";
import { useQueryParams } from "hooks/useQueryParam";
import { queryString } from "utils";

const { getSortString } = queryString;

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
      [TableQueryParams.Sorts]: undefined,
      [TableQueryParams.SortDir]: undefined,
      [TableQueryParams.SortBy]: undefined,
    };

    if (sorter.length === 1) {
      const { desc, id } = sorter[0];
      nextQueryParams[TableQueryParams.SortDir] = desc
        ? SortDirection.Desc
        : SortDirection.Asc;
      nextQueryParams[TableQueryParams.SortBy] = id;
    } else if (sorter.length) {
      const sortString = sorter
        .map(({ desc, id }) =>
          getSortString(id, desc ? SortDirection.Desc : SortDirection.Asc),
        )
        .filter(Boolean)
        .join(";");

      nextQueryParams[TableQueryParams.Sorts] = sortString;
    }
    setQueryParams(nextQueryParams);
  }) satisfies CallbackType;

  return tableChangeHandler;
};
