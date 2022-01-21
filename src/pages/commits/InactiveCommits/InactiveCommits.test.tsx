import userEvent from "@testing-library/user-event";
import { render, waitFor } from "test_utils";

import { InactiveCommitButton } from ".";

const RenderInactiveCommitButton = (versions) => (
  <InactiveCommitButton rolledUpVersions={versions} />
);

describe("inactiveCommitButton", () => {
  it("displays the correct count of inactive versions with the correct copy", () => {
    const { queryByDataCy, rerender } = render(
      <InactiveCommitButton rolledUpVersions={versions} />
    );
    expect(queryByDataCy("inactive-commits-button")).toHaveTextContent(
      "6Inactive"
    );
    rerender(RenderInactiveCommitButton(versions.slice(0, 1)));
    expect(queryByDataCy("inactive-commits-button")).toHaveTextContent(
      "1Inactive"
    );
  });

  it("clicking on the button should open a tooltip", async () => {
    const { queryByDataCy } = render(
      <InactiveCommitButton rolledUpVersions={versions} />
    );

    expect(queryByDataCy("inactive-commits-tooltip")).toBeNull();
    userEvent.click(queryByDataCy("inactive-commits-button"));
    await waitFor(() =>
      expect(queryByDataCy("inactive-commits-tooltip")).toBeVisible()
    );
  });

  it("should show all inactive commits if there are 5 or less commits", async () => {
    const { queryByDataCy, queryAllByDataCy } = render(
      <InactiveCommitButton rolledUpVersions={versions.slice(0, 4)} />
    );

    expect(queryByDataCy("inactive-commits-tooltip")).toBeNull();
    userEvent.click(queryByDataCy("inactive-commits-button"));
    await waitFor(() =>
      expect(queryByDataCy("inactive-commits-tooltip")).toBeVisible()
    );
    expect(queryAllByDataCy("commit-text")).toHaveLength(4);
    expect(queryByDataCy("hidden-commits")).toBeNull();
  });
  it("should collapse some commits if there are more then 5", async () => {
    const { queryByDataCy, queryAllByDataCy } = render(
      <InactiveCommitButton rolledUpVersions={versions} />
    );

    expect(queryByDataCy("inactive-commits-tooltip")).toBeNull();
    userEvent.click(queryByDataCy("inactive-commits-button"));
    await waitFor(() =>
      expect(queryByDataCy("inactive-commits-tooltip")).toBeVisible()
    );
    expect(queryAllByDataCy("commit-text")).toHaveLength(5);
    expect(queryByDataCy("hidden-commits")).toBeInTheDocument();
  });
});

const time = new Date("2021-06-16T23:38:13Z");
const versions = [
  {
    id: "123",
    createTime: time,
    message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
    order: 39365,
    author: "Mohamed Khelif",
    revision: "4137c33fa4a0d5c747a1115f0853b5f70e46f112",
  },
  {
    id: "123",
    createTime: time,
    message: "SERVER-57333 Some complicated server commit",
    order: 39366,
    author: "Arjun Patel",
    revision: "4237c33fa4a0d5c747a1115f0853b5f70e46f113",
  },
  {
    id: "123",
    createTime: time,
    message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
    order: 39365,
    author: "Mohamed Khelif",
    revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f114",
  },
  {
    id: "123",
    createTime: time,
    message: "SERVER-57333 Some complicated server commit",
    order: 39366,
    author: "Arjun Patel",
    revision: "4437c33fa4a0d5c747a1115f0853b5f70e46f115",
  },
  {
    id: "123",
    createTime: time,
    message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
    order: 39365,
    author: "Elena Chen",
    revision: "4537c33fa4a0d5c747a1115f0853b5f70e46f116",
  },
  {
    id: "123",
    createTime: time,
    message: "SERVER-57333 Some complicated server commit",
    order: 39366,
    author: "Sophie Stadler",
    revision: "4637c33fa4a0d5c747a1115f0853b5f70e46f117",
  },
];
