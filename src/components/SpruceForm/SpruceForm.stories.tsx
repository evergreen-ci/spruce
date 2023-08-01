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
    expansions: {
      items: {
        "ui:label": false,
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

const example3Def = {
  schema: {
    type: "object" as "object",
    properties: {
      invisible: {
        type: "object" as "object",
        title: "Invisible",
        description: "This field should be invisible",
        properties: {
          child: {
            type: "string" as "string",
            title: "And so should its children",
          },
        },
      },
      visible: {
        title: "This is the only visible page element",
        type: "boolean" as "boolean",
      },
    },
  },
  uiSchema: {
    invisible: {
      "ui:widget": "hidden",
    },
  },
  formData: {
    visible: true,
  },
};
