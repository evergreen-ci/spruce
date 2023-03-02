import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
import Popconfirm from ".";

describe("popconfirm", () => {
  it("properly shows content inside the popconfirm", () => {
    render(
      <Popconfirm active content={<div>hello</div>} setActive={jest.fn()} />
    );
    expect(screen.getByText("hello")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ok" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("pressing the OK button calls the onConfirm callback and closes the popconfirm", () => {
    const onConfirm = jest.fn();
    const setActive = jest.fn();
    render(
      <Popconfirm
        active
        onConfirm={onConfirm}
        content={<div>hello</div>}
        setActive={setActive}
      />
    );
    userEvent.click(screen.getByRole("button", { name: "Ok" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(setActive).toHaveBeenCalledTimes(1);
    expect(setActive).toHaveBeenCalledWith(false);
  });

  it("pressing the Cancel button calls the onCancel callback and closes the popconfirm", () => {
    const onCancel = jest.fn();
    const setActive = jest.fn();
    render(
      <Popconfirm
        active
        onCancel={onCancel}
        content={<div>hello</div>}
        setActive={setActive}
      />
    );
    userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(setActive).toHaveBeenCalledTimes(1);
    expect(setActive).toHaveBeenCalledWith(false);
  });
});
