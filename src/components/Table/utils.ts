import { OnChangeFn } from "@tanstack/react-table";

export enum TableQueryParams {
  Limit = "limit",
  Page = "page",
  SortBy = "sortBy",
  SortDir = "sortDir",
  Sorts = "sorts",
}

/**
 * `onChangeHandler` simplifies applying a side effect with one of react-table's callback functions (e.g. onColumnFiltersChange, onSortingChange).
 * @param setState - state updater as returned by a React useState hook.
 * @param sideEffect - side effect function, to be called with the updated state returned by setState.
 * @returns void
 */
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
