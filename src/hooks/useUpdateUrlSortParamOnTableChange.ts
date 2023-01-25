import { SortDirection } from "gql/generated/types";
import { PatchTasksQueryParams, TableOnChange } from "types/task";
import { useQueryParams } from "./useQueryParam";

interface Params {
  sendAnalyticsEvents?: () => void;
}

export const useUpdateUrlSortParamOnTableChange = <T extends unknown>({
  sendAnalyticsEvents = () => undefined,
}: Params = {}) => {
  const [queryParams, setQueryParams] = useQueryParams();

  const tableChangeHandler: TableOnChange<T> = (...[, , sorter]) => {
    sendAnalyticsEvents();
    const { order, columnKey } = Array.isArray(sorter) ? sorter[0] : sorter;
    const nextQueryParams = {
      ...queryParams,
      [PatchTasksQueryParams.SortDir]: mapTableSortDirectionToQueryParam(order),
      ...(order && { [PatchTasksQueryParams.SortBy]: columnKey }),
      [PatchTasksQueryParams.Page]: "0",
    };
    setQueryParams(nextQueryParams);
  };

  return tableChangeHandler;
};

const mapTableSortDirectionToQueryParam = (order: string) => {
  if (!order) {
    return null;
  }
  return order === "ascend" ? SortDirection.Asc : SortDirection.Desc;
};
