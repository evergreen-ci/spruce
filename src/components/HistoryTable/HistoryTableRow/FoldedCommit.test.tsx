import { CSSProperties } from "react";
import { MockedProvider } from "@apollo/client/testing";
import { getSpruceConfigMock } from "gql/mocks/getSpruceConfig";
import { renderWithRouterMatch as render } from "test_utils";
import { FOLDED_COMMITS_HEIGHT } from "../constants";
import { FoldedCommit } from "./FoldedCommit";

const style: CSSProperties = {
  top: 0,
  left: 0,
  position: "absolute",
  height: FOLDED_COMMITS_HEIGHT,
};

const Content = () => {
  // The params are ignored because they're only needed in the context of the History Table.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const toggleRow = (idx: number, numCommits: number) => {};

  return (
    <MockedProvider mocks={[getSpruceConfigMock]}>
      <FoldedCommit
        index={0}
        rolledUpCommits={rolledUpCommits}
        toggleRow={toggleRow}
        numVisibleCols={5}
        style={style}
      />
    </MockedProvider>
  );
};

describe("foldedCommit", () => {
  it("displays the number of inactive commits but not the individual commits on render", () => {
    const { queryByText } = render(Content);
    expect(queryByText("Expand 5 inactive")).toBeInTheDocument();
    expect(queryByText("Collapse 5 inactive")).toBeNull();

    for (let i = 0; i < rolledUpCommits.length; i++) {
      const commit = rolledUpCommits[i];
      expect(queryByText(commit.message)).toBeNull();
    }
  });

  it("can be expanded to show all of the commits", () => {
    const { queryByText } = render(Content);
    queryByText("Expand 5 inactive").click();
    expect(queryByText("Expand 5 inactive")).toBeNull();
    expect(queryByText("Collapse 5 inactive")).toBeInTheDocument();

    for (let i = 0; i < rolledUpCommits.length; i++) {
      const commit = rolledUpCommits[i];
      expect(queryByText(commit.message)).toBeInTheDocument();
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
