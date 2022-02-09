import userEvent from "@testing-library/user-event";
import { render } from "test_utils";
import Dropdown from ".";

const children = () => <div>Some Children</div>;
describe("dropdown", () => {
  it("renders a button by default with no dropdown", () => {
    const { queryByText } = render(
      <Dropdown buttonText="Some Button"> {children()} </Dropdown>
    );
    expect(queryByText("Some Button")).toBeInTheDocument();
    expect(queryByText("Some Children")).not.toBeInTheDocument();
  });
  it("clicking on the button opens and closes the dropdown", () => {
    const { queryByText } = render(
      <Dropdown buttonText="Some Button"> {children()} </Dropdown>
    );
    expect(queryByText("Some Button")).toBeInTheDocument();
    expect(queryByText("Some Children")).not.toBeInTheDocument();
    userEvent.click(queryByText("Some Button"));
    expect(queryByText("Some Children")).toBeInTheDocument();
    userEvent.click(queryByText("Some Button"));
    expect(queryByText("Some Children")).not.toBeInTheDocument();
  });
  it("clicking on the dropdown contents should not close the dropdown", () => {
    const { queryByText } = render(
      <Dropdown buttonText="Some Button"> {children()} </Dropdown>
    );
    expect(queryByText("Some Button")).toBeInTheDocument();
    expect(queryByText("Some Children")).not.toBeInTheDocument();
    userEvent.click(queryByText("Some Button"));
    expect(queryByText("Some Children")).toBeInTheDocument();
    userEvent.click(queryByText("Some Children"));
    expect(queryByText("Some Children")).toBeInTheDocument();
  });
  it("clicking outside the button and dropdown closes the dropdown", () => {
    const { queryByText } = render(
      <Dropdown buttonText="Some Button"> {children()} </Dropdown>
    );
    expect(queryByText("Some Button")).toBeInTheDocument();
    expect(queryByText("Some Children")).not.toBeInTheDocument();
    userEvent.click(queryByText("Some Button"));
    expect(queryByText("Some Children")).toBeInTheDocument();
    userEvent.click(document.body);
    expect(queryByText("Some Children")).not.toBeInTheDocument();
  });
  it("renders a custom button contents when custom buttonRenderer is passed in", () => {
    const customButtonRenderer = () => <div>Custom Button</div>;
    const { queryByText } = render(
      <Dropdown buttonText="Some Button" buttonRenderer={customButtonRenderer}>
        {children()}
      </Dropdown>
    );
    expect(queryByText("Some Button")).not.toBeInTheDocument();
    expect(queryByText("Custom Button")).toBeInTheDocument();
  });
});
