import { ValidateProps } from "components/SpruceForm";
import { render, screen, userEvent } from "test_utils";
import { Form, FormProps } from "./Form";
import {
  FormStateMap,
  initialData,
  TestProvider,
  TestRoutes,
  usePopulateForm,
  useTestContext,
} from "./test-utils";

type ComponentProps = FormProps<TestRoutes, FormStateMap>;

const Component: React.FC<{
  disabled?: ComponentProps["disabled"];
  tab?: ComponentProps["tab"];
  validate?: ComponentProps["validate"];
}> = ({ disabled = false, tab = "foo", validate }) => {
  const state = useTestContext();
  usePopulateForm(initialData[tab], tab);

  return (
    <Form
      disabled={disabled}
      formSchema={formSchema[tab]}
      state={state}
      tab={tab}
      validate={validate}
    />
  );
};

describe("context-based form", () => {
  it("should render the form with the initial data", () => {
    render(<Component />, {
      wrapper: TestProvider,
    });
    expect(screen.getByText("Caps Lock Enabled")).toBeInTheDocument();
    expect(screen.getByLabelText("Caps Lock Enabled")).toBeChecked();
  });

  it("updates the data", async () => {
    const user = userEvent.setup();
    render(<Component />, {
      wrapper: TestProvider,
    });
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
    await user.click(screen.getByText("Caps Lock Enabled"));
    expect(checkbox).not.toBeChecked();
  });

  it("applies a validate function that shows an error message", async () => {
    const user = userEvent.setup();
    render(<Component tab="bar" validate={barValidator} />, {
      wrapper: TestProvider,
    });
    await user.clear(screen.getByLabelText("Age"));
    expect(screen.getByLabelText("Age")).toHaveValue("");
    expect(screen.queryByText("Invalid Age!")).not.toBeInTheDocument();
    await user.type(screen.getByLabelText("Age"), "30");
    expect(screen.getByText("Invalid Age!")).toBeInTheDocument();
  });

  it("disables the entire form when specified", () => {
    render(<Component tab="bar" disabled />, {
      wrapper: TestProvider,
    });
    expect(screen.getByLabelText("Name")).toBeDisabled();
    expect(screen.getByLabelText("Age")).toBeDisabled();
  });
});

const barValidator = ((formData, errors) => {
  if (formData.age === 30) {
    errors.age.addError("Invalid Age!");
  }
  return errors;
}) satisfies ValidateProps<FormStateMap["bar"]>;

const formSchema = {
  foo: {
    fields: {},
    schema: {
      type: "object" as "object",
      title: "Test Form",
      properties: {
        capsLockEnabled: {
          type: "boolean" as "boolean",
          title: "Caps Lock Enabled",
        },
      },
    },
    uiSchema: {},
  },
  bar: {
    fields: {},
    schema: {
      type: "object" as "object",
      title: "Add User",
      properties: {
        name: {
          type: "string" as "string",
          title: "Name",
        },
        age: {
          type: "number" as "number",
          title: "Age",
        },
      },
    },
    uiSchema: {},
  },
};
