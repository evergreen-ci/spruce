import {
  createMemoryRouter,
  Link,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { render, screen, userEvent } from "test_utils";
import {
  NavigationModalProps,
  NavigationWarningModal,
} from "./NavigationWarningModal";

const getRouter = ({ shouldBlock, unsavedTabs }: NavigationModalProps) =>
  createMemoryRouter(
    [
      {
        Component() {
          return (
            <div>
              <Link to="/about">About</Link>
              <NavigationWarningModal
                shouldBlock={shouldBlock}
                unsavedTabs={unsavedTabs}
              />
              <Outlet />
            </div>
          );
        },
        children: [
          {
            path: "/",
            element: <h1>Home Page</h1>,
          },
          {
            path: "/about",
            element: <h1>About Page</h1>,
          },
        ],
      },
    ],
    {
      initialEntries: ["/"],
    },
  );

describe("navigation warning", () => {
  it("does not warn when navigating and shouldBlock is false", async () => {
    const router = getRouter({ shouldBlock: false, unsavedTabs: [] });

    const user = userEvent.setup();
    render(<RouterProvider router={router} />);
    expect(router.state.location.pathname).toBe("/");

    await user.click(screen.getByRole("link"));
    expect(router.state.location.pathname).toBe("/about");
    expect(
      screen.queryByDataCy("navigation-warning-modal"),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("heading")).toHaveTextContent("About Page");
  });

  it("warns and shows the modal with unsaved pages", async () => {
    const router = getRouter({
      shouldBlock: true,
      unsavedTabs: [{ title: "An Unsaved Page", value: "foo" }],
    });

    const user = userEvent.setup();
    render(<RouterProvider router={router} />);
    expect(router.state.location.pathname).toBe("/");

    await user.click(screen.getByRole("link"));
    expect(router.state.location.pathname).toBe("/");
    expect(screen.getByDataCy("navigation-warning-modal")).toBeInTheDocument();
    expect(screen.getByText("An Unsaved Page")).toBeInTheDocument();
  });

  it("warns and shows the modal with unsaved pages when a function is provided to shouldBlock", async () => {
    const router = getRouter({
      shouldBlock: () => true,
      unsavedTabs: [{ title: "An Unsaved Page", value: "foo" }],
    });

    const user = userEvent.setup();
    render(<RouterProvider router={router} />);
    expect(router.state.location.pathname).toBe("/");

    await user.click(screen.getByRole("link"));
    expect(router.state.location.pathname).toBe("/");
    expect(screen.getByDataCy("navigation-warning-modal")).toBeInTheDocument();
    expect(screen.getByText("An Unsaved Page")).toBeInTheDocument();
  });

  it("navigates to the next page when 'Leave' button is clicked", async () => {
    const router = getRouter({
      shouldBlock: true,
      unsavedTabs: [{ title: "An Unsaved Page", value: "foo" }],
    });

    const user = userEvent.setup();
    render(<RouterProvider router={router} />);
    expect(router.state.location.pathname).toBe("/");

    await user.click(screen.getByRole("link"));
    expect(router.state.location.pathname).toBe("/");
    expect(screen.getByDataCy("navigation-warning-modal")).toBeInTheDocument();
    expect(screen.getByText("An Unsaved Page")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Leave" }));
    expect(router.state.location.pathname).toBe("/about");
    expect(screen.queryByRole("heading")).toHaveTextContent("About Page");
  });

  it("remains on the initial page when 'Cancel' button is clicked", async () => {
    const router = getRouter({
      shouldBlock: true,
      unsavedTabs: [{ title: "An Unsaved Page", value: "foo" }],
    });

    const user = userEvent.setup();
    render(<RouterProvider router={router} />);
    expect(router.state.location.pathname).toBe("/");

    await user.click(screen.getByRole("link"));
    expect(router.state.location.pathname).toBe("/");
    expect(screen.getByDataCy("navigation-warning-modal")).toBeInTheDocument();
    expect(screen.getByText("An Unsaved Page")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(router.state.location.pathname).toBe("/");
    expect(screen.queryByRole("heading")).toHaveTextContent("Home Page");
  });
});
