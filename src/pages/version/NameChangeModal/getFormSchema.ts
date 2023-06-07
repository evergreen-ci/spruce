import { SpruceFormProps } from "components/SpruceForm/types";
import { LeafyGreenTextArea } from "components/SpruceForm/Widgets/LeafyGreenWidgets";

export const getFormSchema = (
  name: string
): {
  schema: SpruceFormProps["schema"];
  uiSchema: SpruceFormProps["uiSchema"];
} => ({
  schema: {
    type: "object" as "object",
    properties: {
      newPatchName: {
        title: "New Patch Name",
        type: "string" as "string",
        default: name,
        maxLength: 300,
        minLength: 1,
      },
    },
  },
  uiSchema: {
    newPatchName: {
      "ui:widget": "textarea",
      "ui:focusOnMount": true,
    },
  },
});
