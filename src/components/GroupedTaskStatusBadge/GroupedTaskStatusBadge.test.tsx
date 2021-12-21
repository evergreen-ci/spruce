import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { render, fireEvent, waitFor } from "test_utils";
import { TaskStatus } from "types/task";
import { GroupedTaskStatusBadge } from ".";

describe("groupedTaskStatusBadgeIcon", () => {
  it("clicking on badge performs an action", () => {
    const onClick = jest.fn();
    const { queryByDataCy } = render(
      <MemoryRouter>
        <GroupedTaskStatusBadge
          count={400}
          status={TaskStatus.SystemFailureUmbrella}
          onClick={onClick}
          versionId={versionId}
        />
      </MemoryRouter>
    );
    const badge = queryByDataCy("grouped-task-status-badge");
    expect(badge).toBeInTheDocument();
    fireEvent.click(badge);
    expect(onClick).toHaveBeenCalledWith();
  });

  it("badge should have correct copy", () => {
    const { queryByText } = render(
      <MemoryRouter>
        <GroupedTaskStatusBadge
          count={400}
          status={TaskStatus.SystemFailureUmbrella}
          versionId={versionId}
        />
      </MemoryRouter>
    );
    expect(queryByText("System Failed")).toBeInTheDocument();
    expect(queryByText("400")).toBeInTheDocument();
  });

  it("should link to version page with correct status filters when variant prop is not supplied", () => {
    const { queryByDataCy } = render(
      <MemoryRouter>
        <GroupedTaskStatusBadge
          count={400}
          status={TaskStatus.SystemFailureUmbrella}
          versionId={versionId}
        />
      </MemoryRouter>
    );
    expect(queryByDataCy("grouped-task-status-badge")).toHaveAttribute(
      "href",
      `/version/${versionId}/tasks?statuses=system-failure-umbrella,system-failed,system-timed-out,system-unresponsive`
    );
  });

  it("should link to version page with correct status and variant filters when variant prop is supplied", () => {
    const { queryByDataCy } = render(
      <MemoryRouter>
        <GroupedTaskStatusBadge
          count={400}
          status={TaskStatus.SystemFailureUmbrella}
          versionId={versionId}
          variant="some_variant"
        />
      </MemoryRouter>
    );
    expect(queryByDataCy("grouped-task-status-badge")).toHaveAttribute(
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
    const { queryByDataCy, queryByText } = render(
      <MemoryRouter>
        <GroupedTaskStatusBadge
          count={400}
          status={TaskStatus.SystemFailureUmbrella}
          versionId={versionId}
          statusCounts={statusCounts}
        />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(queryByDataCy("grouped-task-status-badge-tooltip")).toBeNull();
    });
    userEvent.hover(queryByDataCy("grouped-task-status-badge"));

    await waitFor(() => {
      expect(
        queryByDataCy("grouped-task-status-badge-tooltip")
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(queryByDataCy("grouped-task-status-badge-tooltip")).toBeVisible();
    });
    await waitFor(() => {
      expect(queryByText("30")).toBeVisible();
      expect(queryByText("Running")).toBeVisible();
      expect(queryByText("5")).toBeVisible();
      expect(queryByText("Unstarted")).toBeVisible();
      expect(queryByText("15")).toBeVisible();
      expect(queryByText("Failed")).toBeVisible();
    });
  });
  const versionId = "version1";
});
