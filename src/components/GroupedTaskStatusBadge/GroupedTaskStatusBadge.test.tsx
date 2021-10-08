import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { render, fireEvent, waitFor } from "test_utils/test-utils";
import { TaskStatus } from "types/task";
import { GroupedTaskStatusBadge } from ".";

describe("GroupedTaskStatusBadgeIcon", () => {
  test("Clicking on badge performs an action", () => {
    const onClick = jest.fn();
    const { queryByDataCy } = render(
      <MemoryRouter>
        <GroupedTaskStatusBadge
          count={400}
          status={TaskStatus.SystemFailureUmbrella}
          onClick={onClick}
          href="thing"
        />
      </MemoryRouter>
    );
    const badge = queryByDataCy("grouped-task-status-badge");
    expect(badge).toBeInTheDocument();
    fireEvent.click(badge);
    expect(onClick).toHaveBeenCalled();
  });

  test("Badge should have correct copy", () => {
    const { queryByText } = render(
      <MemoryRouter>
        <GroupedTaskStatusBadge
          count={400}
          status={TaskStatus.SystemFailureUmbrella}
          href="thing"
        />
      </MemoryRouter>
    );
    expect(queryByText("System Failures")).toBeInTheDocument();
    expect(queryByText("400")).toBeInTheDocument();
  });

  test("Badge should have correct href", () => {
    const { queryByDataCy } = render(
      <MemoryRouter>
        <GroupedTaskStatusBadge
          count={400}
          status={TaskStatus.SystemFailureUmbrella}
          href="thing"
        />
      </MemoryRouter>
    );
    expect(queryByDataCy("grouped-task-status-badge")).toHaveAttribute(
      "href",
      "/thing"
    );
  });

  test("Badge should show tooltip when status counts is provided", async () => {
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
          href="thing"
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
});
