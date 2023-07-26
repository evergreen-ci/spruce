import { render, screen } from "test_utils";
import { VariableRow } from "./VariableRow";

const mockProperty = {
  content: null,
  disabled: false,
  hidden: false,
  name: "",
  readonly: false,
};
const mockProperties = [mockProperty, mockProperty, mockProperty];

const mockUiSchema = {
  options: {
    repoData: {
      vars: [
        {
          isPrivate: false,
          varName: "test",
          varValue: "test_value",
        },
      ],
    },
  },
};

describe("variable row field template", () => {
  it("shows a warning when a duplicate variable appears in repo and project", () => {
    render(
      <VariableRow
        formData={{ varName: "test" }}
        properties={mockProperties}
        uiSchema={mockUiSchema}
      />
    );
    expect(screen.getByDataCy("override-warning")).toBeInTheDocument();
  });

  it("does not show a warning when a duplicate variable does not appear in repo and project", () => {
    render(
      <VariableRow
        formData={{ varName: "" }}
        properties={mockProperties}
        uiSchema={mockUiSchema}
      />
    );
    expect(screen.queryByDataCy("override-warning")).not.toBeInTheDocument();
  });
});
