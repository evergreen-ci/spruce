import { render, screen, userEvent, waitFor } from "test_utils";
import { SpruceForm, SpruceFormContainer } from ".";

describe("spruce form", () => {
  it("should render as expected", () => {
    const onChange = jest.fn();
    render(
      <SpruceFormContainer title="Just a test">
        <SpruceForm
          schema={basicForm.schema}
          formData={basicForm.formData}
          onChange={onChange}
          uiSchema={basicForm.uiSchema}
        />
      </SpruceFormContainer>
    );
    expect(screen.getByLabelText("Project Cloning Method")).toBeInTheDocument();
    expect(screen.queryByText("Username Label")).not.toBeInTheDocument();
    expect(screen.queryByDataCy("add-button")).toHaveTextContent("New User");
    expect(screen.getAllByRole("heading", { level: 3 })[1]).toHaveTextContent(
      "Manage Access"
    );
  });

  it("updating the form should trigger a callback and update the form state", async () => {
    let data = {};
    const onChange = jest.fn((x) => {
      const { formData } = x;
      data = formData;
    });
    render(
      <SpruceFormContainer title="Just a test">
        <SpruceForm
          schema={basicForm.schema}
          formData={basicForm.formData}
          onChange={onChange}
          uiSchema={basicForm.uiSchema}
        />
      </SpruceFormContainer>
    );
    userEvent.clear(screen.queryByDataCy("valid-projects-input"));
    userEvent.type(screen.queryByDataCy("valid-projects-input"), "new value");
    userEvent.click(screen.queryByDataCy("add-button"));
    await waitFor(() =>
      expect(screen.queryAllByDataCy("new-user-input")).toHaveLength(2)
    );
    userEvent.type(screen.queryAllByDataCy("new-user-input")[0], "new-user");
    expect(onChange).toHaveBeenCalled(); // eslint-disable-line jest/prefer-called-with
    expect(screen.queryByDataCy("valid-projects-input")).toHaveValue(
      "new value"
    );
    expect(data).toStrictEqual({
      ...basicForm.formData,
      access: null,
      users: ["new-user", "initial-user"],
      validProjects: "new value",
    });
  });

  describe("form elements", () => {
    describe("text input", () => {
      describe("invisible errors", () => {
        it("should work with validate function", () => {
          let formErrors = {};
          const onChange = jest.fn((x) => {
            const { errors } = x;
            formErrors = errors;
          });
          const validate = jest.fn((_formData, err) => err);

          const { formData, schema, uiSchema } = textInput();
          render(
            <SpruceFormContainer title="Test for Text Input">
              <SpruceForm
                schema={schema}
                formData={formData}
                onChange={onChange}
                uiSchema={uiSchema}
                validate={validate}
              />
            </SpruceFormContainer>
          );
          userEvent.type(screen.queryByDataCy("text-input"), "new value");
          userEvent.clear(screen.queryByDataCy("text-input"));
          expect(screen.queryByDataCy("text-input")).toHaveValue("");

          // Invisible errors should be in the form error state but not visible on the page.
          expect(formErrors).toStrictEqual([{ stack: "textInput: invisible" }]);
          expect(screen.queryByText("invisible")).toBeNull();
        });
      });

      describe("emptyValue", () => {
        it("defaults to '' when not specified", () => {
          let data = {};
          const onChange = jest.fn((x) => {
            const { formData } = x;
            data = formData;
          });
          const { formData, schema, uiSchema } = textInput();
          render(
            <SpruceFormContainer title="Test for Text Input">
              <SpruceForm
                schema={schema}
                formData={formData}
                onChange={onChange}
                uiSchema={uiSchema}
              />
            </SpruceFormContainer>
          );
          userEvent.type(screen.queryByDataCy("text-input"), "new value");
          userEvent.clear(screen.queryByDataCy("text-input"));
          expect(screen.queryByDataCy("text-input")).toHaveValue("");
          expect(data).toStrictEqual({
            textInput: "",
          });
        });

        it("uses provided value when specified", () => {
          let data = {};
          const onChange = jest.fn((x) => {
            const { formData } = x;
            data = formData;
          });
          const { formData, schema, uiSchema } = textInput("myEmptyValue");
          render(
            <SpruceFormContainer title="Test for Text Input">
              <SpruceForm
                schema={schema}
                formData={formData}
                onChange={onChange}
                uiSchema={uiSchema}
              />
            </SpruceFormContainer>
          );
          userEvent.type(screen.queryByDataCy("text-input"), "new value");
          userEvent.clear(screen.queryByDataCy("text-input"));
          expect(screen.queryByDataCy("text-input")).toHaveValue(
            "myEmptyValue"
          );
          expect(data).toStrictEqual({
            textInput: "myEmptyValue",
          });
        });
      });
    });

    describe("text area", () => {
      describe("invisible errors", () => {
        it("should work with validate function", () => {
          let formErrors = {};
          const onChange = jest.fn((x) => {
            const { errors } = x;
            formErrors = errors;
          });
          const validate = jest.fn((_formData, err) => err);

          const { formData, schema, uiSchema } = textArea();
          render(
            <SpruceFormContainer title="Test for Text Area">
              <SpruceForm
                schema={schema}
                formData={formData}
                onChange={onChange}
                uiSchema={uiSchema}
                validate={validate}
              />
            </SpruceFormContainer>
          );
          userEvent.type(screen.queryByDataCy("text-area"), "new value");
          userEvent.clear(screen.queryByDataCy("text-area"));
          expect(screen.queryByDataCy("text-area")).toHaveValue("");

          // Invisible errors should be in the form error state but not visible on the page.
          expect(formErrors).toStrictEqual([{ stack: "textArea: invisible" }]);
          expect(screen.queryByText("invisible")).toBeNull();
        });
      });

      describe("emptyValue", () => {
        it("defaults to '' when not specified", () => {
          let data = {};
          const onChange = jest.fn((x) => {
            const { formData } = x;
            data = formData;
          });
          const { formData, schema, uiSchema } = textArea();
          render(
            <SpruceFormContainer title="Test for Text Area">
              <SpruceForm
                schema={schema}
                formData={formData}
                onChange={onChange}
                uiSchema={uiSchema}
              />
            </SpruceFormContainer>
          );
          userEvent.type(screen.queryByDataCy("text-area"), "new value");
          userEvent.clear(screen.queryByDataCy("text-area"));
          expect(screen.queryByDataCy("text-area")).toHaveValue("");
          expect(data).toStrictEqual({
            textArea: "",
          });
        });

        it("uses provided value when specified", () => {
          let data = {};
          const onChange = jest.fn((x) => {
            const { formData } = x;
            data = formData;
          });
          const { formData, schema, uiSchema } = textArea("myEmptyValue");
          render(
            <SpruceFormContainer title="Test for Text Area">
              <SpruceForm
                schema={schema}
                formData={formData}
                onChange={onChange}
                uiSchema={uiSchema}
              />
            </SpruceFormContainer>
          );
          userEvent.type(screen.queryByDataCy("text-area"), "new value");
          userEvent.clear(screen.queryByDataCy("text-area"));
          expect(screen.queryByDataCy("text-area")).toHaveValue("myEmptyValue");
          expect(data).toStrictEqual({
            textArea: "myEmptyValue",
          });
        });
      });
    });

    describe("select", () => {
      it("renders with the specified default selected", () => {
        const onChange = jest.fn();
        const { formData, schema, uiSchema } = select;
        render(
          <SpruceForm
            schema={schema}
            formData={formData}
            onChange={onChange}
            uiSchema={uiSchema}
          />
        );
        expect(screen.getByText("Vanilla")).toBeInTheDocument();
        expect(screen.queryByText("Chocolate")).not.toBeInTheDocument();
        expect(screen.queryByText("Strawberry")).not.toBeInTheDocument();
      });

      it("shows three options on click", () => {
        const onChange = jest.fn();
        const { formData, schema, uiSchema } = select;
        render(
          <SpruceForm
            schema={schema}
            formData={formData}
            onChange={onChange}
            uiSchema={uiSchema}
          />
        );
        userEvent.click(screen.queryByRole("button"));
        expect(screen.queryAllByText("Vanilla")).toHaveLength(2);
        expect(screen.getByText("Chocolate")).toBeInTheDocument();
        expect(screen.getByText("Strawberry")).toBeInTheDocument();
      });

      it("closes the menu and displays the new selected option on click", async () => {
        const onChange = jest.fn();
        const { formData, schema, uiSchema } = select;
        render(
          <SpruceForm
            schema={schema}
            formData={formData}
            onChange={onChange}
            uiSchema={uiSchema}
          />
        );
        userEvent.click(screen.queryByRole("button"));
        userEvent.click(screen.queryByText("Chocolate"));
        await waitFor(() => {
          expect(screen.queryByText("Vanilla")).not.toBeInTheDocument();
        });
        expect(screen.getByText("Chocolate")).toBeInTheDocument();
        expect(screen.queryByText("Strawberry")).not.toBeInTheDocument();
      });

      it("disables options included in enumDisabled", async () => {
        const onChange = jest.fn();
        const { formData, schema, uiSchema } = select;
        render(
          <SpruceForm
            schema={schema}
            formData={formData}
            onChange={onChange}
            uiSchema={uiSchema}
          />
        );
        userEvent.click(screen.queryByRole("button"));

        // LeafyGreen doesn't label disabled options as such, so instead of checking for a property
        // ensure that the disabled element is not clickable.
        expect(
          screen.getByRole("option", {
            name: "Strawberry",
          })
        ).toHaveStyle("cursor: not-allowed");
      });
    });

    describe("radio group", () => {
      it("renders 3 inputs with the specified default selected", () => {
        const { formData, schema, uiSchema } = radioGroup;
        const onChange = jest.fn();
        render(
          <SpruceForm
            schema={schema}
            formData={formData}
            onChange={onChange}
            uiSchema={uiSchema}
          />
        );

        expect(screen.getAllByRole("radio")).toHaveLength(3);
        expect(screen.getByLabelText("New York")).toBeChecked();
      });

      it("disables options in enumDisabled", () => {
        const { formData, schema, uiSchema } = radioGroup;
        const onChange = jest.fn();
        render(
          <SpruceForm
            schema={schema}
            formData={formData}
            onChange={onChange}
            uiSchema={uiSchema}
          />
        );

        expect(screen.getByLabelText("Connecticut")).toBeDisabled();
      });

      it("shows option descriptions", () => {
        const { formData, schema, uiSchema } = radioGroup;
        const onChange = jest.fn();
        render(
          <SpruceForm
            schema={schema}
            formData={formData}
            onChange={onChange}
            uiSchema={uiSchema}
          />
        );

        expect(screen.getByText("The Garden State")).toBeVisible();
      });
    });
  });
});

const basicForm = {
  formData: {
    cloneMethod: "legacy-ssh",
    users: ["initial-user"],
    validProjects: "spruce",
  },
  schema: {
    properties: {
      access: {
        title: "Manage Access",
        type: "null" as "null",
      },
      cloneMethod: {
        enum: ["legacy-ssh", "oath-token"],
        enumNames: ["Legacy SSH", "Oath Token"],
        title: "Project Cloning Method",
        type: "string" as "string",
      },
      users: {
        items: {
          title: "Username Label",
          type: "string" as "string",
        },
        title: "Users",
        type: "array" as "array",
      },
      validProjects: {
        placeholder: "Sample input",
        title: "Valid Projects",
        type: "string" as "string",
      },
    },
    type: "object" as "object",
  },
  uiSchema: {
    access: {
      "ui:rootFieldId": "access",
      "ui:sectionTitle": true,
    },
    cloneMethod: {
      "ui:options": {
        label: false,
      },
    },
    users: {
      items: {
        "ui:ariaLabelledBy": "root_access",
        "ui:data-cy": "new-user-input",
      },
      "ui:addButtonText": "New User",
    },
    validProjects: {
      "ui:options": {
        "data-cy": "valid-projects-input",
        label: false,
      },
      "ui:widget": "textarea",
    },
  },
};

const textInput = (emptyValue?: string) => ({
  formData: {},
  schema: {
    properties: {
      textInput: {
        default: "",
        minLength: 1,
        title: "Text Input",
        type: "string" as "string",
      },
    },
    type: "object" as "object",
  },
  uiSchema: {
    textInput: {
      "ui:data-cy": "text-input",
      ...(emptyValue && { "ui:emptyValue": emptyValue }),
    },
  },
});

const textArea = (emptyValue?: string) => ({
  formData: {},
  schema: {
    properties: {
      textArea: {
        default: "",
        minLength: 1,
        title: "Text Area",
        type: "string" as "string",
      },
    },
    type: "object" as "object",
  },
  uiSchema: {
    textArea: {
      "ui:data-cy": "text-area",
      "ui:widget": "textarea",
      ...(emptyValue && { "ui:emptyValue": emptyValue }),
    },
  },
});

const select = {
  formData: {},
  schema: {
    properties: {
      iceCream: {
        default: "vanilla",
        oneOf: [
          {
            enum: ["vanilla"],
            title: "Vanilla",
            type: "string" as "string",
          },
          {
            enum: ["chocolate"],
            title: "Chocolate",
            type: "string" as "string",
          },
          {
            enum: ["strawberry"],
            title: "Strawberry",
            type: "string" as "string",
          },
        ],
        title: "Ice Cream",
        type: "string" as "string",
      },
    },
    type: "object" as "object",
  },
  uiSchema: {
    iceCream: {
      "ui:enumDisabled": ["strawberry"],
    },
  },
};

const radioGroup = {
  formData: {},
  schema: {
    properties: {
      states: {
        default: "ny",
        oneOf: [
          {
            enum: ["ny"],
            title: "New York",
            type: "string" as "string",
          },
          {
            description: "The Garden State",
            enum: ["nj"],
            title: "New Jersey",
            type: "string" as "string",
          },
          {
            enum: ["ct"],
            title: "Connecticut",
            type: "string" as "string",
          },
        ],
        title: "Tri-state Area",
        type: "string" as "string",
      },
    },
    type: "object" as "object",
  },
  uiSchema: {
    states: {
      "ui:enumDisabled": ["ct"],
      "ui:widget": "radio",
    },
  },
};
