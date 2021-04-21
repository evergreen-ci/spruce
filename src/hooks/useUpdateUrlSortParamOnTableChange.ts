import { useHistory, useLocation } from "react-router-dom";
import { SortDirection } from "gql/generated/types";
import { PatchTasksQueryParams, TableOnChange } from "types/task";
import { queryString } from "utils";

const { parseQueryString, stringifyQuery } = queryString;
interface Params {
  sendAnalyticsEvents?: () => void;
}

export const useUpdateUrlSortParamOnTableChange = <T extends unknown>({
  sendAnalyticsEvents = () => undefined,
}: Params = {}) => {
  const { replace } = useHistory();
  const { search, pathname } = useLocation();

  const tableChangeHandler: TableOnChange<T> = (...[, , sorter]) => {
    sendAnalyticsEvents();

    const { order, columnKey } = Array.isArray(sorter) ? sorter[0] : sorter;

    // order is undefined when the column sorter is unselected (which occurs after being clicked three times)
    // when order is undefined, sort should be reset; therefore removed from the url
    if (!order) {
      replace(pathname);
      return;
    }

    const queryParams = parseQueryString(search);

    const nextQueryParams = {
      ...queryParams,
      [PatchTasksQueryParams.SortDir]:
        order === "ascend" ? SortDirection.Asc : SortDirection.Desc,
      [PatchTasksQueryParams.SortBy]: columnKey,
      [PatchTasksQueryParams.Page]: "0",
    };

    const nextSearch = stringifyQuery(nextQueryParams);

    if (nextSearch !== search.split("?")[1]) {
      replace(`${pathname}?${nextSearch}`);
    }
  };

  return tableChangeHandler;
};
