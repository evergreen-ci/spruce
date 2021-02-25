import { SorterResult } from "antd/es/table/interface";
import {
  SortDirection,
  TaskSortCategory,
  TaskResult,
} from "gql/generated/types";
import { parseSortString, toSortString } from "./util";

test("parseSortString", () => {
  expect(parseSortString("NAME:ASC;STATUS:DESC")).toEqual([
    {
      Key: TaskSortCategory.Name,
      Direction: SortDirection.Asc,
    },
    {
      Key: TaskSortCategory.Status,
      Direction: SortDirection.Desc,
    },
  ]);

  expect(parseSortString("FOO:ASC")).toEqual([]);
});

test("toSortString", () => {
  const input: SorterResult<TaskResult> = {
    columnKey: TaskSortCategory.Name,
    order: "descend",
  };
  expect(toSortString(input)).toEqual("NAME:DESC");
});
