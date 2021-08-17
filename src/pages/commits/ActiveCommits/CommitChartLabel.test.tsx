import userEvent from "@testing-library/user-event";
import { render, act } from "test_utils/test-utils";
import { CommitChartLabel } from "./CommitChartLabel";

const RenderCommitChartLabel = (version) => (
  <CommitChartLabel
    githash={version.revision.substring(0, 5)}
    createTime={version.createTime}
    author={version.author}
    message={version.message}
  />
);

afterEach(() => {
  jest.clearAllTimers();
  jest.clearAllMocks();
});
describe("CommitChartLabel", () => {
  test("Displays author, githash and createTime", () => {
    const { queryByDataCy } = render(RenderCommitChartLabel(versionShort));
    expect(queryByDataCy("commit-label")).toHaveTextContent(
      "4137c 6/16/21 11:38 PMMohamed Khelif"
    );
  });

  test("Displays shortened commit message and the 'more' button if necessary", () => {
    const { queryByDataCy } = render(RenderCommitChartLabel(versionLong));
    expect(queryByDataCy("tooltip-button")).toBeInTheDocument();
    expect(queryByDataCy("commit-label")).toHaveTextContent(
      "4137c 6/16/21 11:38 PMMohamed Khelif -SERVER-57332 Create skeleton Internal...more"
    );
  });

  test("Displays entire commit message if it does not break length limit", () => {
    const { queryByDataCy } = render(RenderCommitChartLabel(versionShort));
    expect(queryByDataCy("commit-label")).toHaveTextContent(
      "SERVER-57332 Create skeleton Internal"
    );
  });

  test("Clicking on the 'more' button should open a tooltip containing commit message", () => {
    const { queryByDataCy } = render(RenderCommitChartLabel(versionLong));
    jest.useFakeTimers();

    expect(queryByDataCy("long-commit-message-tooltip")).toBeNull();
    userEvent.click(queryByDataCy("tooltip-button"));
    //   Need to use fake timers to get around @leafygreen-ui/tooltip debounce
    act(() => {
      jest.runAllTimers();
    });
    expect(queryByDataCy("long-commit-message-tooltip")).toBeInTheDocument();
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
