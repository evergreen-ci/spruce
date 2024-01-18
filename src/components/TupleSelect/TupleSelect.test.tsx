import { render, screen, userEvent } from "test_utils";
import TupleSelect from ".";

const options = [
  {
    value: "build_variant",
    displayName: "Build Variant",
    placeHolderText: "Search Build Variant names",
  },
  {
    value: "task",
    displayName: "Task",
    placeHolderText: "Search Task names",
  },
];

describe("tupleSelect", () => {
  it("renders normally", () => {
    const onSubmit = jest.fn();
    const validator = jest.fn((v) => v !== "bad");
    const validatorErrorMessage = "Invalid Input";
    render(
      <TupleSelect
        options={options}
        onSubmit={onSubmit}
        validator={validator}
        validatorErrorMessage={validatorErrorMessage}
      />,
    );
    const input = screen.queryByDataCy("tuple-select-input");
    const dropdown = screen.queryByText("Build Variant");
    expect(dropdown).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(dropdown).toHaveTextContent("Build Variant");
    expect(input).toHaveValue("");
  });

  it("should clear input when a value is submitted", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    const validator = jest.fn((v) => v !== "bad");
    const validatorErrorMessage = "Invalid Input";
    render(
      <TupleSelect
        options={options}
        onSubmit={onSubmit}
        validator={validator}
        validatorErrorMessage={validatorErrorMessage}
      />,
    );
    const input = screen.queryByDataCy("tuple-select-input");

    expect(input).toHaveValue("");
    await user.type(input, "some-filter");
    await user.type(input, "{enter}");
    expect(input).toHaveValue("");
  });

  it("should validate the input and prevent submission if it fails validation", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    const validator = jest.fn((v) => v !== "bad");
    const validatorErrorMessage = "Invalid Input";
    render(
      <TupleSelect
        options={options}
        onSubmit={onSubmit}
        validator={validator}
        validatorErrorMessage={validatorErrorMessage}
      />,
    );
    const input = screen.queryByDataCy("tuple-select-input");

    expect(input).toHaveValue("");
    await user.type(input, "bad");
    expect(input).toHaveValue("bad");
    await user.type(input, "{enter}");
    expect(input).toHaveValue("bad");
    expect(onSubmit).not.toHaveBeenCalled();
    expect(validator).toHaveBeenLastCalledWith("bad");
    expect(screen.getByLabelText("validation error")).toBeInTheDocument();
    await user.hover(screen.getByLabelText("validation error"));
    await screen.findByText(validatorErrorMessage);
  });
});
