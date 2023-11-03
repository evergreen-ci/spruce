import { render, screen, userEvent } from "test_utils";
import TextInputWithValidation from ".";

describe("textInputWithValidation", () => {
  it("should not validate without a validation function", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(
      <TextInputWithValidation
        onSubmit={onSubmit}
        label="textinput"
        aria-label="textinput"
      />
    );
    await user.type(screen.getByRole("textbox", { name: "textinput" }), "test");
    expect(screen.getByRole("textbox", { name: "textinput" })).toHaveValue(
      "test"
    );
    userEvent.click(screen.getByRole("button", { name: "Select plus button" }));

    expect(onSubmit).toHaveBeenCalledWith("test");
  });
});
