import { render, screen, userEvent } from "test_utils";
import TupleSelect from ".";

const options = [
  {
    displayName: "Build Variant",
    placeHolderText: "Search Build Variant names",
    value: "build_variant",
  },
  {
    displayName: "Task",
    placeHolderText: "Search Task names",
    value: "task",
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
      />
    );
    const input = screen.queryByDataCy("tuple-select-input");
    const dropdown = screen.queryByText("Build Variant");
    expect(dropdown).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(dropdown).toHaveTextContent("Build Variant");
    expect(input).toHaveValue("");
  });

  it("should clear input when a value is submitted", () => {
    const onSubmit = jest.fn();
    const validator = jest.fn((v) => v !== "bad");
    const validatorErrorMessage = "Invalid Input";
    render(
      <TupleSelect
        options={options}
        onSubmit={onSubmit}
        validator={validator}
        validatorErrorMessage={validatorErrorMessage}
      />
    );
    const input = screen.queryByDataCy("tuple-select-input");

    expect(input).toHaveValue("");
    userEvent.type(input, "some-filter");
    userEvent.type(input, "{enter}");
    expect(input).toHaveValue("");
  });

  it("should validate the input and prevent submission if it fails validation", async () => {
    const onSubmit = jest.fn();
    const validator = jest.fn((v) => v !== "bad");
    const validatorErrorMessage = "Invalid Input";
    render(
      <TupleSelect
        options={options}
        onSubmit={onSubmit}
        validator={validator}
        validatorErrorMessage={validatorErrorMessage}
      />
    );
    const input = screen.queryByDataCy("tuple-select-input");

    expect(input).toHaveValue("");
    userEvent.type(input, "bad");
    expect(input).toHaveValue("bad");
    userEvent.type(input, "{enter}");
    expect(input).toHaveValue("bad");
    expect(onSubmit).not.toHaveBeenCalled();
    expect(validator).toHaveBeenLastCalledWith("bad");
    expect(screen.getByDataCy("tuple-select-warning")).toBeInTheDocument();
    userEvent.hover(screen.queryByDataCy("tuple-select-warning"));
    await screen.findByText(validatorErrorMessage);
  });
});
