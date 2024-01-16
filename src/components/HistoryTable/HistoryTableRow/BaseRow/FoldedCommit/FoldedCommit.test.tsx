import { MockedProvider } from "@apollo/client/testing";
import { getSpruceConfigMock } from "gql/mocks/getSpruceConfig";
import { renderWithRouterMatch as render, userEvent, screen } from "test_utils";
import FoldedCommit from ".";
import { foldedCommitData } from "./testData";

describe("foldedCommit", () => {
  it("displays the number of inactive commits but not the individual commits on render", () => {
    const data = {
      ...foldedCommitData,
    };
    const onToggleFoldedCommit = jest.fn(({ expanded }) => {
      data.expanded = expanded;
    });

    render(
      <MockedProvider mocks={[getSpruceConfigMock]}>
        <FoldedCommit
          index={0}
          data={foldedCommitData}
          onToggleFoldedCommit={onToggleFoldedCommit}
          numVisibleCols={5}
          selected={false}
        />
      </MockedProvider>,
    );
    expect(screen.getByText("Expand 5 inactive")).toBeInTheDocument();
    expect(screen.queryByText("Collapse 5 inactive")).toBeNull();
  });

  it("can be expanded to show all of the commits", async () => {
    const data = {
      ...foldedCommitData,
    };
    const onToggleFoldedCommit = jest.fn(({ expanded }) => {
      data.expanded = expanded;
    });

    const user = userEvent.setup();
    render(
      <MockedProvider mocks={[getSpruceConfigMock]}>
        <FoldedCommit
          index={0}
          data={data}
          onToggleFoldedCommit={onToggleFoldedCommit}
          numVisibleCols={5}
          selected={false}
        />
      </MockedProvider>,
    );
    await user.click(screen.queryByText("Expand 5 inactive"));
    expect(screen.queryByText("Expand 5 inactive")).toBeNull();
    expect(screen.getByText("Collapse 5 inactive")).toBeInTheDocument();
    expect(onToggleFoldedCommit).toHaveBeenCalledWith({
      expanded: true,
      index: 0,
      numCommits: 5,
    });

    const foldedCommits = screen.queryAllByDataCy("folded-commit");
    for (let i = 0; i < foldedCommitData.rolledUpCommits.length; i++) {
      const commit = foldedCommitData.rolledUpCommits[i];
      expect(foldedCommits[i]).toHaveTextContent(commit.message);
    }
  });
});
