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
        title: "New patch name",
        type: "string" as "string",
        default: name,
      },
    },
  },
  uiSchema: {
    newPatchName: {
      "ui:widget": LeafyGreenTextArea,
    },
  },
});
