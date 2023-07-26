import { useState } from "react";
import { action } from "@storybook/addon-actions";
import { CustomStoryObj, CustomMeta } from "test_utils/types";

import { SpruceForm, SpruceFormContainer } from ".";

export default {
  component: SpruceForm,
} satisfies CustomMeta<typeof SpruceForm>;

export const Example1: CustomStoryObj<typeof SpruceForm> = {
  render: () => (
    <BaseForm
      title="Distro Projects"
      data={example1Def.formData}
      schema={example1Def.schema}
      uiSchema={example1Def.uiSchema}
    />
  ),
};

export const Example2: CustomStoryObj<typeof SpruceForm> = {
  render: () => (
    <BaseForm
      title="Admin Options"
      data={example2Def.formData}
      schema={example2Def.schema}
      uiSchema={example2Def.uiSchema}
    />
  ),
};

export const Example3: CustomStoryObj<typeof SpruceForm> = {
  render: () => (
    <BaseForm
      title="UI Options"
      data={example3Def.formData}
      schema={example3Def.schema}
      uiSchema={example3Def.uiSchema}
    />
  ),
};

const BaseForm = ({ data, schema, title, uiSchema }) => {
  const [formState, setFormState] = useState(data);
  const onChange = (d) => {
    const { formData } = d;
    action("Change Form State")(formData);
    setFormState(formData);
  };
  return (
    <SpruceFormContainer title={title}>
      <SpruceForm
        schema={schema}
        uiSchema={uiSchema}
        onChange={onChange}
        formData={formState}
      />
    </SpruceFormContainer>
  );
};

const example1Def = {
  formData: {
    cloneMethod: "legacy-ssh",
    expansions: [{ key: "Sample Input", value: "Sample Input" }],
  },
  schema: {
    properties: {
      cloneMethod: {
        enum: ["legacy-ssh", "oath-token"],
        enumNames: ["Legacy SSH", "Oath Token"],
        title: "Project Cloning Method",
        type: "string" as "string",
      },
      expansions: {
        items: {
          properties: {
            key: {
              type: "string" as "string",
            },
            value: {
              type: "string" as "string",
            },
          },
          type: "object" as "object",
        },
        title: "Expansions",
        type: "array" as "array",
      },
      validProjects: {
        placeholder: "Sample input",
        title: "Valid Projects",
        type: "string" as "string",
      },
    },
    type: "object" as "object",
  },
  uiSchema: {
    cloneMethod: {
      "ui:options": {
        label: false,
      },
    },
    validProjects: {
      "ui:options": {
        label: false,
        rows: 5,
      },
      "ui:widget": "textarea",
    },
  },
};

const example2Def = {
  formData: {
    decommissionHosts: true,
    disableQueue: false,
    disableShallowClone: false,
    distroIsCluster: false,
  },
  schema: {
    properties: {
      decommissionHosts: {
        title: "Decommission hosts of this distro for this update",
        type: "boolean" as "boolean",
      },
      disableQueue: {
        title:
          "Disable queueing this distro. Tasks already in the task queue will be removed.",
        type: "boolean" as "boolean",
      },
      disableShallowClone: {
        title: "Disable shallow clone for this distro.",
        type: "boolean" as "boolean",
      },
      distroIsCluster: {
        title:
          "Mark distro as a cluster (jobs are not run on this host, used for special purposes).",
        type: "boolean" as "boolean",
      },
      reprovisionMethod: {
        enum: ["restartJasper", "reprovisionHosts"],
        enumNames: [
          "Restart Jasper service on running hosts of this distro for this update",
          "Reprovision running hosts of this distro for this update",
        ],
        title: "",
        type: "string" as "string",
      },
    },
    type: "object" as "object",
  },
  uiSchema: {
    reprovisionMethod: {
      "ui:options": {
        label: false,
      },
      "ui:widget": "radio",
    },
    "ui:options": {
      label: false,
    },
  },
};

const example3Def = {
  formData: {
    visible: true,
  },
  schema: {
    properties: {
      invisible: {
        description: "This field should be invisible",
        properties: {
          child: {
            title: "And so should its children",
            type: "string" as "string",
          },
        },
        title: "Invisible",
        type: "object" as "object",
      },
      visible: {
        title: "This is the only visible page element",
        type: "boolean" as "boolean",
      },
    },
    type: "object" as "object",
  },
  uiSchema: {
    invisible: {
      "ui:widget": "hidden",
    },
  },
};
