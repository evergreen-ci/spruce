import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
import { TaskStatus } from "types/task";
import { TaskCell } from ".";

describe("taskCell", () => {
  it("should render a task cell corresponding to a passed in status", () => {
    const { rerender } = render(
      <TaskCell
        task={{
          id: "some-task-id",
          status: TaskStatus.Succeeded,
        }}
        loading={false}
      />,
    );

    expect(screen.getByLabelText("Checkmark Icon")).toBeInTheDocument();
    expect(screen.getByDataCy("task-cell")).toBeInTheDocument();

    rerender(
      <TaskCell
        task={{
          id: "some-task-id",
          status: TaskStatus.Failed,
        }}
        loading={false}
      />,
    );
    expect(screen.getByLabelText("Failure Icon")).toBeInTheDocument();
    expect(screen.getByDataCy("task-cell")).toBeInTheDocument();
  });

  it("should link to the task page", () => {
    render(
      <TaskCell
        task={{
          id: "some-task-id",
          status: TaskStatus.Succeeded,
        }}
        loading={false}
      />,
    );
    expect(screen.queryByRole("link")).toHaveAttribute(
      "href",
      "/task/some-task-id",
    );
  });

  it("should be transparent when it is inactive", () => {
    render(
      <TaskCell
        task={{
          id: "some-task-id",
          status: TaskStatus.Succeeded,
        }}
        inactive
        loading={false}
      />,
    );
    expect(screen.queryByDataCy("task-cell")).toHaveStyle("opacity: 0.4");
  });

  it("should render a label when one is passed in", () => {
    render(
      <TaskCell
        task={{
          id: "some-task-id",
          status: TaskStatus.Failed,
        }}
        label="some-label"
      />,
    );
    expect(screen.getByText("some-label")).toBeInTheDocument();
  });

  it("should have a tooltip on hover with failing tests when they are supplied", async () => {
    const user = userEvent.setup();
    render(
      <TaskCell
        task={{
          id: "some-task-id",
          status: TaskStatus.Failed,
        }}
        failingTests={["some-test"]}
        loading={false}
      />,
    );
    await user.hover(screen.queryByDataCy("history-table-icon"));
    await screen.findByText("some-test");
    expect(screen.getByDataCy("test-tooltip")).toBeInTheDocument();
    expect(screen.getByText("some-test")).toBeInTheDocument();
  });
});
