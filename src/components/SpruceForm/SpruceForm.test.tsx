import { render, fireEvent } from "test_utils";
import { SpruceForm, SpruceFormContainer } from ".";

describe("spruceForm", () => {
  it("should render as expected", () => {
    const onChange = jest.fn();
    const { container, getByLabelText } = render(
      <SpruceFormContainer title="Just a test">
        <SpruceForm
          schema={basicForm.schema}
          formData={basicForm.formData}
          onChange={onChange}
        />
      </SpruceFormContainer>
    );
    expect(getByLabelText("Project Cloning Method")).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });
  it("updating the form should trigger a callback and update the form state", () => {
    let data = {};
    const onChange = jest.fn((x) => {
      const { formData } = x;
      data = formData;
    });
    const { queryByDataCy } = render(
      <SpruceFormContainer title="Just a test">
        <SpruceForm
          schema={basicForm.schema}
          formData={basicForm.formData}
          onChange={onChange}
          uiSchema={basicForm.uiSchema}
        />
      </SpruceFormContainer>
    );
    fireEvent.change(queryByDataCy("valid-projects-input"), {
      target: { value: "new value" },
    });
    // eslint-disable-next-line jest/prefer-called-with
    expect(onChange).toHaveBeenCalled();
    expect(queryByDataCy("valid-projects-input")).toHaveValue("new value");
    expect(data).toStrictEqual({
      ...basicForm.formData,
      validProjects: "new value",
    });
  });
});

const basicForm = {
  schema: {
    type: "object" as "object",
    properties: {
      cloneMethod: {
        type: "string" as "string",
        title: "Project Cloning Method",
        enum: ["legacy-ssh", "oath-token"],
        enumNames: ["Legacy SSH", "Oath Token"],
      },
      validProjects: {
        type: "string" as "string",
        title: "Valid Projects",
        placeholder: "Sample input",
      },
    },
  },
  formData: {
    cloneMethod: "legacy-ssh",
    validProjects: "spruce",
  },
  uiSchema: {
    validProjects: {
      "ui:widget": "textarea",
      "ui:options": {
        "data-cy": "valid-projects-input",
        label: false,
      },
      cloneMethod: {
        "ui:options": {
          label: false,
        },
      },
    },
  },
};
