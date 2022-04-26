import userEvent from "@testing-library/user-event";
import { render, waitFor } from "test_utils";
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
    const { queryByDataCy, queryByText } = render(
      <TupleSelect
        options={options}
        onSubmit={onSubmit}
        validator={validator}
        validatorErrorMessage={validatorErrorMessage}
      />
    );
    const input = queryByDataCy("tuple-select-input");
    const dropdown = queryByText("Build Variant");
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
    userEvent.type(input, "some-filter");
    userEvent.type(input, "{enter}");
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
    userEvent.type(input, "bad");
    expect(input).toHaveValue("bad");
    userEvent.type(input, "{enter}");
    expect(input).toHaveValue("bad");
    expect(onSubmit).not.toHaveBeenCalled();
    expect(validator).toHaveBeenLastCalledWith("bad");
    expect(queryByDataCy("tuple-select-warning")).toBeInTheDocument();
    userEvent.hover(queryByDataCy("tuple-select-warning"));
    await waitFor(() =>
      expect(queryByText(validatorErrorMessage)).toBeInTheDocument()
    );
  });
});
