import { render, screen, userEvent, waitFor } from "test_utils";
import TupleSelectWithRegexConditionalStories from ".";

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

describe("tupleSelectWithRegexConditional", () => {
  it("renders normally", () => {
    const onSubmit = jest.fn();
    const validator = jest.fn((v) => v !== "bad");
    const validatorErrorMessage = "Invalid Input";
    render(
      <TupleSelectWithRegexConditionalStories
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
      <TupleSelectWithRegexConditionalStories
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

  it("should validate the input and prevent submission if it fails validation and input type is set to `regex`", async () => {
    const onSubmit = jest.fn();
    const validator = jest.fn((v) => v !== "bad");
    const validatorErrorMessage = "Invalid Input";
    render(
      <TupleSelectWithRegexConditionalStories
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
    await waitFor(() => {
      expect(screen.getByText(validatorErrorMessage)).toBeInTheDocument();
    });
  });
  it("toggling the input type selector to `exact` should escape any regex characters", () => {
    const onSubmit = jest.fn();
    const validator = jest.fn((v) => v !== "bad");
    const validatorErrorMessage = "Invalid Input";
    render(
      <TupleSelectWithRegexConditionalStories
        options={options}
        onSubmit={onSubmit}
        validator={validator}
        validatorErrorMessage={validatorErrorMessage}
      />
    );
    userEvent.click(screen.getByRole("tab", { name: "EXACT" }));
    const input = screen.queryByDataCy("tuple-select-input");
    expect(input).toHaveValue("");
    userEvent.type(input, "some-*");
    expect(input).toHaveValue("some-*");
    userEvent.type(input, "{enter}");
    expect(onSubmit).toHaveBeenCalledWith({
      category: "build_variant",
      value: "some\\-\\*",
    });

    expect(input).toHaveValue("");
  });
  it("should not attempt to validate input if using the `exact` input type", () => {
    const onSubmit = jest.fn();
    const validator = jest.fn((v) => v !== "bad");
    const validatorErrorMessage = "Invalid Input";
    render(
      <TupleSelectWithRegexConditionalStories
        options={options}
        onSubmit={onSubmit}
        validator={validator}
        validatorErrorMessage={validatorErrorMessage}
      />
    );
    userEvent.click(screen.getByRole("tab", { name: "EXACT" }));
    const input = screen.queryByDataCy("tuple-select-input");
    expect(input).toHaveValue("");
    userEvent.type(input, "some-[");
    expect(input).toHaveValue("some-[");
    expect(validator).toHaveBeenCalledWith("");
  });
});
