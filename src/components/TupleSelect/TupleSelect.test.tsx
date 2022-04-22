import { render, fireEvent, waitFor } from "test_utils";
import { ProjectFilterOptions } from "types/commits";
import TupleSelect from ".";

const options = [
  {
    value: ProjectFilterOptions.BuildVariant,
    displayName: "Build Variant",
    placeHolderText: "Search Build Variant names",
  },
  {
    value: ProjectFilterOptions.Task,
    displayName: "Task",
    placeHolderText: "Search Task names",
  },
];

describe("tupleSelect", () => {
  it("renders normally", () => {
    const onSubmit = jest.fn();
    const validator = jest.fn((v) => v !== "bad");
    const validatorErrorMessage = "Invalid Input";
    const { queryByDataCy } = render(
      <TupleSelect
        options={options}
        onSubmit={onSubmit}
        validator={validator}
        validatorErrorMessage={validatorErrorMessage}
      />
    );

    const input = queryByDataCy("tuple-select-input");
    const dropdown = queryByDataCy("tuple-select-dropdown");
    expect(dropdown).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(dropdown).toHaveTextContent("Build Variant");
    expect(input).toHaveValue("");
  });

  it("should clear input when a value is submitted", () => {
    const onSubmit = jest.fn();
    const validator = jest.fn((v) => v !== "bad");
    const validatorErrorMessage = "Invalid Input";
    const { queryByDataCy } = render(
      <TupleSelect
        options={options}
        onSubmit={onSubmit}
        validator={validator}
        validatorErrorMessage={validatorErrorMessage}
      />
    );
    const input = queryByDataCy("tuple-select-input");

    expect(input).toHaveValue("");
    fireEvent.change(input, {
      target: { value: "some-filter" },
    });
    expect(input).toHaveValue("some-filter");
    fireEvent.focus(input);
    fireEvent.keyDown(input, {
      key: "Enter",
      keyCode: 13,
    });
    expect(input).toHaveValue("");
  });
  it("should validate the input and prevent submission if it fails validation", async () => {
    const onSubmit = jest.fn();
    const validator = jest.fn((v) => v !== "bad");
    const validatorErrorMessage = "Invalid Input";
    const { queryByDataCy, queryByText } = render(
      <TupleSelect
        options={options}
        onSubmit={onSubmit}
        validator={validator}
        validatorErrorMessage={validatorErrorMessage}
      />
    );
    const input = queryByDataCy("tuple-select-input");

    expect(input).toHaveValue("");
    fireEvent.change(input, {
      target: { value: "bad" },
    });
    expect(input).toHaveValue("bad");
    fireEvent.focus(input);
    fireEvent.keyDown(input, {
      key: "Enter",
      keyCode: 13,
    });
    expect(input).toHaveValue("bad");
    expect(onSubmit).not.toHaveBeenCalled();
    expect(validator).toHaveBeenLastCalledWith("bad");
    expect(queryByDataCy("tuple-select-warning")).toBeInTheDocument();
    fireEvent.mouseEnter(queryByDataCy("tuple-select-warning"));
    await waitFor(() =>
      expect(queryByText(validatorErrorMessage)).toBeInTheDocument()
    );
  });
});
