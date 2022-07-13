import userEvent from "@testing-library/user-event";
import { render, screen } from "test_utils";
import Dropdown from ".";

const children = () => <div>Some Children</div>;
describe("dropdown", () => {
  it("renders a button by default with no dropdown", () => {
    render(<Dropdown buttonText="Some Button"> {children()} </Dropdown>);
    expect(screen.getByText("Some Button")).toBeInTheDocument();
    expect(screen.queryByText("Some Children")).not.toBeInTheDocument();
  });

  it("clicking on the button opens and closes the dropdown", () => {
    render(<Dropdown buttonText="Some Button"> {children()} </Dropdown>);
    expect(screen.getByText("Some Button")).toBeInTheDocument();
    expect(screen.queryByText("Some Children")).not.toBeInTheDocument();
    userEvent.click(screen.queryByText("Some Button"));
    expect(screen.getByText("Some Children")).toBeInTheDocument();
    userEvent.click(screen.queryByText("Some Button"));
    expect(screen.queryByText("Some Children")).not.toBeInTheDocument();
  });

  it("clicking on the dropdown contents should not close the dropdown", () => {
    render(<Dropdown buttonText="Some Button"> {children()} </Dropdown>);
    expect(screen.getByText("Some Button")).toBeInTheDocument();
    expect(screen.queryByText("Some Children")).not.toBeInTheDocument();
    userEvent.click(screen.queryByText("Some Button"));
    expect(screen.getByText("Some Children")).toBeInTheDocument();
    userEvent.click(screen.queryByText("Some Children"));
    expect(screen.getByText("Some Children")).toBeInTheDocument();
  });

  it("clicking outside the button and dropdown closes the dropdown", () => {
    render(<Dropdown buttonText="Some Button"> {children()} </Dropdown>);
    expect(screen.getByText("Some Button")).toBeInTheDocument();
    expect(screen.queryByText("Some Children")).not.toBeInTheDocument();
    userEvent.click(screen.queryByText("Some Button"));
    expect(screen.getByText("Some Children")).toBeInTheDocument();
    userEvent.click(document.body);
    expect(screen.queryByText("Some Children")).not.toBeInTheDocument();
  });

  it("renders a custom button contents when custom buttonRenderer is passed in", () => {
    const customButtonRenderer = () => <div>Custom Button</div>;
    render(
      <Dropdown buttonText="Some Button" buttonRenderer={customButtonRenderer}>
        {children()}
      </Dropdown>
    );
    expect(screen.queryByText("Some Button")).not.toBeInTheDocument();
    expect(screen.getByText("Custom Button")).toBeInTheDocument();
  });
});
