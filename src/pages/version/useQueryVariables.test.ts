import { TaskSortCategory, SortDirection } from "gql/generated/types";
import { renderHook } from "test_utils";
import { useQueryVariables } from "./useQueryVariables";

describe("useQueryVariables", () => {
  it("returns appropriate variables based on search string", () => {
    const search =
      "page=0&limit=20&sorts=NAME%3AASC%3BSTATUS%3AASC%3BBASE_STATUS%3ADESC%3BVARIANT%3AASC&statuses=success&taskName=generate";
    const versionId = "version";

    const { result } = renderHook(() => useQueryVariables(search, versionId));
    expect(result.current).toStrictEqual({
      versionId,
      taskFilterOptions: {
        taskName: "generate",
        variant: "",
        statuses: ["success"],
        baseStatuses: [],
        sorts: [
          { Key: TaskSortCategory.Name, Direction: SortDirection.Asc },
          { Key: TaskSortCategory.Status, Direction: SortDirection.Asc },
          { Key: TaskSortCategory.BaseStatus, Direction: SortDirection.Desc },
          { Key: TaskSortCategory.Variant, Direction: SortDirection.Asc },
        ],
        page: 0,
        limit: 20,
      },
    });
  });
});
