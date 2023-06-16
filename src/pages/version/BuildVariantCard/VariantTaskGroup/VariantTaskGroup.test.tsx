import { MockedProvider } from "@apollo/client/testing";
import { getVersionRoute } from "constants/routes";
import { renderWithRouterMatch as render, screen } from "test_utils";
import { TaskStatus } from "types/task";
import { applyStrictRegex } from "utils/string";
import VariantTaskGroup from ".";

const Wrapper = ({ children }) => <MockedProvider>{children}</MockedProvider>;
const Component = () => (
  <VariantTaskGroup
    variant="some_variant"
    versionId="1"
    displayName="Some Variant"
    statusCounts={[
      { count: 1, status: TaskStatus.Succeeded },
      { count: 2, status: TaskStatus.Failed },
    ]}
  />
);
describe("variantTaskGroup", () => {
  it("should render variants with their grouped status cards", () => {
    render(<Component />, {
      wrapper: Wrapper,
      route: "/version/1",
      path: "/version/:id",
    });
    expect(screen.getByText("Some Variant")).toBeDefined();
    expect(screen.queryAllByDataCy("grouped-task-status-badge")).toHaveLength(
      2
    );
  });
  it("all status badges should be active if no status/variant filters are set", () => {
    render(<Component />, {
      wrapper: Wrapper,
      route: "/version/1",
      path: "/version/:id",
    });
    expect(screen.getByText("Some Variant")).toBeDefined();
    expect(screen.queryAllByDataCy("grouped-task-status-badge")).toHaveLength(
      2
    );
    screen.queryAllByDataCy("grouped-task-status-badge").forEach((badge) => {
      expect(badge).toHaveAttribute("aria-selected", "true");
    });
  });
  it("status badges should be active if both the status and variant exist in the url", () => {
    render(<Component />, {
      wrapper: Wrapper,
      route: `/version/1?statuses=${
        TaskStatus.Succeeded
      }&variant=${applyStrictRegex("some_variant")}`,
      path: "/version/:id",
    });

    const successBadge = screen.queryAllByDataCy(
      "grouped-task-status-badge"
    )[0];
    expect(successBadge).toHaveTextContent("Succeeded");
    const failedBadge = screen.queryAllByDataCy("grouped-task-status-badge")[1];
    expect(failedBadge).toHaveTextContent("Failed");

    expect(successBadge).toHaveAttribute("aria-selected", "true");
    expect(failedBadge).toHaveAttribute("aria-selected", "false");
  });
  it("inactive status badges should apply a status and variant filter", () => {
    render(<Component />, {
      wrapper: Wrapper,
      route: `/version/1`,
      path: "/version/:id",
    });

    const successBadge = screen.queryAllByDataCy(
      "grouped-task-status-badge"
    )[0];
    expect(successBadge).toHaveAttribute(
      "href",
      getVersionRoute("1", {
        page: 0,
        variant: applyStrictRegex("some_variant"),
        statuses: [TaskStatus.Succeeded],
      })
    );
  });
  it("active status badges should remove the status and variant filter", () => {
    render(<Component />, {
      wrapper: Wrapper,
      route: `/version/1?statuses=${
        TaskStatus.Succeeded
      }&variant=${applyStrictRegex("some_variant")}`,
      path: "/version/:id",
    });

    const successBadge = screen.queryAllByDataCy(
      "grouped-task-status-badge"
    )[0];
    expect(successBadge).toHaveAttribute(
      "href",
      getVersionRoute("1", {
        page: 0,
      })
    );
  });
  it("if a variant filter is set and no status filter is set, all of the status badges should be active", () => {
    render(<Component />, {
      wrapper: Wrapper,
      route: `/version/1?variant=${applyStrictRegex("some_variant")}`,
      path: "/version/:id",
    });

    screen.queryAllByDataCy("grouped-task-status-badge").forEach((badge) => {
      expect(badge).toHaveAttribute("aria-selected", "true");
    });
  });
});
