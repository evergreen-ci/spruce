import { render, screen, userEvent } from "test_utils";
import TextInputWithValidation from ".";

describe("textInputWithValidation", () => {
  it("should not be able to submit with an invalid input", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(
      <TextInputWithValidation
        onSubmit={onSubmit}
        label="textinput"
        aria-label="textinput"
        validator={(v) => v.length > 5}
      />,
    );
    const input = screen.getByRole("textbox", { name: "textinput" });
    await user.type(input, "test");
    expect(input).toHaveValue("test");
    await user.type(input, "{enter}");
    expect(onSubmit).not.toHaveBeenCalledWith("test");
  });
  it("should not validate without a validation function", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(
      <TextInputWithValidation
        onSubmit={onSubmit}
        label="textinput"
        aria-label="textinput"
      />,
    );
    const input = screen.getByRole("textbox", { name: "textinput" });
    await user.type(input, "test");
    await user.type(input, "{enter}");
    expect(onSubmit).toHaveBeenCalledWith("test");
  });
  it("should call onChange only for valid inputs", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <TextInputWithValidation
        onChange={onChange}
        label="textinput"
        aria-label="textinput"
        validator={(v) => v.length >= 5}
      />,
    );
    const input = screen.getByRole("textbox", { name: "textinput" });
    await user.type(input, "test");
    expect(onChange).not.toHaveBeenCalledWith("test");
    await user.type(input, "5");
    expect(onChange).toHaveBeenCalledWith("test5");
  });
  it("clearOnSubmit should clear the input after a valid input is submitted", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const onSubmit = jest.fn();
    render(
      <TextInputWithValidation
        onChange={onChange}
        label="textinput"
        aria-label="textinput"
        validator={(v) => v.length >= 5}
        onSubmit={onSubmit}
        clearOnSubmit
      />,
    );
    const input = screen.getByRole("textbox", { name: "textinput" });
    await user.type(input, "test");
    expect(onChange).not.toHaveBeenCalledWith("test");
    await user.type(input, "5");
    expect(onChange).toHaveBeenCalledWith("test5");
    await user.type(input, "{enter}");
    expect(input).toHaveValue("");
    expect(onSubmit).toHaveBeenCalledWith("test5");
  });
});
