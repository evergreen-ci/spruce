import { fireEvent, render, screen, userEvent, waitFor } from "test_utils";
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
    fireEvent.change(screen.queryByDataCy("valid-projects-input"), {
      target: { value: "new value" },
    });
    userEvent.click(screen.queryByDataCy("add-button"));
    await waitFor(() =>
      expect(screen.queryAllByDataCy("new-user-input")).toHaveLength(2)
    );
    fireEvent.change(screen.queryAllByDataCy("new-user-input")[0], {
      target: { value: "new-user" },
    });
    // eslint-disable-next-line jest/prefer-called-with
    expect(onChange).toHaveBeenCalled();
    expect(screen.queryByDataCy("valid-projects-input")).toHaveValue(
      "new value"
    );
    expect(data).toStrictEqual({
      ...basicForm.formData,
      access: null,
      validProjects: "new value",
      users: ["new-user", "initial-user"],
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
          fireEvent.change(screen.queryByDataCy("text-input"), {
            target: { value: "new value" },
          });
          fireEvent.change(screen.queryByDataCy("text-input"), {
            target: { value: "" },
          });
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
          fireEvent.change(screen.queryByDataCy("text-input"), {
            target: { value: "new value" },
          });
          fireEvent.change(screen.queryByDataCy("text-input"), {
            target: { value: "" },
          });
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
          fireEvent.change(screen.queryByDataCy("text-input"), {
            target: { value: "new value" },
          });
          fireEvent.change(screen.queryByDataCy("text-input"), {
            target: { value: "" },
          });
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
          fireEvent.change(screen.queryByDataCy("text-area"), {
            target: { value: "new value" },
          });
          fireEvent.change(screen.queryByDataCy("text-area"), {
            target: { value: "" },
          });
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
          fireEvent.change(screen.queryByDataCy("text-area"), {
            target: { value: "new value" },
          });
          fireEvent.change(screen.queryByDataCy("text-area"), {
            target: { value: "" },
          });
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
          fireEvent.change(screen.queryByDataCy("text-area"), {
            target: { value: "new value" },
          });
          fireEvent.change(screen.queryByDataCy("text-area"), {
            target: { value: "" },
          });
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
        // attempt to click on the disabled option and verify that the dropdown doesn't close as a result.
        userEvent.click(screen.queryByText("Strawberry"));
        await waitFor(() => {
          expect(screen.queryAllByText("Vanilla")).toHaveLength(2);
        });
        expect(screen.getByText("Chocolate")).toBeInTheDocument();
        expect(screen.getByText("Strawberry")).toBeInTheDocument();
      });
    });
  });
});

const basicForm = {
  formData: {
    cloneMethod: "legacy-ssh",
    validProjects: "spruce",
    users: ["initial-user"],
  },
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

const textInput = (emptyValue?: string) => ({
  formData: {},
  schema: {
    type: "object" as "object",
    properties: {
      textInput: {
        type: "string" as "string",
        title: "Text Input",
        default: "",
        minLength: 1,
      },
    },
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
    type: "object" as "object",
    properties: {
      textArea: {
        type: "string" as "string",
        title: "Text Area",
        default: "",
        minLength: 1,
      },
    },
  },
  uiSchema: {
    textArea: {
      "ui:widget": "textarea",
      "ui:data-cy": "text-area",
      ...(emptyValue && { "ui:emptyValue": emptyValue }),
    },
  },
});

const select = {
  formData: {},
  schema: {
    type: "object" as "object",
    properties: {
      iceCream: {
        type: "string" as "string",
        title: "Ice Cream",
        default: "vanilla",
        oneOf: [
          {
            type: "string" as "string",
            title: "Vanilla",
            enum: ["vanilla"],
          },
          {
            type: "string" as "string",
            title: "Chocolate",
            enum: ["chocolate"],
          },
          {
            type: "string" as "string",
            title: "Strawberry",
            enum: ["strawberry"],
          },
        ],
      },
    },
  },
  uiSchema: {
    iceCream: {
      "ui:enumDisabled": ["strawberry"],
    },
  },
};
