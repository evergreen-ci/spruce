import { SpruceForm } from "components/SpruceForm";
import {
  useProjectSettingsContext,
  usePopulateForm,
} from "context/project-settings";
import { TabProps } from "./utils";

export const GeneralTab: React.FC<TabProps> = ({ tab }) => {
  const { getTabFormState, updateForm } = useProjectSettingsContext();
  const currentFormState = getTabFormState(tab);

  // Call this hook after getting data via GraphQL. For now, use dummy data from the object below.
  usePopulateForm({ ...example1Def.formData, ...example2Def.formData }, tab);

  return (
    <>
      <SpruceForm
        formData={currentFormState}
        onChange={({ formData }) => {
          updateForm(tab, formData);
        }}
        schema={example1Def.schema}
        title="General Configuration"
        uiSchema={example1Def.uiSchema}
      />
      <SpruceForm
        formData={currentFormState}
        onChange={({ formData }) => {
          updateForm(tab, formData);
        }}
        schema={example2Def.schema}
        title="Project Flags"
        uiSchema={example2Def.uiSchema}
      />
    </>
  );
};

const example1Def = {
  schema: {
    type: "object" as "object",
    properties: {
      foo: {
        type: "string" as "string",
        title: "Test Form",
      },
    },
  },
  uiSchema: {
    foo: {
      "ui:widget": "textarea",
      "ui:options": {
        rows: 5,
        label: false,
      },
    },
  },
  formData: {
    foo: "This data will be loaded via GraphQL",
  },
};

const example2Def = {
  schema: {
    type: "object" as "object",
    properties: {
      bar: {
        type: "string" as "string",
        title: "Test Form 2",
      },
    },
  },
  uiSchema: {
    bar: {
      "ui:widget": "textarea",
      "ui:options": {
        rows: 5,
        label: false,
      },
    },
  },
  formData: {
    bar: "More data loaded via GraphQL",
  },
};
