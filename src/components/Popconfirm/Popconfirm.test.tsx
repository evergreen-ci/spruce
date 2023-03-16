import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import Popconfirm from ".";

describe("controlled popconfirm", () => {
  it("properly shows content inside the popconfirm", () => {
    render(
      <Popconfirm active confirmText="OK" setActive={jest.fn()}>
        <div>hello</div>
      </Popconfirm>
    );
    expect(screen.getByText("hello")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "OK" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("pressing the Confirm button calls the onConfirm callback and closes the popconfirm", () => {
    const onConfirm = jest.fn();
    const setActive = jest.fn();
    render(
      <Popconfirm active onConfirm={onConfirm} setActive={setActive}>
        <div>hello</div>
      </Popconfirm>
    );
    userEvent.click(screen.getByRole("button", { name: "Yes" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(setActive).toHaveBeenCalledTimes(1);
    expect(setActive).toHaveBeenCalledWith(false);
  });

  it("pressing the Cancel button calls the onCancel callback and closes the popconfirm", () => {
    const onCancel = jest.fn();
    const setActive = jest.fn();
    render(
      <Popconfirm active onCancel={onCancel} setActive={setActive}>
        <div>hello</div>
      </Popconfirm>
    );
    userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(setActive).toHaveBeenCalledTimes(1);
    expect(setActive).toHaveBeenCalledWith(false);
  });

  it("disables the confirm button when confirmDisabled is true", () => {
    render(
      <Popconfirm
        active
        confirmDisabled
        onCancel={jest.fn()}
        setActive={jest.fn()}
      >
        <div>hello</div>
      </Popconfirm>
    );
    expect(screen.getByRole("button", { name: "Yes" })).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });
});

describe("uncontrolled popconfirm", () => {
  it("uses a trigger to open and close the component", async () => {
    const onCancel = jest.fn();
    render(
      <Popconfirm
        onCancel={onCancel}
        trigger={<button type="button">Open</button>}
      >
        <div>hello</div>
      </Popconfirm>
    );
    userEvent.click(screen.getByRole("button", { name: "Open" }));
    await waitFor(() => {
      expect(screen.getByText("hello")).toBeVisible();
    });
    userEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(screen.getByText("hello")).not.toBeVisible();
  });
});
