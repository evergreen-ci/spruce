import userEvent from "@testing-library/user-event";
import { render, act } from "test_utils/test-utils";

import { InactiveCommits } from ".";

const RenderInactiveCommits = (versions) => (
  <InactiveCommits rolledUpVersions={versions} />
);

afterEach(() => {
  jest.clearAllTimers();
  jest.clearAllMocks();
});
describe("inactiveCommits", () => {
  it("displays the correct count of inactive versions with the correct copy", () => {
    const { queryByDataCy, rerender } = render(
      <InactiveCommits rolledUpVersions={versions} />
    );
    expect(queryByDataCy("inactive-commits-button")).toHaveTextContent(
      "6 inactive"
    );
    rerender(RenderInactiveCommits(versions.slice(0, 1)));
    expect(queryByDataCy("inactive-commits-button")).toHaveTextContent(
      "1 inactive"
    );
  });

  it("clicking on the button should open a tooltip", async () => {
    const { queryByDataCy } = render(
      <InactiveCommits rolledUpVersions={versions} />
    );
    jest.useFakeTimers();

    expect(queryByDataCy("inactive-commits-tooltip")).toBeNull();
    userEvent.click(queryByDataCy("inactive-commits-button"));
    //   Need to use fake timers to get around @leafygreen-ui/tooltip debounce
    act(() => {
      jest.runAllTimers();
    });
    expect(queryByDataCy("inactive-commits-tooltip")).toBeInTheDocument();
  });

  it("should show all inactive commits if there are 5 or less commits", async () => {
    const { queryByDataCy, queryAllByDataCy } = render(
      <InactiveCommits rolledUpVersions={versions.slice(0, 4)} />
    );
    jest.useFakeTimers();

    expect(queryByDataCy("inactive-commits-tooltip")).toBeNull();
    userEvent.click(queryByDataCy("inactive-commits-button"));
    //   Need to use fake timers to get around @leafygreen-ui/tooltip debounce
    act(() => {
      jest.runAllTimers();
    });
    expect(queryByDataCy("inactive-commits-tooltip")).toBeInTheDocument();
    expect(queryAllByDataCy("commit-text")).toHaveLength(4);
    expect(queryByDataCy("hidden-commits")).toBeNull();
  });
  it("should collapse some commits if there are more then 5", async () => {
    const { queryByDataCy, queryAllByDataCy } = render(
      <InactiveCommits rolledUpVersions={versions} />
    );
    jest.useFakeTimers();

    expect(queryByDataCy("inactive-commits-tooltip")).toBeNull();
    userEvent.click(queryByDataCy("inactive-commits-button"));
    //   Need to use fake timers to get around @leafygreen-ui/tooltip debounce
    act(() => {
      jest.runAllTimers();
    });
    expect(queryByDataCy("inactive-commits-tooltip")).toBeInTheDocument();
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
