import { renderWithRouterMatch as render, fireEvent } from "test_utils";
import { ProjectFilterOptions } from "types/commits";
import { FilterBadges } from ".";

const Content = () => (
  <FilterBadges
    queryParamsToDisplay={
      new Set([
        ProjectFilterOptions.BuildVariant,
        ProjectFilterOptions.Task,
        ProjectFilterOptions.Test,
      ])
    }
  />
);

describe("filterBadges", () => {
  it("should not render any badges if there are no query params", () => {
    const { queryByDataCy } = render(Content, {
      route: `/commits/evergreen`,
      path: "/commits/:projectId",
    });
    expect(queryByDataCy("filter-badge")).not.toBeInTheDocument();
  });

  it("should render a singular filter badge if there is only one query param", () => {
    const { queryAllByDataCy } = render(Content, {
      route: `/commits/evergreen?buildVariants=variant1`,
      path: "/commits/:projectId",
    });
    expect(queryAllByDataCy("filter-badge")).toHaveLength(1);
  });

  it("should render multiple filter badges with the same key but different values", () => {
    const { queryAllByDataCy } = render(Content, {
      route: `/commits/evergreen?buildVariants=variant1,variant2`,
      path: "/commits/:projectId",
    });
    const badges = queryAllByDataCy("filter-badge");
    expect(badges).toHaveLength(2);

    expect(badges[0]).toHaveTextContent("buildVariants : variant1");
    expect(badges[1]).toHaveTextContent("buildVariants : variant2");
  });

  it("should render multiple filter badges with the different keys and different values", () => {
    const { queryAllByDataCy } = render(Content, {
      route: `/commits/evergreen?buildVariants=variant1&tests=test1`,
      path: "/commits/:projectId",
    });
    const badges = queryAllByDataCy("filter-badge");
    expect(badges).toHaveLength(2);
    expect(badges[0]).toHaveTextContent("buildVariants : variant1");
    expect(badges[1]).toHaveTextContent("tests : test1");
  });

  it("closing out a badge should remove it from the url", () => {
    const { queryByDataCy, history } = render(Content, {
      route: `/commits/evergreen?buildVariants=variant1`,
      path: "/commits/:projectId",
    });

    const badge = queryByDataCy("filter-badge");
    expect(badge).toHaveTextContent("buildVariants : variant1");
    const closeBadge = queryByDataCy("close-badge");
    expect(closeBadge).toBeInTheDocument();
    fireEvent.click(closeBadge);
    const { location } = history;

    expect(queryByDataCy("filter-badge")).toBeNull();
    expect(location.search).toBe(``);
  });

  it("should only remove one badge from the url if it is closed and more remain", () => {
    const { queryAllByDataCy, queryByText, history } = render(Content, {
      route: `/commits/evergreen?buildVariants=variant1,variant2`,
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
    expect(location.search).toBe(`?buildVariants=variant2`);
  });

  it("should remove all badges when clicking on clear all button", () => {
    const { queryAllByDataCy, queryByDataCy, history } = render(Content, {
      route: `/commits/evergreen?buildVariants=variant1,variant2&tests=test1,test2`,
      path: "/commits/:projectId",
    });

    let badges = queryAllByDataCy("filter-badge");
    expect(badges).toHaveLength(4);

    fireEvent.click(queryByDataCy("clear-all-filters"));
    badges = queryAllByDataCy("filter-badge");
    expect(badges).toHaveLength(0);
    const { location } = history;

    expect(location.search).toBe(``);
  });

  it("should show a max of 8 badges and a link to show more if there are more", () => {
    const { queryAllByDataCy, queryByText } = render(Content, {
      route: `/commits/evergreen?buildVariants=variant1,variant2,variant3,variant4&tests=test1,test2,test3,test4&taskNames=task1`,
      path: "/commits/:projectId",
    });

    const badges = queryAllByDataCy("filter-badge");
    expect(badges).toHaveLength(8);

    expect(queryByText("see 1 more")).toBeInTheDocument();
  });

  it("should truncate a badge name if it's too long", () => {
    const longVariantName = "long_long_long_long_long_long_build_variant_name";
    const { queryAllByDataCy, queryByText } = render(Content, {
      route: `/commits/evergreen?buildVariants=${longVariantName}`,
      path: "/commits/:projectId",
    });

    expect(queryByText(longVariantName)).not.toBeInTheDocument();
    fireEvent.mouseEnter(queryAllByDataCy("filter-badge")[0]);
    expect(queryByText(longVariantName)).toBeVisible();
  });
});
