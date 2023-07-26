import { screen, renderWithRouterMatch as render, waitFor } from "test_utils";
import { NavDropdown } from ".";

const menuItems = [
  {
    "data-cy": "item-1",
    href: "/item1",
    text: "Item 1",
  },
  {
    "data-cy": "item-2",
    text: "Item 2",
    to: "/item2",
  },
];
describe("navDropdown", () => {
  it("renders the dropdown", () => {
    render(<NavDropdown title="Dropdown" menuItems={menuItems} />);

    expect(screen.getByText("Dropdown")).toBeInTheDocument();
  });
  it("opening the dropdown renders all of the buttons", async () => {
    render(<NavDropdown title="Dropdown" menuItems={menuItems} />);
    screen.getByText("Dropdown").click();
    await waitFor(() => {
      expect(screen.getByText("Item 1")).toBeInTheDocument();
    });
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });
  it("should link to both router and non-router links", async () => {
    render(<NavDropdown title="Dropdown" menuItems={menuItems} />);
    screen.getByText("Dropdown").click();
    await waitFor(() => {
      expect(screen.getByText("Item 1")).toBeInTheDocument();
    });
    expect(screen.getByText("Item 1").closest("a")).toHaveAttribute(
      "href",
      "/item1"
    );
    expect(screen.getByText("Item 2").closest("a")).toHaveAttribute(
      "href",
      "/item2"
    );
  });
  it("clicking on a link triggers a callback", async () => {
    const mockCallback = jest.fn();
    render(
      <NavDropdown
        title="Dropdown"
        menuItems={[
          {
            "data-cy": "item-1",
            href: "/item1",
            onClick: mockCallback,
            text: "Item 1",
          },
        ]}
      />
    );
    screen.getByText("Dropdown").click();
    await waitFor(() => {
      expect(screen.getByText("Item 1")).toBeInTheDocument();
    });
    screen.getByText("Item 1").click();
    expect(mockCallback).toHaveBeenCalledWith();
  });
});
