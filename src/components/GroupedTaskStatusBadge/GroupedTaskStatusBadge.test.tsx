import { getVersionRoute } from "constants/routes";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import { TaskStatus } from "types/task";
import { GroupedTaskStatusBadge } from ".";

describe("groupedTaskStatusBadgeIcon", () => {
  const versionId = "version1";

  it("clicking on badge performs an action", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <GroupedTaskStatusBadge
        count={400}
        status={TaskStatus.SystemFailureUmbrella}
        onClick={onClick}
        href={`/version/${versionId}`}
      />,
      {
        path: "/version/:versionId/:tab",
        route: `/version/${versionId}/tasks`,
      },
    );
    const badge = screen.queryByDataCy("grouped-task-status-badge");
    expect(badge).toBeInTheDocument();
    await user.click(badge);
    expect(onClick).toHaveBeenCalledWith();
  });

  it("badge should have correct copy", () => {
    render(
      <GroupedTaskStatusBadge
        count={400}
        status={TaskStatus.SystemFailureUmbrella}
        href={`/version/${versionId}`}
      />,
    );
    expect(screen.getByText("System Failed")).toBeInTheDocument();
    expect(screen.getByText("400")).toBeInTheDocument();
  });

  it("should link to the passed in page", () => {
    render(
      <GroupedTaskStatusBadge
        count={400}
        status={TaskStatus.SystemFailureUmbrella}
        href={getVersionRoute(versionId, {
          statuses: [TaskStatus.SystemFailed],
        })}
      />,
    );
    expect(screen.queryByDataCy("grouped-task-status-badge")).toHaveAttribute(
      "href",
      `/version/${versionId}/tasks?statuses=system-failed`,
    );
  });

  it("badge should show tooltip when status counts is provided", async () => {
    const user = userEvent.setup();
    const statusCounts = {
      started: 30,
      failed: 15,
      unstarted: 5,
    };
    render(
      <GroupedTaskStatusBadge
        count={400}
        status={TaskStatus.SystemFailureUmbrella}
        href={`/version/${versionId}`}
        statusCounts={statusCounts}
      />,
    );
    await waitFor(() => {
      expect(
        screen.queryByDataCy("grouped-task-status-badge-tooltip"),
      ).toBeNull();
    });
    await user.hover(screen.queryByDataCy("grouped-task-status-badge"));
    await waitFor(() => {
      expect(
        screen.getByDataCy("grouped-task-status-badge-tooltip"),
      ).toBeVisible();
    });
    expect(screen.queryByText("30")).toBeVisible();
    expect(screen.queryByText("Running")).toBeVisible();
    expect(screen.queryByText("5")).toBeVisible();
    expect(screen.queryByText("Unstarted")).toBeVisible();
    expect(screen.queryByText("15")).toBeVisible();
    expect(screen.queryByText("Failed")).toBeVisible();
  });
});
