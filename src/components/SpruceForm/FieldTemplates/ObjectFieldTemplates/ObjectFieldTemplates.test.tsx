import { SpruceForm } from "components/SpruceForm";
import { render, screen, userEvent } from "test_utils";
import { FieldRow, CardFieldTemplate, AccordionFieldTemplate } from ".";

const ObjectSchema = {
  type: "object" as "object",
  properties: {
    person: {
      type: "object" as "object",
      properties: {
        name: {
          type: "string" as "string",
          title: "Name",
        },
        age: {
          type: "integer" as "integer",
          title: "Age",
        },
      },
    },
  },
};
describe("objectFieldTemplates", () => {
  describe("fieldRow", () => {
    const uiSchema = {
      person: {
        "ui:ObjectFieldTemplate": FieldRow,
        name: {
          "ui:data-cy": "name",
        },
        age: {
          "ui:data-cy": "age",
        },
      },
    };
    it("applies data-cy attributes", () => {
      const onChange = jest.fn();
      render(
        <SpruceForm
          schema={ObjectSchema}
          formData={{ person: { name: "", age: "" } }}
          onChange={onChange}
          uiSchema={uiSchema}
        />
      );
      expect(screen.getByDataCy("name")).toBeInTheDocument();
    });
    it("renders all fields", () => {
      const onChange = jest.fn();
      render(
        <SpruceForm
          schema={ObjectSchema}
          formData={{ person: { name: "", age: "" } }}
          onChange={onChange}
          uiSchema={uiSchema}
        />
      );
      expect(screen.getByDataCy("name")).toBeInTheDocument();
      expect(screen.getByDataCy("age")).toBeInTheDocument();
    });
    it("calls onChange when a field is changed", () => {
      let data;
      const onChange = jest.fn(({ formData }) => {
        data = formData;
      });
      render(
        <SpruceForm
          schema={ObjectSchema}
          formData={{ person: { name: "", age: "" } }}
          onChange={onChange}
          uiSchema={uiSchema}
        />
      );
      userEvent.type(screen.getByDataCy("name"), "Bruce Lee");
      userEvent.type(screen.getByDataCy("age"), "32");

      expect(data).toStrictEqual({ person: { name: "Bruce Lee", age: 32 } });
    });
  });

  describe("cardFieldTemplate", () => {
    const uiSchema = {
      person: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        name: {
          "ui:data-cy": "name",
        },
        age: {
          "ui:data-cy": "age",
        },
      },
    };
    it("applies data-cy attributes", () => {
      const onChange = jest.fn();
      render(
        <SpruceForm
          schema={ObjectSchema}
          formData={{}}
          onChange={onChange}
          uiSchema={uiSchema}
        />
      );
      expect(screen.getByDataCy("name")).toBeInTheDocument();
    });
    it("renders all fields in a card", () => {
      const onChange = jest.fn();
      render(
        <SpruceForm
          schema={ObjectSchema}
          formData={{}}
          onChange={onChange}
          uiSchema={uiSchema}
        />
      );
      expect(screen.getByDataCy("name")).toBeInTheDocument();
      expect(screen.getByDataCy("age")).toBeInTheDocument();
    });
    it("calls onChange when a field is changed", () => {
      let data;
      const onChange = jest.fn(({ formData }) => {
        data = formData;
      });
      render(
        <SpruceForm
          schema={ObjectSchema}
          formData={{}}
          onChange={onChange}
          uiSchema={uiSchema}
        />
      );
      userEvent.type(screen.getByDataCy("name"), "Bruce Lee");
      userEvent.type(screen.getByDataCy("age"), "32");

      expect(data).toStrictEqual({ person: { name: "Bruce Lee", age: 32 } });
    });
  });
  describe("accordionFieldTemplate", () => {
    const uiSchema = {
      person: {
        "ui:ObjectFieldTemplate": AccordionFieldTemplate,
        name: {
          "ui:data-cy": "name",
        },
        age: {
          "ui:data-cy": "age",
        },
      },
    };
    it("applies data-cy attributes", () => {
      const onChange = jest.fn();
      render(
        <SpruceForm
          schema={ObjectSchema}
          formData={{}}
          onChange={onChange}
          uiSchema={uiSchema}
        />
      );
      expect(screen.getByDataCy("name")).toBeInTheDocument();
    });
    it("renders all fields in an accordion", () => {
      const onChange = jest.fn();
      render(
        <SpruceForm
          schema={ObjectSchema}
          formData={{}}
          onChange={onChange}
          uiSchema={uiSchema}
        />
      );
      expect(screen.getByDataCy("name")).toBeInTheDocument();
      expect(screen.getByDataCy("age")).toBeInTheDocument();
    });
    it("calls onChange when a field is changed", () => {
      let data;
      const onChange = jest.fn(({ formData }) => {
        data = formData;
      });
      render(
        <SpruceForm
          schema={ObjectSchema}
          formData={{}}
          onChange={onChange}
          uiSchema={uiSchema}
        />
      );
      userEvent.type(screen.getByDataCy("name"), "Bruce Lee");
      userEvent.type(screen.getByDataCy("age"), "32");

      expect(data).toStrictEqual({ person: { name: "Bruce Lee", age: 32 } });
    });
    it("accordion is expanded by default", () => {
      const onChange = jest.fn();
      render(
        <SpruceForm
          schema={ObjectSchema}
          formData={{}}
          onChange={onChange}
          uiSchema={uiSchema}
        />
      );
      expect(
        screen.queryByDataCy("accordion-collapse-container")
      ).toHaveAttribute("aria-expanded", "true");
    });
    it("accordion is collapsed by default if defaultOpen is false", () => {
      const onChange = jest.fn();
      render(
        <SpruceForm
          schema={ObjectSchema}
          formData={{}}
          onChange={onChange}
          uiSchema={{
            ...uiSchema,
            person: { ...uiSchema.person, "ui:defaultOpen": false },
          }}
        />
      );
      expect(
        screen.queryByDataCy("accordion-collapse-container")
      ).toHaveAttribute("aria-expanded", "false");
    });
  });
});
