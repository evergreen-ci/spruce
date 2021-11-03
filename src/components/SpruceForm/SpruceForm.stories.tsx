import { useState } from "react";
import { action } from "@storybook/addon-actions";
import { object } from "@storybook/addon-knobs";
import { SpruceForm, SpruceFormContainer } from ".";

export const Example1 = () => {
  const schema = object("schema", example1Def.schema);

  const uiSchema = object("uiSchema", example1Def.uiSchema);
  const defaultFormData = object("formData", example1Def.formData);
  const [formState, setFormState] = useState(defaultFormData);
  const onChange = (d) => {
    const { formData } = d;
    action("Change Form State")(formData);
    setFormState(formData);
  };
  return (
    <SpruceFormContainer title="Distro Projects">
      <SpruceForm
        schema={schema}
        uiSchema={uiSchema}
        onChange={onChange}
        formData={formState}
      />
    </SpruceFormContainer>
  );
};
export const Example2 = () => {
  const schema = object("schema", example2Def.schema);
  const uiSchema = object("uiSchema", example2Def.uiSchema);
  const defaultFormData = object("formData", example2Def.formData);

  const [formState, setFormState] = useState(defaultFormData);
  const onChange = (d) => {
    const { formData } = d;
    action("Change Form State")(formData);
    setFormState(formData);
  };
  return (
    <SpruceFormContainer title="Admin Options">
      <SpruceForm
        schema={schema}
        onChange={onChange}
        formData={formState}
        uiSchema={uiSchema}
      />
    </SpruceFormContainer>
  );
};
export default {
  title: "Spruce Form",
};

const example1Def = {
  schema: {
    type: "object" as "object",
    properties: {
      cloneMethod: {
        type: "string" as "string",
        title: "Project Cloning Method",
        enum: ["legacy-ssh", "oath-token"],
        enumNames: ["Legacy SSH", "Oath Token"],
      },
      expansions: {
        type: "array" as "array",
        title: "Expansions",
        items: {
          type: "object" as "object",
          properties: {
            key: {
              type: "string" as "string",
            },
            value: {
              type: "string" as "string",
            },
          },
        },
      },
      validProjects: {
        type: "string" as "string",
        title: "Valid Projects",
        placeholder: "Sample input",
      },
    },
  },
  uiSchema: {
    validProjects: {
      "ui:widget": "textarea",
      "ui:options": {
        rows: 5,
        label: false,
      },
    },
    cloneMethod: {
      "ui:options": {
        label: false,
      },
    },
  },
  formData: {
    cloneMethod: "legacy-ssh",
    expansions: [{ key: "Sample Input", value: "Sample Input" }],
  },
};

const example2Def = {
  schema: {
    type: "object" as "object",
    properties: {
      distroIsCluster: {
        type: "boolean" as "boolean",
        title:
          "Mark distro as a cluster (jobs are not run on this host, used for special purposes).",
      },
      disableShallowClone: {
        type: "boolean" as "boolean",
        title: "Disable shallow clone for this distro.",
      },
      disableQueue: {
        type: "boolean" as "boolean",
        title:
          "Disable queueing this distro. Tasks already in the task queue will be removed.",
      },
      decommissionHosts: {
        type: "boolean" as "boolean",
        title: "Decommission hosts of this distro for this update",
      },
      reprovisionMethod: {
        title: "",
        type: "string" as "string",
        enum: ["restartJasper", "reprovisionHosts"],
        enumNames: [
          "Restart Jasper service on running hosts of this distro for this update",
          "Reprovision running hosts of this distro for this update",
        ],
      },
    },
  },
  uiSchema: {
    reprovisionMethod: {
      "ui:widget": "radio",
      "ui:options": {
        label: false,
      },
    },
    "ui:options": {
      label: false,
    },
  },
  formData: {
    distroIsCluster: false,
    disableShallowClone: false,
    disableQueue: false,
    decommissionHosts: true,
  },
};
