import { render, fireEvent, waitFor } from "test_utils";
import { SpruceForm, SpruceFormContainer } from ".";

describe("spruceForm", () => {
  it("should render as expected", () => {
    const onChange = jest.fn();
    const {
      container,
      getAllByRole,
      getByLabelText,
      queryByDataCy,
      queryByText,
    } = render(
      <SpruceFormContainer title="Just a test">
        <SpruceForm
          schema={basicForm.schema}
          formData={basicForm.formData}
          onChange={onChange}
          uiSchema={basicForm.uiSchema}
        />
      </SpruceFormContainer>
    );
    expect(getByLabelText("Project Cloning Method")).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();

    expect(queryByText("Username Label")).not.toBeInTheDocument();
    expect(queryByDataCy("add-button")).toHaveTextContent("New User");
    expect(getAllByRole("heading", { level: 3 })[1]).toHaveTextContent(
      "Manage Access"
    );
  });
  it("updating the form should trigger a callback and update the form state", async () => {
    let data = {};
    const onChange = jest.fn((x) => {
      const { formData } = x;
      data = formData;
    });
    const { queryAllByDataCy, queryByDataCy } = render(
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
    await fireEvent.click(queryByDataCy("add-button"));
    await waitFor(() =>
      expect(queryAllByDataCy("new-user-input")).toHaveLength(2)
    );
    fireEvent.change(queryAllByDataCy("new-user-input")[1], {
      target: { value: "new-user" },
    });
    // eslint-disable-next-line jest/prefer-called-with
    expect(onChange).toHaveBeenCalled();
    expect(queryByDataCy("valid-projects-input")).toHaveValue("new value");
    expect(data).toStrictEqual({
      ...basicForm.formData,
      access: null,
      validProjects: "new value",
      users: ["initial-user", "new-user"],
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
      access: {
        type: "null" as "null",
        title: "Manage Access",
      },
      users: {
        type: "array" as "array",
        title: "Users",
        items: {
          type: "string" as "string",
          title: "Username Label",
        },
      },
    },
  },
  formData: {
    cloneMethod: "legacy-ssh",
    validProjects: "spruce",
    users: ["initial-user"],
  },
  uiSchema: {
    cloneMethod: {
      "ui:options": {
        label: false,
      },
    },
    validProjects: {
      "ui:widget": "textarea",
      "ui:options": {
        "data-cy": "valid-projects-input",
        label: false,
      },
    },
    access: {
      "ui:rootFieldId": "access",
      "ui:sectionTitle": true,
    },
    users: {
      "ui:addButtonText": "New User",
      "ui:data-cy": "new-user-input",
      items: {
        "ui:ariaLabelledBy": "root_access",
        "ui:data-cy": "new-user-input",
      },
    },
  },
};
