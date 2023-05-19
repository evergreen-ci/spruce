import { renderWithRouterMatch, screen } from "test_utils";
import Pagination from ".";

describe("pagination", () => {
  it("should render the current page as well as the max pages", () => {
    renderWithRouterMatch(<Pagination currentPage={0} numPages={2} />);
    expect(screen.getByText("1 / 2")).toBeInTheDocument();
  });
  it("shold disable the previous page if on the first page", () => {
    const { router } = renderWithRouterMatch(
      <Pagination currentPage={0} numPages={2} />
    );
    expect(router.state.location.search).toBe("");
    expect(screen.queryByDataCy("prev-page-button")).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });
  it("should disable the next page if on the last page", () => {
    const { router } = renderWithRouterMatch(
      <Pagination currentPage={1} numPages={2} />
    );
    expect(router.state.location.search).toBe("");
    expect(screen.queryByDataCy("next-page-button")).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });
  it("paginating should update the url with the current page number by default", () => {
    const { router, rerender } = renderWithRouterMatch(
      <Pagination currentPage={0} numPages={2} />
    );
    expect(router.state.location.search).toBe("");
    screen.getByDataCy("next-page-button").click();
    expect(router.state.location.search).toBe("?page=1");
    rerender(<Pagination currentPage={1} numPages={2} />);
    screen.getByDataCy("prev-page-button").click();
    expect(router.state.location.search).toBe("?page=0");
  });
});
