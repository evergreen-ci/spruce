import { MockedProvider } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import { getSpruceConfigMock } from "gql/mocks/getSpruceConfig";
import { renderWithRouterMatch, waitFor } from "test_utils";
import { shortenGithash } from "utils/string";
import CommitChartLabel from ".";

const RenderCommitChartLabel = (version) => () => (
  <MockedProvider mocks={[getSpruceConfigMock]}>
    <CommitChartLabel
      versionId={version.id}
      githash={shortenGithash(version.revision)}
      createTime={version.createTime}
      author={version.author}
      message={version.message}
    />
  </MockedProvider>
);

describe("commitChartLabel", () => {
  it("displays author, githash and createTime", () => {
    const { queryByDataCy } = renderWithRouterMatch(
      RenderCommitChartLabel(versionShort)
    );
    expect(queryByDataCy("commit-label")).toHaveTextContent(
      "4137c33 6/16/21 11:38 PMMohamed Khelif"
    );
  });

  it("githash links to version page", () => {
    const { queryByText } = renderWithRouterMatch(
      RenderCommitChartLabel(versionShort)
    );
    expect(queryByText("4137c33").closest("a")).toHaveAttribute(
      "href",
      "/version/123/tasks"
    );
  });

  it("jira ticket links to Jira website", async () => {
    const { queryByText } = renderWithRouterMatch(
      RenderCommitChartLabel(versionShort)
    );
    await waitFor(() => {
      expect(queryByText("SERVER-57332").closest("a")).toHaveAttribute(
        "href",
        "https://jira.mongodb.org/browse/SERVER-57332"
      );
    });
  });

  it("displays shortened commit message and the 'more' button if necessary", () => {
    const { queryByDataCy, queryByText } = renderWithRouterMatch(
      RenderCommitChartLabel(versionLong)
    );
    expect(queryByText("more")).toBeInTheDocument();
    expect(queryByDataCy("commit-label")).toHaveTextContent(
      "4137c33 6/16/21 11:38 PMMohamed Khelif -SERVER-57332 Create skeleton Internal...more"
    );
  });

  it("displays entire commit message if it does not break length limit", () => {
    const { queryByDataCy } = renderWithRouterMatch(
      RenderCommitChartLabel(versionShort)
    );
    expect(queryByDataCy("commit-label")).toHaveTextContent(
      "SERVER-57332 Create skeleton Internal"
    );
  });

  it("clicking on the 'more' button should open a tooltip containing commit message", async () => {
    const { queryByDataCy, queryByText } = renderWithRouterMatch(
      RenderCommitChartLabel(versionLong)
    );

    expect(queryByDataCy("long-commit-message-tooltip")).toBeNull();
    userEvent.click(queryByText("more"));

    await waitFor(() => {
      expect(queryByDataCy("long-commit-message-tooltip")).toBeInTheDocument();
    });
    expect(queryByDataCy("long-commit-message-tooltip")).toHaveTextContent(
      "SERVER-57332 Create skeleton InternalDocumentSourceDensify"
    );
  });
});

const versionShort = {
  id: "123",
  createTime: new Date("2021-06-16T23:38:13Z"),
  message: "SERVER-57332 Create skeleton Internal",
  order: 39365,
  author: "Mohamed Khelif",
  revision: "4137c33fa4a0d5c747a1115f0853b5f70e46f112",
};
const versionLong = {
  id: "123",
  createTime: new Date("2021-06-16T23:38:13Z"),
  message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
  order: 39365,
  author: "Mohamed Khelif",
  revision: "4137c33fa4a0d5c747a1115f0853b5f70e46f112",
};
