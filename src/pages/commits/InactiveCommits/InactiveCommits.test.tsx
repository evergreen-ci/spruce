import { MockedProvider } from "@apollo/client/testing";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import { CommitRolledUpVersions } from "types/commits";
import { InactiveCommitButton, MAX_COMMIT_COUNT } from ".";

const RenderInactiveCommitButton = ({
  hasFilters,
  versions,
}: {
  versions: CommitRolledUpVersions;
  hasFilters?: boolean;
}) => (
  <MockedProvider>
    <InactiveCommitButton hasFilters={hasFilters} rolledUpVersions={versions} />
  </MockedProvider>
);

describe("inactiveCommitButton", () => {
  it("displays the correct count of inactive versions with the correct copy", () => {
    const { rerender } = render(
      <RenderInactiveCommitButton versions={versions} />,
    );
    expect(screen.queryByDataCy("inactive-commits-button")).toHaveTextContent(
      "6Inactive",
    );
    rerender(<RenderInactiveCommitButton versions={versions.slice(0, 1)} />);
    expect(screen.queryByDataCy("inactive-commits-button")).toHaveTextContent(
      "1Inactive",
    );
  });

  it("clicking on the button should open a tooltip", async () => {
    const user = userEvent.setup();
    render(<RenderInactiveCommitButton versions={versions} />);

    expect(screen.queryByDataCy("inactive-commits-tooltip")).toBeNull();
    await user.click(screen.queryByDataCy("inactive-commits-button"));
    await waitFor(() => {
      expect(screen.queryByDataCy("inactive-commits-tooltip")).toBeVisible();
    });
  });

  it("should show all inactive commits if there are 3 or less commits", async () => {
    const user = userEvent.setup();
    render(
      <RenderInactiveCommitButton
        versions={versions.slice(0, MAX_COMMIT_COUNT - 1)}
      />,
    );

    expect(screen.queryByDataCy("inactive-commits-tooltip")).toBeNull();
    await user.click(screen.queryByDataCy("inactive-commits-button"));
    await waitFor(() => {
      expect(screen.queryByDataCy("inactive-commits-tooltip")).toBeVisible();
    });
    expect(screen.queryAllByDataCy("commit-text")).toHaveLength(
      MAX_COMMIT_COUNT - 1,
    );
    expect(screen.queryByDataCy("hidden-commits")).toBeNull();
  });

  it("should collapse commits if there are more than 3", async () => {
    const user = userEvent.setup();
    render(<RenderInactiveCommitButton versions={versions} />);

    expect(screen.queryByDataCy("inactive-commits-tooltip")).toBeNull();
    await user.click(screen.queryByDataCy("inactive-commits-button"));
    await waitFor(() => {
      expect(screen.queryByDataCy("inactive-commits-tooltip")).toBeVisible();
    });
    expect(screen.queryAllByDataCy("commit-text")).toHaveLength(
      MAX_COMMIT_COUNT,
    );
    expect(screen.getByDataCy("hidden-commits")).toBeInTheDocument();
  });

  it("should open a modal when clicking on the hidden commits text", async () => {
    const user = userEvent.setup();
    render(<RenderInactiveCommitButton versions={versions} />);

    expect(screen.queryByDataCy("inactive-commits-tooltip")).toBeNull();
    await user.click(screen.queryByDataCy("inactive-commits-button"));
    await waitFor(() => {
      expect(screen.queryByDataCy("inactive-commits-tooltip")).toBeVisible();
    });
    expect(screen.queryAllByDataCy("commit-text")).toHaveLength(
      MAX_COMMIT_COUNT,
    );
    expect(screen.queryByDataCy("inactive-commits-modal")).toBeNull();
    await user.click(screen.queryByDataCy("hidden-commits"));
    await waitFor(() => {
      expect(screen.queryByDataCy("inactive-commits-modal")).toBeVisible();
    });
  });

  it("should show unmatching label when there are filters applied", () => {
    render(<RenderInactiveCommitButton versions={versions} hasFilters />);
    expect(screen.queryByDataCy("inactive-commits-button")).toHaveTextContent(
      "6Unmatching",
    );
  });

  it("should show ignored icon for ignored versions", async () => {
    const user = userEvent.setup();
    render(<RenderInactiveCommitButton versions={versions.slice(0, 1)} />);
    expect(screen.queryByDataCy("inactive-commits-tooltip")).toBeNull();
    await user.click(screen.queryByDataCy("inactive-commits-button"));
    await waitFor(() => {
      expect(screen.queryByDataCy("inactive-commits-tooltip")).toBeVisible();
    });
    expect(screen.getByDataCy("ignored-icon")).toBeVisible();
  });
});

const time = new Date("2021-06-16T23:38:13Z");
const versions: CommitRolledUpVersions = [
  {
    id: "1",
    createTime: time,
    message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
    order: 39365,
    author: "Mohamed Khelif",
    revision: "4137c33fa4a0d5c747a1115f0853b5f70e46f112",
    ignored: true,
  },
  {
    id: "2",
    createTime: time,
    message: "SERVER-57333 Some complicated server commit",
    order: 39366,
    author: "Arjun Patel",
    revision: "4237c33fa4a0d5c747a1115f0853b5f70e46f113",
    ignored: false,
  },
  {
    id: "3",
    createTime: time,
    message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
    order: 39365,
    author: "Mohamed Khelif",
    revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f114",
    ignored: false,
  },
  {
    id: "4",
    createTime: time,
    message: "SERVER-57333 Some complicated server commit",
    order: 39366,
    author: "Arjun Patel",
    revision: "4437c33fa4a0d5c747a1115f0853b5f70e46f115",
    ignored: false,
  },
  {
    id: "5",
    createTime: time,
    message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
    order: 39365,
    author: "Elena Chen",
    revision: "4537c33fa4a0d5c747a1115f0853b5f70e46f116",
    ignored: false,
  },
  {
    id: "6",
    createTime: time,
    message: "SERVER-57333 Some complicated server commit",
    order: 39366,
    author: "Sophie Stadler",
    revision: "4637c33fa4a0d5c747a1115f0853b5f70e46f117",
    ignored: false,
  },
];
