import { MockedProvider } from "@apollo/client/testing";
import { getSpruceConfigMock } from "gql/mocks/getSpruceConfig";
import { renderWithRouterMatch as render, screen } from "test_utils";
import { FoldedCommitsRow, rowType } from "../types";
import { FoldedCommit } from "./FoldedCommit";

describe("foldedCommit", () => {
  it("displays the number of inactive commits but not the individual commits on render", () => {
    const data: FoldedCommitsRow = {
      rolledUpCommits,
      expanded: false,
      type: rowType.FOLDED_COMMITS,
      selected: false,
      date: new Date("2023-06-06"),
    };
    const onToggleFoldedCommit = jest.fn(({ expanded }) => {
      data.expanded = expanded;
    });

    render(
      <MockedProvider mocks={[getSpruceConfigMock]}>
        <FoldedCommit
          index={0}
          data={data}
          onToggleFoldedCommit={onToggleFoldedCommit}
          numVisibleCols={5}
          selected={false}
        />
      </MockedProvider>
    );
    expect(screen.getByText("Expand 5 inactive")).toBeInTheDocument();
    expect(screen.queryByText("Collapse 5 inactive")).toBeNull();
  });

  it("can be expanded to show all of the commits", () => {
    const data: FoldedCommitsRow = {
      rolledUpCommits,
      expanded: false,
      type: rowType.FOLDED_COMMITS,
      selected: false,
      date: new Date("2023-06-06"),
    };
    const onToggleFoldedCommit = jest.fn(({ expanded }) => {
      data.expanded = expanded;
    });

    render(
      <MockedProvider mocks={[getSpruceConfigMock]}>
        <FoldedCommit
          index={0}
          data={data}
          onToggleFoldedCommit={onToggleFoldedCommit}
          numVisibleCols={5}
          selected={false}
        />
      </MockedProvider>
    );
    screen.queryByText("Expand 5 inactive").click();
    expect(screen.queryByText("Expand 5 inactive")).toBeNull();
    expect(screen.getByText("Collapse 5 inactive")).toBeInTheDocument();
    expect(onToggleFoldedCommit).toHaveBeenCalledWith({
      expanded: true,
      index: 0,
      numCommits: 5,
    });

    for (let i = 0; i < rolledUpCommits.length; i++) {
      const commit = rolledUpCommits[i];
      expect(screen.queryByText(commit.message)).toBeVisible();
    }
  });
});

const rolledUpCommits = [
  {
    id: "1",
    createTime: new Date("2021-09-22T19:33:22Z"),
    author: "A developer",
    order: 1010,
    message: "v2.17.0",
    revision: "ca3a8b45e855cf0d2e353a85c8af2d4c2a1dad95",
  },
  {
    id: "2",
    createTime: new Date("2021-09-23T19:33:22Z"),
    author: "A developer",
    order: 1020,
    message: "v2.17.1",
    revision: "ca3a8b45e855cf0d2e353a85c8af2d4c2a1dad95",
  },
  {
    id: "3",
    createTime: new Date("2021-09-24T19:33:22Z"),
    author: "A developer",
    order: 1030,
    message: "v2.17.2",
    revision: "ca3a8b45e855cf0d2e353a85c8af2d4c2a1dad95",
  },
  {
    id: "4",
    createTime: new Date("2021-09-25T19:33:22Z"),
    author: "A developer",
    order: 1040,
    message: "v2.17.3",
    revision: "ca3a8b45e855cf0d2e353a85c8af2d4c2a1dad95",
  },
  {
    id: "5",
    createTime: new Date("2021-09-26T19:33:22Z"),
    author: "A developer",
    order: 1050,
    message: "v2.17.4",
    revision: "ca3a8b45e855cf0d2e353a85c8af2d4c2a1dad95",
  },
];
