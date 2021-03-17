import { SorterResult } from "antd/es/table/interface";
import {
  Task,
  SortDirection,
  SortOrder,
  TaskSortCategory,
} from "gql/generated/types";

// takes sort input from the antd table and translates into part of the query string
export const toSortString = (
  sorts: SorterResult<Task> | SorterResult<Task>[]
) => {
  let sortStrings: string[] = [];
  const shortenSortOrder = (order: string) =>
    order === "ascend" ? SortDirection.Asc : SortDirection.Desc;
  if (Array.isArray(sorts)) {
    sorts.forEach((sort) => {
      const singleSortString = `${sort.columnKey}:${shortenSortOrder(
        sort.order
      )}`;
      sortStrings = sortStrings.concat(singleSortString);
    });
  } else {
    sortStrings = sortStrings.concat(
      `${sorts.columnKey}:${shortenSortOrder(sorts.order)}`
    );
  }

  return sortStrings.join(";");
};

// takes a sort query string and parses it into valid GQL params
export const parseSortString = (sortQuery: string | string[]): SortOrder[] => {
  let sorts: SortOrder[] = [];
  let sortArray: string[] = [];
  if (typeof sortQuery === "string") {
    sortArray = sortQuery.split(";");
  } else {
    sortArray = sortQuery;
  }
  if (sortArray?.length > 0) {
    sortArray.forEach((singleSort) => {
      const parts = singleSort.split(":");
      if (parts.length !== 2) {
        return;
      }
      if (
        !Object.values(TaskSortCategory).includes(parts[0] as TaskSortCategory)
      ) {
        return;
      }
      if (!Object.values(SortDirection).includes(parts[1] as SortDirection)) {
        return;
      }
      sorts = sorts.concat({
        Key: parts[0] as TaskSortCategory,
        Direction: parts[1] as SortDirection,
      });
    });
  }
  return sorts;
};
