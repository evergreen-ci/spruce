import { AccordionFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { GetFormSchema } from "pages/projectSettings/tabs/types";
import { ProjectType } from "pages/projectSettings/tabs/utils";

export const getFormSchema = (): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as "object",
    properties: {
      distro: {
        title: "Distro",
        type: "string",
      },
    },
  },
  uiSchema: {},
});
