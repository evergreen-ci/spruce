import { SpruceForm } from "components/SpruceForm";
import { render, screen, userEvent } from "test_utils";
import { FieldRow, CardFieldTemplate, AccordionFieldTemplate } from ".";

const ObjectSchema = {
  properties: {
    person: {
      properties: {
        age: {
          title: "Age",
          type: "integer" as "integer",
        },
        name: {
          title: "Name",
          type: "string" as "string",
        },
      },
      type: "object" as "object",
    },
  },
  type: "object" as "object",
};
describe("objectFieldTemplates", () => {
  describe("fieldRow", () => {
    const uiSchema = {
      person: {
        age: {
          "ui:data-cy": "age",
        },
        name: {
          "ui:data-cy": "name",
        },
        "ui:ObjectFieldTemplate": FieldRow,
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
    it("renders all fields", () => {
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

      expect(data).toStrictEqual({ person: { age: 32, name: "Bruce Lee" } });
    });
  });

  describe("cardFieldTemplate", () => {
    const uiSchema = {
      person: {
        age: {
          "ui:data-cy": "age",
        },
        name: {
          "ui:data-cy": "name",
        },
        "ui:ObjectFieldTemplate": CardFieldTemplate,
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

      expect(data).toStrictEqual({ person: { age: 32, name: "Bruce Lee" } });
    });
  });
  describe("accordionFieldTemplate", () => {
    const uiSchema = {
      person: {
        age: {
          "ui:data-cy": "age",
        },
        name: {
          "ui:data-cy": "name",
        },
        "ui:ObjectFieldTemplate": AccordionFieldTemplate,
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

      expect(data).toStrictEqual({ person: { age: 32, name: "Bruce Lee" } });
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
