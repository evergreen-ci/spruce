import { MockedProvider } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import { renderWithRouterMatch as render, waitFor } from "test_utils";
import { CommitRolledUpVersions } from "types/commits";
import { InactiveCommitButton, MAX_COMMIT_COUNT } from ".";

const RenderInactiveCommitButton = (
  versions: CommitRolledUpVersions,
  hasFilters: boolean = false
) => (
  <MockedProvider>
    <InactiveCommitButton hasFilters={hasFilters} rolledUpVersions={versions} />
  </MockedProvider>
);

describe("inactiveCommitButton", () => {
  it("displays the correct count of inactive versions with the correct copy", () => {
    const { queryByDataCy, rerender } = render(() =>
      RenderInactiveCommitButton(versions)
    );
    expect(queryByDataCy("inactive-commits-button")).toHaveTextContent(
      "6Inactive"
    );
    rerender(() => RenderInactiveCommitButton(versions.slice(0, 1)));
    expect(queryByDataCy("inactive-commits-button")).toHaveTextContent(
      "1Inactive"
    );
  });

  it("clicking on the button should open a tooltip", async () => {
    const { queryByDataCy } = render(() =>
      RenderInactiveCommitButton(versions)
    );

    expect(queryByDataCy("inactive-commits-tooltip")).toBeNull();
    userEvent.click(queryByDataCy("inactive-commits-button"));
    await waitFor(() =>
      expect(queryByDataCy("inactive-commits-tooltip")).toBeVisible()
    );
  });

  it("should show all inactive commits if there are 3 or less commits", async () => {
    const { queryByDataCy, queryAllByDataCy } = render(() =>
      RenderInactiveCommitButton(versions.slice(0, MAX_COMMIT_COUNT - 1))
    );

    expect(queryByDataCy("inactive-commits-tooltip")).toBeNull();
    userEvent.click(queryByDataCy("inactive-commits-button"));
    await waitFor(() =>
      expect(queryByDataCy("inactive-commits-tooltip")).toBeVisible()
    );
    expect(queryAllByDataCy("commit-text")).toHaveLength(MAX_COMMIT_COUNT - 1);
    expect(queryByDataCy("hidden-commits")).toBeNull();
  });

  it("should collapse commits if there are more than 3", async () => {
    const { queryByDataCy, queryAllByDataCy } = render(() =>
      RenderInactiveCommitButton(versions)
    );

    expect(queryByDataCy("inactive-commits-tooltip")).toBeNull();
    userEvent.click(queryByDataCy("inactive-commits-button"));
    await waitFor(() =>
      expect(queryByDataCy("inactive-commits-tooltip")).toBeVisible()
    );
    expect(queryAllByDataCy("commit-text")).toHaveLength(MAX_COMMIT_COUNT);
    expect(queryByDataCy("hidden-commits")).toBeInTheDocument();
  });

  it("should open a modal when clicking on the hidden commits text", async () => {
    const { queryByDataCy, queryAllByDataCy } = render(() =>
      RenderInactiveCommitButton(versions)
    );

    expect(queryByDataCy("inactive-commits-tooltip")).toBeNull();
    userEvent.click(queryByDataCy("inactive-commits-button"));
    await waitFor(() =>
      expect(queryByDataCy("inactive-commits-tooltip")).toBeVisible()
    );
    expect(queryAllByDataCy("commit-text")).toHaveLength(MAX_COMMIT_COUNT);

    expect(queryByDataCy("inactive-commits-modal")).toBeNull();
    userEvent.click(queryByDataCy("hidden-commits"));
    await waitFor(() =>
      expect(queryByDataCy("inactive-commits-modal")).toBeVisible()
    );
  });

  it("should show unmatching label when there are filters applied", () => {
    const { queryByDataCy } = render(() =>
      RenderInactiveCommitButton(versions, true)
    );
    expect(queryByDataCy("inactive-commits-button")).toHaveTextContent(
      "6Unmatching"
    );
  });
});

const time = new Date("2021-06-16T23:38:13Z");
const versions = [
  {
    id: "1",
    createTime: time,
    message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
    order: 39365,
    author: "Mohamed Khelif",
    revision: "4137c33fa4a0d5c747a1115f0853b5f70e46f112",
  },
  {
    id: "2",
    createTime: time,
    message: "SERVER-57333 Some complicated server commit",
    order: 39366,
    author: "Arjun Patel",
    revision: "4237c33fa4a0d5c747a1115f0853b5f70e46f113",
  },
  {
    id: "3",
    createTime: time,
    message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
    order: 39365,
    author: "Mohamed Khelif",
    revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f114",
  },
  {
    id: "4",
    createTime: time,
    message: "SERVER-57333 Some complicated server commit",
    order: 39366,
    author: "Arjun Patel",
    revision: "4437c33fa4a0d5c747a1115f0853b5f70e46f115",
  },
  {
    id: "5",
    createTime: time,
    message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
    order: 39365,
    author: "Elena Chen",
    revision: "4537c33fa4a0d5c747a1115f0853b5f70e46f116",
  },
  {
    id: "6",
    createTime: time,
    message: "SERVER-57333 Some complicated server commit",
    order: 39366,
    author: "Sophie Stadler",
    revision: "4637c33fa4a0d5c747a1115f0853b5f70e46f117",
  },
];
