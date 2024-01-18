import { MockedProvider } from "@apollo/client/testing";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import { renderWithRouterMatch as render, screen, within } from "test_utils";
import { CommitQueueCard } from "./CommitQueueCard";

const titleWithPullRequestURL =
  "'evergreen-ci/spruce' commit queue merge (PR #1000) by github_pull_request: EVG-17230: Show multiple links in commit queue card title (https://github.com/evergreen-ci/spruce/pull/1000)";
const titleWithoutPullRequestURL =
  "'evergreen-ci/spruce' commit queue merge (PR #1000) by github_pull_request: EVG-17230: Show multiple links in commit queue card title";

const baseProps = {
  index: 0,
  author: "user",
  commitTime: new Date("2020-08-21T18:00:07Z"),
  patchId: "123",
  owner: "evergreen-ci",
  repo: "spruce",
  moduleCodeChanges: [],
  commitQueueId: "789",
};

describe("commit queue entry title", () => {
  describe("entries with with a version", () => {
    it("renders two links for a title that includes a GitHub link", () => {
      const { Component } = RenderFakeToastContext(
        <CommitQueueCard
          {...baseProps}
          activated
          issue=""
          title={titleWithPullRequestURL}
          versionId="456"
        />,
      );
      render(
        <MockedProvider>
          <Component />
        </MockedProvider>,
      );

      const title = screen.getByDataCy("commit-queue-card-title");
      const links = within(title).getAllByRole("link");
      expect(links).toHaveLength(2);
      expect(links[0]).toHaveTextContent(
        "'evergreen-ci/spruce' commit queue merge (PR #1000) by github_pull_request",
      );
      expect(links[0]).toHaveAttribute("href", "/version/123/tasks");
      expect(links[1]).toHaveTextContent(
        "https://github.com/evergreen-ci/spruce/pull/1000",
      );
      expect(links[1]).toHaveAttribute(
        "href",
        "https://github.com/evergreen-ci/spruce/pull/1000",
      );
    });

    it("links to the version for an item with no issue or GitHub URL", () => {
      const { Component } = RenderFakeToastContext(
        <CommitQueueCard
          {...baseProps}
          activated
          issue=""
          title={titleWithoutPullRequestURL}
          versionId="456"
        />,
      );
      render(
        <MockedProvider>
          <Component />
        </MockedProvider>,
      );

      const title = screen.getByDataCy("commit-queue-card-title");
      const links = within(title).getAllByRole("link");
      expect(links).toHaveLength(1);
      expect(links[0]).toHaveTextContent(titleWithoutPullRequestURL);
      expect(links[0]).toHaveAttribute("href", "/version/123/tasks");
    });

    it("linkifies the GitHub URL for an unactivated version", () => {
      const { Component } = RenderFakeToastContext(
        <CommitQueueCard
          {...baseProps}
          activated={false}
          issue="1000"
          title={titleWithPullRequestURL}
          versionId="456"
        />,
      );
      render(
        <MockedProvider>
          <Component />
        </MockedProvider>,
      );

      const title = screen.getByDataCy("commit-queue-card-title");
      const links = within(title).getAllByRole("link");
      expect(links).toHaveLength(1);
      expect(links[0]).toHaveTextContent(
        "https://github.com/evergreen-ci/spruce/pull/1000",
      );
      expect(links[0]).toHaveAttribute(
        "href",
        "https://github.com/evergreen-ci/spruce/pull/1000",
      );
    });
  });

  describe("entries without a version", () => {
    it("linkifies the GitHub URL", () => {
      const { Component } = RenderFakeToastContext(
        <CommitQueueCard
          {...baseProps}
          activated
          issue="1000"
          title={titleWithPullRequestURL}
          versionId={undefined}
        />,
      );
      render(
        <MockedProvider>
          <Component />
        </MockedProvider>,
      );

      const title = screen.getByDataCy("commit-queue-card-title");
      const links = within(title).getAllByRole("link");
      expect(links).toHaveLength(1);
      expect(links[0]).toHaveTextContent(
        "https://github.com/evergreen-ci/spruce/pull/1000",
      );
      expect(links[0]).toHaveAttribute(
        "href",
        "https://github.com/evergreen-ci/spruce/pull/1000",
      );
    });

    it("constructs a GitHub URL for an item with no URL in its title", () => {
      const { Component } = RenderFakeToastContext(
        <CommitQueueCard
          {...baseProps}
          activated
          issue="1000"
          title={titleWithoutPullRequestURL}
          versionId={undefined}
        />,
      );
      render(
        <MockedProvider>
          <Component />
        </MockedProvider>,
      );

      const title = screen.getByDataCy("commit-queue-card-title");
      const links = within(title).getAllByRole("link");
      expect(links).toHaveLength(1);
      expect(links[0]).toHaveTextContent(titleWithoutPullRequestURL);
      expect(links[0]).toHaveAttribute(
        "href",
        "https://github.com/evergreen-ci/spruce/pull/1000",
      );
    });
  });

  describe("entries without a patch ID", () => {
    it("links to the pull request", () => {
      const { Component } = RenderFakeToastContext(
        <CommitQueueCard
          {...baseProps}
          activated
          issue="1000"
          title={titleWithoutPullRequestURL}
          versionId={undefined}
          patchId={undefined}
        />,
      );
      render(
        <MockedProvider>
          <Component />
        </MockedProvider>,
      );

      const title = screen.getByDataCy("commit-queue-card-title");
      const links = within(title).getAllByRole("link");
      expect(links).toHaveLength(1);
      expect(links[0]).toHaveTextContent("Pull Request #1000");
      expect(links[0]).toHaveAttribute(
        "href",
        "https://github.com/evergreen-ci/spruce/pull/1000",
      );
    });
  });
});
