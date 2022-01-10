import { render } from "test_utils/test-utils";
import { VariableRow } from "./VariableRow";

const mockProperty = {
  content: null,
  name: "",
  disabled: false,
  readonly: false,
  hidden: false,
};
const mockProperties = [mockProperty, mockProperty, mockProperty];

const mockUiSchema = {
  options: {
    repoData: {
      vars: [
        {
          varName: "test",
          varValue: "test_value",
          isPrivate: false,
        },
      ],
    },
  },
};

describe("variable row field template", () => {
  it("shows a warning when a duplicate variable appears in repo and project", async () => {
    const { queryByDataCy } = render(
      <VariableRow
        formData={{ varName: "test" }}
        properties={mockProperties}
        uiSchema={mockUiSchema}
      />
    );
    expect(queryByDataCy("override-warning")).toBeInTheDocument();
  });

  it("does not show a warning when a duplicate variable does not appear in repo and project", async () => {
    const { queryByDataCy } = render(
      <VariableRow
        formData={{ varName: "" }}
        properties={mockProperties}
        uiSchema={mockUiSchema}
      />
    );
    expect(queryByDataCy("override-warning")).not.toBeInTheDocument();
  });
});
