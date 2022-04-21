import FilterBadges from "components/FilterBadges";
import { renderWithRouterMatch as render, fireEvent } from "test_utils";
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
    const { queryByDataCy } = render(Content, {
      route: "/commits/evergreen",
      path: "/commits/:projectId",
    });
    expect(queryByDataCy("filter-badge")).not.toBeInTheDocument();
  });

  it("should render a singular filter badge if there is only one query param", () => {
    const { queryAllByDataCy } = render(Content, {
      route: "/commits/evergreen?buildVariants=variant1",
      path: "/commits/:projectId",
    });
    expect(queryAllByDataCy("filter-badge")).toHaveLength(1);
  });

  it("should render multiple filter badges with the same key but different values", () => {
    const { queryAllByDataCy } = render(Content, {
      route: "/commits/evergreen?buildVariants=variant1,variant2",
      path: "/commits/:projectId",
    });
    const badges = queryAllByDataCy("filter-badge");
    expect(badges).toHaveLength(2);

    expect(badges[0]).toHaveTextContent("buildVariants : variant1");
    expect(badges[1]).toHaveTextContent("buildVariants : variant2");
  });

  it("should render multiple filter badges with the different keys and different values", () => {
    const { queryAllByDataCy } = render(Content, {
      route: "/commits/evergreen?buildVariants=variant1&tests=test1",
      path: "/commits/:projectId",
    });
    const badges = queryAllByDataCy("filter-badge");
    expect(badges).toHaveLength(2);
    expect(badges[0]).toHaveTextContent("buildVariants : variant1");
    expect(badges[1]).toHaveTextContent("tests : test1");
  });

  it("closing out a badge should remove it from the url", () => {
    const { queryByDataCy, history } = render(Content, {
      route: "/commits/evergreen?buildVariants=variant1",
      path: "/commits/:projectId",
    });

    const badge = queryByDataCy("filter-badge");
    expect(badge).toHaveTextContent("buildVariants : variant1");
    const closeBadge = queryByDataCy("close-badge");
    expect(closeBadge).toBeInTheDocument();
    fireEvent.click(closeBadge);
    const { location } = history;

    expect(queryByDataCy("filter-badge")).toBeNull();
    expect(location.search).toBe("");
  });

  it("should only remove one badge from the url if it is closed and more remain", () => {
    const { queryAllByDataCy, queryByText, history } = render(Content, {
      route: "/commits/evergreen?buildVariants=variant1,variant2",
      path: "/commits/:projectId",
    });

    let badges = queryAllByDataCy("filter-badge");
    expect(badges).toHaveLength(2);
    expect(queryByText("buildVariants : variant1")).toBeInTheDocument();
    const closeBadge = queryAllByDataCy("close-badge");
    fireEvent.click(closeBadge[0]);
    badges = queryAllByDataCy("filter-badge");
    expect(badges).toHaveLength(1);
    expect(queryByText("buildVariants : variant1")).toBeNull();

    const { location } = history;

    expect(queryAllByDataCy("filter-badge")).toHaveLength(1);
    expect(location.search).toBe("?buildVariants=variant2");
  });

  it("should remove all badges when clicking on clear all button", () => {
    const { queryAllByDataCy, queryByDataCy, history } = render(Content, {
      route:
        "/commits/evergreen?buildVariants=variant1,variant2&tests=test1,test2",
      path: "/commits/:projectId",
    });

    let badges = queryAllByDataCy("filter-badge");
    expect(badges).toHaveLength(4);

    fireEvent.click(queryByDataCy("clear-all-filters"));
    badges = queryAllByDataCy("filter-badge");
    expect(badges).toHaveLength(0);
    const { location } = history;

    expect(location.search).toBe("");
  });

  it("should only remove query params for displayable badges when clear all is pressed", () => {
    const { queryAllByDataCy, queryByDataCy, history } = render(Content, {
      route:
        "/commits/evergreen?buildVariants=variant1,variant2&tests=test1,test2&notRelated=notRelated",
      path: "/commits/:projectId",
    });

    let badges = queryAllByDataCy("filter-badge");
    expect(badges).toHaveLength(4);

    fireEvent.click(queryByDataCy("clear-all-filters"));
    badges = queryAllByDataCy("filter-badge");
    expect(badges).toHaveLength(0);
    const { location } = history;

    expect(location.search).toBe("?notRelated=notRelated");
  });
});
