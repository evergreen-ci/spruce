import { TaskResult, SortDirection } from "gql/generated/types";
import { PatchTasksQueryParams, TableOnChange } from "types/task";
import { useHistory, useLocation } from "react-router-dom";
import { parseQueryString, stringifyQuery } from "utils";

export const useUpdateSortOnTableChange = () => {
  const { replace } = useHistory();
  const { search, pathname } = useLocation();

  const tableChangeHandler: TableOnChange<TaskResult> = (
    ...[, , { order, columnKey }]
  ) => {
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
      replace(`${pathname}?${nextQueryParams}`);
    }
  };

  return tableChangeHandler;
};
