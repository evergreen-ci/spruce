import { renderHook } from "@testing-library/react-hooks";
import { TaskSortCategory, SortDirection } from "gql/generated/types";
import { useQueryVariables } from "./useQueryVariables";

describe("useQueryVariables", () => {
  it("returns appropriate variables based on search string", () => {
    const search =
      "page=0&limit=20&sorts=NAME%3AASC%3BSTATUS%3AASC%3BBASE_STATUS%3ADESC%3BVARIANT%3AASC&statuses=success&taskName=generate";
    const versionId = "version";

    const { result } = renderHook(() => useQueryVariables(search, versionId));
    expect(result.current).toStrictEqual({
      taskFilterOptions: {
        baseStatuses: [],
        limit: 20,
        page: 0,
        sorts: [
          { Direction: SortDirection.Asc, Key: TaskSortCategory.Name },
          { Direction: SortDirection.Asc, Key: TaskSortCategory.Status },
          { Direction: SortDirection.Desc, Key: TaskSortCategory.BaseStatus },
          { Direction: SortDirection.Asc, Key: TaskSortCategory.Variant },
        ],
        statuses: ["success"],
        taskName: "generate",
        variant: "",
      },
      versionId,
    });
  });
});
