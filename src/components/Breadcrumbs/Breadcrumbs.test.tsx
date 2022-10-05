import userEvent from "@testing-library/user-event";
import { screen, renderWithRouterMatch as render, waitFor } from "test_utils";
import { trimStringFromMiddle } from "utils/string";
import Breadcrumbs from ".";

describe("breadcrumbs", () => {
  it("should render an individual breadcrumb", () => {
    render(<Breadcrumbs breadcrumbs={[{ text: "test" }]} />);
    expect(screen.getByText("test")).toBeInTheDocument();
    expect(screen.queryByDataCy("breadcrumb-chevron")).not.toBeInTheDocument();
  });
  it("should render many breadcrumbs separated by chevrons", () => {
    const breadcrumbs = [{ text: "test 1" }, { text: "test 2" }];
    render(<Breadcrumbs breadcrumbs={breadcrumbs} />);
    expect(screen.getByText("test 1")).toBeInTheDocument();
    expect(screen.getByText("test 2")).toBeInTheDocument();
    expect(screen.queryAllByDataCy("breadcrumb-chevron")).toHaveLength(1);
  });
  it("breadcrumbs with long text should be collapsed and viewable with a tooltip", async () => {
    const longMessage = "some really long string that could be a patch title";
    const breadcrumbs = [{ text: longMessage }];
    render(<Breadcrumbs breadcrumbs={breadcrumbs} />);
    expect(screen.queryByText(longMessage)).not.toBeInTheDocument();

    expect(
      screen.getByText(trimStringFromMiddle(longMessage, 25))
    ).toBeInTheDocument();
    userEvent.hover(screen.getByText(trimStringFromMiddle(longMessage, 25)));
    await waitFor(() => {
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });
  });
  it("clicking on a tooltip with a link and event handler should call the event", () => {
    const onClick = jest.fn();
    const breadcrumbs = [{ text: "test", onClick, to: "/" }];
    render(<Breadcrumbs breadcrumbs={breadcrumbs} />);
    expect(screen.getByText("test")).toBeInTheDocument();
    expect(screen.getByText("test")).toHaveAttribute("href", "/");
    userEvent.click(screen.getByText("test"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
