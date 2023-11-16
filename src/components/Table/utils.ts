import { OnChangeFn } from "@tanstack/react-table";

export const onChangeHandler = <T>(
  setState: OnChangeFn<T>,
  sideEffect?: (updatedState: T) => void
) =>
  ((updater) => {
    setState((prev) => {
      const updatedState =
        updater instanceof Function ? updater(prev) : updater;
      sideEffect?.(updatedState);
      return updatedState;
    });
  }) satisfies OnChangeFn<T>;

export enum TableQueryParams {
  Limit = "limit",
  Page = "page",
  SortBy = "sortBy",
  SortDir = "sortDir",
  Sorts = "sorts",
}
