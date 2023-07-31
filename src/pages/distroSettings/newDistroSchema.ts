export const modalFormDefinition = {
  initialFormData: {
    newDistroId: "",
  },
  schema: {
    type: "object" as "object",
    properties: {
      newDistroId: {
        type: "string" as "string",
        title: "Distro ID",
        format: "noSpaces",
        minLength: 1,
      },
    },
  },
  uiSchema: {
    newDistroId: {
      "ui:data-cy": "distro-id-input",
    },
  },
};
