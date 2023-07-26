import FilterBadges from "components/FilterBadges";
import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
import { ProjectFilterOptions } from "types/commits";
import useFilterBadgeQueryParams from "./useFilterBadgeQueryParams";

const Content = () => {
  const { badges, handleClearAll, handleOnRemove } = useFilterBadgeQueryParams(
    new Set([
      ProjectFilterOptions.BuildVariant,
      ProjectFilterOptions.Test,
      ProjectFilterOptions.Task,
    ])
  );
  return (
    <FilterBadges
      badges={badges}
      onRemove={handleOnRemove}
      onClearAll={handleClearAll}
    />
  );
};
describe("filterBadges - queryParams", () => {
  it("should not render any badges if there are no query params", () => {
    render(<Content />, {
      path: "/commits/:projectId",
      route: "/commits/evergreen",
    });
    expect(screen.queryByDataCy("filter-badge")).not.toBeInTheDocument();
  });

  it("should render a singular filter badge if there is only one query param", () => {
    render(<Content />, {
      path: "/commits/:projectId",
      route: "/commits/evergreen?buildVariants=variant1",
    });
    expect(screen.queryAllByDataCy("filter-badge")).toHaveLength(1);
  });

  it("should render multiple filter badges with the same key but different values", () => {
    render(<Content />, {
      path: "/commits/:projectId",
      route: "/commits/evergreen?buildVariants=variant1,variant2",
    });
    const badges = screen.queryAllByDataCy("filter-badge");
    expect(badges).toHaveLength(2);
    expect(badges[0]).toHaveTextContent("buildVariants: variant1");
    expect(badges[1]).toHaveTextContent("buildVariants: variant2");
  });

  it("should render multiple filter badges with the different keys and different values", () => {
    render(<Content />, {
      path: "/commits/:projectId",
      route: "/commits/evergreen?buildVariants=variant1&tests=test1",
    });
    const badges = screen.queryAllByDataCy("filter-badge");
    expect(badges).toHaveLength(2);
    expect(badges[0]).toHaveTextContent("buildVariants: variant1");
    expect(badges[1]).toHaveTextContent("tests: test1");
  });

  it("closing out a badge should remove it from the url", () => {
    const { router } = render(<Content />, {
      path: "/commits/:projectId",
      route: "/commits/evergreen?buildVariants=variant1",
    });

    const badge = screen.queryByDataCy("filter-badge");
    expect(badge).toHaveTextContent("buildVariants: variant1");
    const closeBadge = screen.queryByDataCy("close-badge");
    expect(closeBadge).toBeInTheDocument();
    userEvent.click(closeBadge);

    expect(screen.queryByDataCy("filter-badge")).toBeNull();
    expect(router.state.location.search).toBe("");
  });

  it("should only remove one badge from the url if it is closed and more remain", () => {
    const { router } = render(<Content />, {
      path: "/commits/:projectId",
      route: "/commits/evergreen?buildVariants=variant1,variant2",
    });

    let badges = screen.queryAllByDataCy("filter-badge");
    expect(badges).toHaveLength(2);
    expect(screen.getByText("buildVariants: variant1")).toBeInTheDocument();
    const closeBadge = screen.queryAllByDataCy("close-badge");
    userEvent.click(closeBadge[0]);
    badges = screen.queryAllByDataCy("filter-badge");
    expect(badges).toHaveLength(1);
    expect(screen.queryByText("buildVariants: variant1")).toBeNull();

    expect(screen.queryAllByDataCy("filter-badge")).toHaveLength(1);
    expect(router.state.location.search).toBe("?buildVariants=variant2");
  });

  it("should remove all badges when clicking on clear all button", () => {
    const { router } = render(<Content />, {
      path: "/commits/:projectId",
      route:
        "/commits/evergreen?buildVariants=variant1,variant2&tests=test1,test2",
    });

    let badges = screen.queryAllByDataCy("filter-badge");
    expect(badges).toHaveLength(4);

    userEvent.click(screen.queryByDataCy("clear-all-filters"));
    badges = screen.queryAllByDataCy("filter-badge");
    expect(badges).toHaveLength(0);

    expect(router.state.location.search).toBe("");
  });

  it("should only remove query params for displayable badges when clear all is pressed", () => {
    const { router } = render(<Content />, {
      path: "/commits/:projectId",
      route:
        "/commits/evergreen?buildVariants=variant1,variant2&tests=test1,test2&notRelated=notRelated",
    });

    let badges = screen.queryAllByDataCy("filter-badge");
    expect(badges).toHaveLength(4);

    userEvent.click(screen.queryByDataCy("clear-all-filters"));
    badges = screen.queryAllByDataCy("filter-badge");
    expect(badges).toHaveLength(0);

    expect(router.state.location.search).toBe("?notRelated=notRelated");
  });
});
