import {
  renderWithRouterMatch as render,
  fireEvent,
} from "test_utils/test-utils";
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

test("should not render any badges if there are no query params", () => {
  const { queryByDataCy } = render(Content, {
    route: `/commits/evergreen`,
    path: "/commits/:projectId",
  });
  expect(queryByDataCy("filter-badge")).not.toBeInTheDocument();
});

test("should render a singular filter badge if there is only one query param", () => {
  const { queryAllByDataCy } = render(Content, {
    route: `/commits/evergreen?buildVariants=variant1`,
    path: "/commits/:projectId",
  });
  expect(queryAllByDataCy("filter-badge")).toHaveLength(1);
});

test("should render multiple filter badges with the same key but different values", () => {
  const { queryAllByDataCy } = render(Content, {
    route: `/commits/evergreen?buildVariants=variant1,variant2`,
    path: "/commits/:projectId",
  });
  const badges = queryAllByDataCy("filter-badge");
  expect(badges).toHaveLength(2);

  expect(badges[0]).toHaveTextContent("buildVariants : variant1");
  expect(badges[1]).toHaveTextContent("buildVariants : variant2");
});

test("should render multiple filter badges with the different keys and different values", () => {
  const { queryAllByDataCy } = render(Content, {
    route: `/commits/evergreen?buildVariants=variant1&tests=test1`,
    path: "/commits/:projectId",
  });
  const badges = queryAllByDataCy("filter-badge");
  expect(badges).toHaveLength(2);
  expect(badges[0]).toHaveTextContent("buildVariants : variant1");
  expect(badges[1]).toHaveTextContent("tests : test1");
});

test("closing out a badge should remove it from the url", () => {
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

test("should only remove one badge from the url if it is closed and more remain", () => {
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

test("should remove all badges when clicking on clear all button", () => {
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

test("should show a max of 8 badges and a link to show more if there are more", () => {
  const { queryAllByDataCy, queryByText } = render(Content, {
    route: `/commits/evergreen?buildVariants=variant1,variant2,variant3,variant4&tests=test1,test2,test3,test4&taskNames=task1`,
    path: "/commits/:projectId",
  });

  const badges = queryAllByDataCy("filter-badge");
  expect(badges).toHaveLength(8);

  expect(queryByText("see 1 more")).toBeInTheDocument();
});
