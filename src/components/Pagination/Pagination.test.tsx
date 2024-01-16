import { renderWithRouterMatch, screen, userEvent } from "test_utils";
import Pagination from ".";

describe("pagination", () => {
  it("should render the correct page count given total results and page size", () => {
    const { rerender } = renderWithRouterMatch(
      <Pagination currentPage={0} totalResults={10} pageSize={5} />,
    );
    expect(screen.getByText("1 / 2")).toBeInTheDocument();
    rerender(<Pagination currentPage={0} totalResults={10} pageSize={10} />);
    expect(screen.getByText("1 / 1")).toBeInTheDocument();
    rerender(<Pagination currentPage={0} totalResults={100} pageSize={10} />);
    expect(screen.getByText("1 / 10")).toBeInTheDocument();
    rerender(<Pagination currentPage={0} totalResults={0} pageSize={10} />);
    expect(screen.getByText("0 / 0")).toBeInTheDocument();
  });
  it("shold disable the previous page if on the first page", () => {
    const { router } = renderWithRouterMatch(
      <Pagination currentPage={0} totalResults={10} pageSize={5} />,
    );
    expect(router.state.location.search).toBe("");
    expect(screen.queryByDataCy("prev-page-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
  it("should disable the next page if on the last page", () => {
    const { router } = renderWithRouterMatch(
      <Pagination currentPage={1} totalResults={10} pageSize={5} />,
    );
    expect(router.state.location.search).toBe("");
    expect(screen.queryByDataCy("next-page-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
  it("paginating forward should update the url with the new page number by default", async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouterMatch(
      <Pagination currentPage={0} totalResults={10} pageSize={5} />,
    );

    expect(router.state.location.search).toBe("");
    await user.click(screen.getByDataCy("next-page-button"));
    expect(router.state.location.search).toBe("?page=1");
  });
  it("paginating backward should update the url with the new page number by default", async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouterMatch(
      <Pagination currentPage={1} totalResults={10} pageSize={5} />,
    );

    expect(router.state.location.search).toBe("");
    await user.click(screen.getByDataCy("prev-page-button"));
    expect(router.state.location.search).toBe("?page=0");
  });

  it("should call the onChange callback when the page changes", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    renderWithRouterMatch(
      <Pagination
        currentPage={0}
        totalResults={10}
        pageSize={5}
        onChange={onChange}
      />,
    );
    await user.click(screen.getByDataCy("next-page-button"));
    expect(onChange).toHaveBeenCalledWith(1);
  });
  it("should disable pagination if there  is only one page", () => {
    renderWithRouterMatch(
      <Pagination currentPage={0} totalResults={5} pageSize={5} />,
    );
    expect(screen.queryByDataCy("prev-page-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(screen.queryByDataCy("next-page-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
  it("should disable pagination if there are no pages", () => {
    renderWithRouterMatch(
      <Pagination currentPage={0} totalResults={5} pageSize={5} />,
    );
    expect(screen.queryByDataCy("prev-page-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(screen.queryByDataCy("next-page-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
});
