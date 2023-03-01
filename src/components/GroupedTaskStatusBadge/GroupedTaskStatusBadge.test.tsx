import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import { TaskStatus } from "types/task";
import { string } from "utils";
import { GroupedTaskStatusBadge } from ".";

const { applyStrictRegex } = string;

describe("groupedTaskStatusBadgeIcon", () => {
  it("clicking on badge performs an action", () => {
    const onClick = jest.fn();
    render(
      <GroupedTaskStatusBadge
        count={400}
        status={TaskStatus.SystemFailureUmbrella}
        onClick={onClick}
        versionId={versionId}
      />
    );
    const badge = screen.queryByDataCy("grouped-task-status-badge");
    expect(badge).toBeInTheDocument();
    userEvent.click(badge);
    expect(onClick).toHaveBeenCalledWith();
  });

  it("badge should have correct copy", () => {
    render(
      <GroupedTaskStatusBadge
        count={400}
        status={TaskStatus.SystemFailureUmbrella}
        versionId={versionId}
      />
    );
    expect(screen.getByText("System Failed")).toBeInTheDocument();
    expect(screen.getByText("400")).toBeInTheDocument();
  });

  it("should link to version page with correct status filters when variant prop is not supplied", () => {
    render(
      <GroupedTaskStatusBadge
        count={400}
        status={TaskStatus.SystemFailureUmbrella}
        versionId={versionId}
      />
    );
    expect(screen.queryByDataCy("grouped-task-status-badge")).toHaveAttribute(
      "href",
      `/version/${versionId}/tasks?statuses=system-failure-umbrella,system-failed,system-timed-out,system-unresponsive`
    );
  });

  it("should link to version page with correct status and variant filters when variant prop is supplied", () => {
    render(
      <GroupedTaskStatusBadge
        count={400}
        status={TaskStatus.SystemFailureUmbrella}
        versionId={versionId}
        queryParamsToPreserve={{ variant: applyStrictRegex("some_variant") }}
      />
    );
    expect(screen.queryByDataCy("grouped-task-status-badge")).toHaveAttribute(
      "href",
      `/version/${versionId}/tasks?statuses=system-failure-umbrella,system-failed,system-timed-out,system-unresponsive&variant=%5Esome_variant%24`
    );
  });

  it("badge should show tooltip when status counts is provided", async () => {
    const statusCounts = {
      started: 30,
      failed: 15,
      unstarted: 5,
    };
    render(
      <GroupedTaskStatusBadge
        count={400}
        status={TaskStatus.SystemFailureUmbrella}
        versionId={versionId}
        statusCounts={statusCounts}
      />
    );
    await waitFor(() => {
      expect(
        screen.queryByDataCy("grouped-task-status-badge-tooltip")
      ).toBeNull();
    });
    userEvent.hover(screen.queryByDataCy("grouped-task-status-badge"));

    await waitFor(() => {
      expect(
        screen.getByDataCy("grouped-task-status-badge-tooltip")
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.queryByDataCy("grouped-task-status-badge-tooltip")
      ).toBeVisible();
    });
    expect(screen.queryByText("30")).toBeVisible();
    expect(screen.queryByText("Running")).toBeVisible();
    expect(screen.queryByText("5")).toBeVisible();
    expect(screen.queryByText("Unstarted")).toBeVisible();
    expect(screen.queryByText("15")).toBeVisible();
    expect(screen.queryByText("Failed")).toBeVisible();
  });
  const versionId = "version1";
});
