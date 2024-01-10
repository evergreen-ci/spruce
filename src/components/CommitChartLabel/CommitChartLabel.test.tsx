import { MockedProvider } from "@apollo/client/testing";
import { getSpruceConfigMock } from "gql/mocks/getSpruceConfig";
import { renderWithRouterMatch, screen, userEvent, waitFor } from "test_utils";
import { shortenGithash } from "utils/string";
import CommitChartLabel from ".";

const RenderCommitChartLabel = ({ version }) => (
  <MockedProvider mocks={[getSpruceConfigMock]}>
    <CommitChartLabel
      versionId={version.id}
      githash={shortenGithash(version.revision)}
      createTime={version.createTime}
      author={version.author}
      message={version.message}
      gitTags={[
        { tag: "v1.2.3", pusher: "release-bot" },
        { tag: "v1.2.3-rc0", pusher: "release-bot" },
      ]}
    />
  </MockedProvider>
);

describe("commitChartLabel", () => {
  it("displays author, githash and createTime", () => {
    renderWithRouterMatch(<RenderCommitChartLabel version={versionShort} />);
    expect(screen.queryByDataCy("commit-label")).toHaveTextContent(
      "4137c33 Jun 16, 2021, 11:38 PM Mohamed Khelif -SERVER-57332 Create skeleton Internal" +
        "Git Tags: v1.2.3, v1.2.3-rc0",
    );
  });

  it("githash links to version page", () => {
    renderWithRouterMatch(<RenderCommitChartLabel version={versionShort} />);
    expect(screen.queryByDataCy("githash-link")).toHaveAttribute(
      "href",
      "/version/123/tasks",
    );
  });

  it("jira ticket links to Jira website", async () => {
    renderWithRouterMatch(<RenderCommitChartLabel version={versionShort} />);
    await waitFor(() => {
      expect(screen.queryByDataCy("jira-link")).toHaveAttribute(
        "href",
        "https://jira.mongodb.org/browse/SERVER-57332",
      );
    });
  });

  it("displays shortened commit message and the 'more' button if necessary", () => {
    renderWithRouterMatch(<RenderCommitChartLabel version={versionLong} />);
    expect(screen.getByText("more")).toBeInTheDocument();
    expect(screen.queryByDataCy("commit-label")).toHaveTextContent(
      "4137c33 Jun 16, 2021, 11:38 PM Mohamed Khelif -SERVER-57332 Create skeleton Internal...more" +
        "Git Tags: v1.2.3, v1.2.3-rc0",
    );
  });

  it("displays entire commit message if it does not break length limit", () => {
    renderWithRouterMatch(<RenderCommitChartLabel version={versionShort} />);
    expect(screen.queryByDataCy("commit-label")).toHaveTextContent(
      "SERVER-57332 Create skeleton Internal",
    );
  });

  it("clicking on the 'more' button should open a tooltip containing commit message", async () => {
    const user = userEvent.setup();
    renderWithRouterMatch(<RenderCommitChartLabel version={versionLong} />);

    expect(screen.queryByDataCy("long-commit-message-tooltip")).toBeNull();
    await user.click(screen.queryByText("more"));
    await waitFor(() => {
      expect(
        screen.getByDataCy("long-commit-message-tooltip"),
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByDataCy("long-commit-message-tooltip"),
    ).toHaveTextContent(
      "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
    );
  });

  it("displays git tags", () => {
    renderWithRouterMatch(<RenderCommitChartLabel version={versionShort} />);
    expect(screen.getByText(/v1.2.3/)).toBeInTheDocument();
    expect(screen.getByText(/v1.2.3-rc0/)).toBeInTheDocument();
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
