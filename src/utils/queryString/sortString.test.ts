import { SorterResult } from "antd/es/table/interface";
import { SortDirection, TaskSortCategory, Task } from "gql/generated/types";
import { parseSortString, toSortString } from "./sortString";

describe("parseSortString", () => {
  it("should parse a sort string with multiple sorts", () => {
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
  });
  it("should not parse an invalid sort string", () => {
    expect(parseSortString("FOO:ASC")).toStrictEqual([]);
  });
});

describe("toSortString", () => {
  it("should convert a sort value into a sort string", () => {
    const input: SorterResult<Task> = {
      columnKey: TaskSortCategory.Name,
      order: "descend",
    };
    expect(toSortString(input)).toBe("NAME:DESC");
  });
  it("should return undefined when there is an invalid sort value", () => {
    const unsetSort: SorterResult<Task> = {
      columnKey: TaskSortCategory.Status,
      order: undefined,
    };
    expect(toSortString(unsetSort)).toBeUndefined();
  });
  it("should take a multi sort and convert it into a sort string", () => {
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
});
