import {
  renderWithRouterMatch as render,
  fireEvent,
  waitFor,
} from "test_utils";
import { TaskStatus } from "types/task";
import { TaskCell } from "./Cell";

describe("taskCell", () => {
  it("should render a task cell corresponding to a passed in status", () => {
    const { queryByDataCy, rerender, queryByLabelText } = render(
      <TaskCell
        task={{
          id: "some-task-id",
          status: TaskStatus.Succeeded,
        }}
        loading={false}
      />
    );

    expect(queryByLabelText("Checkmark Icon")).toBeInTheDocument();
    expect(queryByDataCy("task-cell")).toBeInTheDocument();

    rerender(
      <TaskCell
        task={{
          id: "some-task-id",
          status: TaskStatus.Failed,
        }}
        loading={false}
      />
    );
    expect(queryByLabelText("Failure Icon")).toBeInTheDocument();
    expect(queryByDataCy("task-cell")).toBeInTheDocument();
  });
  it("should link to the task page", () => {
    const { queryByRole } = render(
      <TaskCell
        task={{
          id: "some-task-id",
          status: TaskStatus.Succeeded,
        }}
        loading={false}
      />
    );
    expect(queryByRole("link")).toHaveAttribute("href", "/task/some-task-id");
  });
  it("should be transparent when it is inactive", () => {
    const { queryByDataCy } = render(
      <TaskCell
        task={{
          id: "some-task-id",
          status: TaskStatus.Succeeded,
        }}
        inactive
        loading={false}
      />
    );
    expect(queryByDataCy("task-cell")).toHaveStyle("opacity: 0.4");
  });
  it("should render a label when one is passed in", () => {
    const { queryByText } = render(
      <TaskCell
        task={{
          id: "some-task-id",
          status: TaskStatus.Failed,
        }}
        label="some-label"
      />
    );
    expect(queryByText("some-label")).toBeInTheDocument();
  });
  it("should have a popup on hover with failing tests when they are supplied", async () => {
    const { queryByText, queryByDataCy } = render(
      <TaskCell
        task={{
          id: "some-task-id",
          status: TaskStatus.Failed,
        }}
        failingTests={["some-test"]}
        loading={false}
      />
    );
    fireEvent.mouseOver(queryByDataCy("history-table-icon"));
    await waitFor(() => expect(queryByText("some-test")).toBeInTheDocument());
  });
});
