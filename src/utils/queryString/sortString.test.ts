import { SorterResult } from "antd/es/table/interface";
import { SortDirection, TaskSortCategory, Task } from "gql/generated/types";
import { parseSortString, toSortString } from "./sortString";

test("parseSortString", () => {
  expect(parseSortString("NAME:ASC;STATUS:DESC")).toStrictEqual([
    {
      Key: TaskSortCategory.Name,
      Direction: SortDirection.Asc,
    },
    {
      Key: TaskSortCategory.Status,
      Direction: SortDirection.Desc,
    },
  ]);

  expect(parseSortString("FOO:ASC")).toStrictEqual([]);
});

test("toSortString", () => {
  const input: SorterResult<Task> = {
    columnKey: TaskSortCategory.Name,
    order: "descend",
  };
  expect(toSortString(input)).toBe("NAME:DESC");

  const unsetSort: SorterResult<Task> = {
    columnKey: TaskSortCategory.Status,
    order: undefined,
  };
  expect(toSortString(unsetSort)).toBeUndefined();

  const multiSort: SorterResult<Task>[] = [
    {
      columnKey: TaskSortCategory.Status,
      order: undefined,
    },
    {
      columnKey: TaskSortCategory.BaseStatus,
      order: "ascend",
    },
  ];
  expect(toSortString(multiSort)).toBe("BASE_STATUS:ASC");
});
