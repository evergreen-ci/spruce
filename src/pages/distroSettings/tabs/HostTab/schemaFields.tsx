import { css } from "@emotion/react";
import { InlineCode } from "@leafygreen-ui/typography";
import {
  AccordionFieldTemplate,
  FieldRow,
} from "components/SpruceForm/FieldTemplates";
import { size } from "constants/tokens";
import { Arch, SshKey } from "gql/generated/types";
import {
  architectureToCopy,
  bootstrapMethodToCopy,
  communicationMethodToCopy,
  feedbackRuleToCopy,
  hostAllocatorVersionToCopy,
  linuxArchitectures,
  overallocatedRuleToCopy,
  roundingRuleToCopy,
  windowsArchitectures,
} from "./constants";

const indentCSS = css`
  margin-left: ${size.m};
`;

const enumSelect = (enumObject: Record<string, string>) =>
  Object.entries(enumObject).map(([key, title]) => ({
    type: "string" as "string",
    title,
    enum: [key],
  }));

export const bootstrapMethod = {
  schema: {
    type: "string" as "string",
    title: "Host Bootstrap Method",
    oneOf: enumSelect(bootstrapMethodToCopy),
  },
  uiSchema: {
    "ui:allowDeselect": false,
  },
};

export const communicationMethod = {
  schema: {
    type: "string" as "string",
    title: "Host Communication Method",
    oneOf: enumSelect(communicationMethodToCopy),
  },
  uiSchema: {
    "ui:allowDeselect": false,
  },
};

export const arch = {
  schema: {
    type: "string" as "string",
    title: "Agent Architecture",
    oneOf: enumSelect(architectureToCopy),
  },
  uiSchema: {
    "ui:allowDeselect": false,
  },
};

export const workDir = {
  schema: {
    type: "string" as "string",
    title: "Working Directory",
    minLength: 1,
  },
  uiSchema: {
    "ui:description":
      "Absolute path in which the agent run tasks on the host machine",
  },
};

export const setupAsSudo = {
  schema: {
    type: "boolean" as "boolean",
    title: "Run script as sudo",
  },
  uiSchema: {
    "ui:elementWrapperCSS": css`
      display: flex;
      justify-content: flex-end;
      margin-bottom: 0;
    `,
  },
};

export const setupScript = {
  schema: {
    type: "string" as "string",
    title: "Setup Script",
  },
  uiSchema: {
    "ui:elementWrapperCSS": css`
      margin-top: -22px;
    `,
    "ui:widget": "textarea",
  },
};

export const userSpawnAllowed = {
  schema: {
    type: "boolean" as "boolean",
    title: "Spawnable",
  },
  uiSchema: (hasStaticProvider: boolean) => ({
    ...(hasStaticProvider && {
      "ui:disabled": true,
      "ui:tooltipDescription": "Static distros are not spawnable.",
    }),
    "ui:description": "Allow users to spawn these hosts for personal use.",
    "ui:bold": true,
  }),
};

export const isVirtualWorkStation = {
  schema: {
    type: "boolean" as "boolean",
    title: "Virtual Workstations",
  },
  uiSchema: (architecture: Arch) => ({
    ...(!linuxArchitectures.includes(architecture) && {
      "ui:disabled": true,
      "ui:tooltipDescription":
        "Only Linux distros may be configured as virtual workstations.",
    }),

    "ui:description":
      "Allow spawned hosts of this distro to be used as virtual workstations.",
    "ui:bold": true,
  }),
};

export const icecreamSchedulerHost = {
  schema: {
    type: "string" as "string",
    title: "Icecream Scheduler Host",
  },
  uiSchema: {
    "ui:elementWrapperCSS": indentCSS,
  },
};

export const icecreamConfigPath = {
  schema: {
    type: "string" as "string",
    title: "Icecream Config File Path",
  },
  uiSchema: {
    "ui:elementWrapperCSS": indentCSS,
  },
};

export const rootDir = {
  schema: {
    type: "string" as "string",
    title: "Root Directory",
  },
  uiSchema: {},
};

export const serviceUser = {
  schema: {
    type: "string" as "string",
    title: "Service User",
  },
  uiSchema: (architecture: Arch) => ({
    "ui:description": "Username for setting up Evergreen services",
    // Only visible for Windows
    ...(!windowsArchitectures.includes(architecture) && {
      "ui:widget": "hidden",
    }),
  }),
};

export const jasperBinaryDir = {
  schema: {
    type: "string" as "string",
    title: "Jasper Binary Directory",
    minLength: 1,
  },
  uiSchema: {
    "ui:description":
      "Absolute native path to the directory containing the Jasper binary",
  },
};

export const jasperCredentialsPath = {
  schema: {
    type: "string" as "string",
    title: "Jasper Credentials Path",
    minLength: 1,
  },
  uiSchema: {
    "ui:description":
      "Absolute native path to the directory containing the Jasper credentials",
  },
};

export const clientDir = {
  schema: {
    type: "string" as "string",
    title: "Client Directory",
    minLength: 1,
  },
  uiSchema: {
    "ui:description":
      "Absolute native path to the directory containing the evergreen binary",
  },
};

export const shellPath = {
  schema: {
    type: "string" as "string",
    title: "Shell Path",
    minLength: 1,
  },
  uiSchema: {
    "ui:description": "Absolute native path to the shell binary file (bash)",
  },
};

export const homeVolumeFormatCommand = {
  schema: {
    type: "string" as "string",
    title: "Home Volume Format Command",
  },
  uiSchema: {},
};

export const numFiles = {
  schema: {
    type: "number" as "number",
    title: "Number of Files",
    minimum: -1,
  },
  uiSchema: {
    "ui:description": "Max number of open file handles. Set -1 for unlimited.",
  },
};

export const numTasks = {
  schema: {
    type: "number" as "number",
    title: "Number of CGroup Tasks",
    minimum: -1,
  },
  uiSchema: {
    "ui:description":
      "Max number of cgroup tasks (threads). Set -1 for unlimited.",
  },
};

export const numProcesses = {
  schema: {
    type: "number" as "number",
    title: "Number of Processes",
    minimum: -1,
  },
  uiSchema: {
    "ui:description": "Max number of processes. Set -1 for unlimited.",
  },
};

export const lockedMemoryKb = {
  schema: {
    type: "number" as "number",
    title: "Locked Memory",
    minimum: -1,
  },
  uiSchema: {
    "ui:description":
      "Max size (kB) that can be locked into memory. Set -1 for unlimited.",
  },
};

export const virtualMemoryKb = {
  schema: {
    type: "number" as "number",
    title: "Virtual Memory (kB)",
    minimum: -1,
  },
  uiSchema: {
    "ui:description":
      "Max size (kB) of available virtual memory. Set -1 for unlimited.",
  },
};

export const env = {
  schema: {
    type: "array" as "array",
    title: "Environment Variables",
    items: {
      type: "object" as "object",
      properties: {
        key: {
          type: "string" as "string",
          title: "Key",
          default: "",
          minLength: 1,
        },
        value: {
          type: "string" as "string",
          title: "Value",
          default: "",
          minLength: 1,
        },
      },
    },
  },
  uiSchema: {
    "ui:addButtonText": "Add variable",
    "ui:fullWidth": true,
    "ui:orderable": false,
    items: {
      "ui:ObjectFieldTemplate": FieldRow,
    },
  },
};

export const preconditionScripts = {
  schema: {
    type: "array" as "array",
    title: "Precondition Scripts",
    items: {
      type: "object" as "object",
      properties: {
        path: {
          type: "string" as "string",
          title: "Path",
          default: "",
          minLength: 1,
        },
        script: {
          type: "string" as "string",
          title: "Script",
          default: "",
          minLength: 1,
        },
      },
    },
  },
  uiSchema: {
    "ui:addButtonText": "Add script",
    "ui:fullWidth": true,
    "ui:orderable": false,
    "ui:topAlignDelete": true,
    items: {
      "ui:ObjectFieldTemplate": AccordionFieldTemplate,
      "ui:numberedTitle": "Precondition Script",
      path: {
        "ui:description": "Absolute path where the script will be placed.",
      },
      script: {
        "ui:description":
          "The precondition script that must run and succeed before Jasper can start.",
        "ui:widget": "textarea",
      },
    },
  },
};

export const user = {
  schema: {
    type: "string" as "string",
    title: "SSH User",
    minLength: 1,
  },
  uiSchema: {
    "ui:description": "Username with which to SSH into host machine",
  },
};

export const sshKey = {
  schema: (sshKeys: SshKey[]) => ({
    type: "string" as "string",
    title: "SSH Key",
    oneOf: sshKeys.map(({ location, name }) => ({
      type: "string" as "string",
      title: `${name} – ${location}`,
      enum: [name],
    })),
  }),
  uiSchema: {
    "ui:allowDeselect": false,
  },
};

export const authorizedKeysFile = {
  schema: {
    type: "string" as "string",
    title: "Authorized Keys File",
  },
  uiSchema: (hasStaticProvider: boolean) => ({
    "ui:data-cy": "authorized-keys-input",
    ...(!hasStaticProvider && { "ui:widget": "hidden" }),
  }),
};

export const sshOptions = {
  schema: {
    type: "array" as "array",
    title: "SSH Options",
    items: {
      type: "string" as "string",
      title: "SSH Option",
      default: "",
      minLength: 1,
    },
  },
  uiSchema: {
    "ui:addButtonText": "Add SSH option",
    "ui:description": (
      <>
        Specify option keywords supported by <InlineCode>ssh_config</InlineCode>
        .
      </>
    ),
    "ui:orderable": false,
    items: {
      "ui:placeholder": "ConnectTimeout=10",
    },
  },
};

export const version = {
  schema: {
    type: "string" as "string",
    title: "Host Allocator Version",
    oneOf: enumSelect(hostAllocatorVersionToCopy),
  },
  uiSchema: {
    "ui:allowDeselect": false,
  },
};

export const roundingRule = {
  schema: {
    type: "string" as "string",
    title: "Host Allocator Rounding Rule",
    oneOf: enumSelect(roundingRuleToCopy),
  },
  uiSchema: {
    "ui:allowDeselect": false,
  },
};

export const feedbackRule = {
  schema: {
    type: "string" as "string",
    title: "Host Allocator Feedback Rule",
    oneOf: enumSelect(feedbackRuleToCopy),
  },
  uiSchema: {
    "ui:allowDeselect": false,
  },
};

export const hostsOverallocatedRule = {
  schema: {
    type: "string" as "string",
    title: "Host Overallocation Rule",
    oneOf: enumSelect(overallocatedRuleToCopy),
  },
  uiSchema: {
    "ui:allowDeselect": false,
  },
};

export const minimumHosts = {
  schema: {
    type: "number" as "number",
    title: "Minimum Number of Hosts Allowed",
    minimum: 0,
  },
  uiSchema: (hasEC2Provider: boolean) => ({
    "ui:data-cy": "minimum-hosts-input",
    ...(!hasEC2Provider && { "ui:widget": "hidden" }),
  }),
};

export const maximumHosts = {
  schema: {
    type: "number" as "number",
    title: "Maxiumum Number of Hosts Allowed",
    minimum: 0,
  },
  uiSchema: (hasEC2Provider: boolean) => ({
    "ui:data-cy": "maximum-hosts-input",
    ...(!hasEC2Provider && { "ui:widget": "hidden" }),
  }),
};

export const acceptableHostIdleTime = {
  schema: {
    type: "number" as "number",
    title: "Acceptable Host Idle Time (s)",
    minimum: 0,
  },
  uiSchema: (hasEC2Provider: boolean) => ({
    "ui:data-cy": "idle-time-input",
    "ui:description": "Set 0 to use global default.",
    ...(!hasEC2Provider && { "ui:widget": "hidden" }),
  }),
};

export const futureHostFraction = {
  schema: {
    type: "number" as "number",
    title: "Future Host Fraction",
    minimum: 0,
    maximum: 1,
  },
  uiSchema: (hasEC2Provider: boolean) => ({
    "ui:data-cy": "future-fraction-input",
    "ui:description": "Set 0 to use global default.",
    ...(!hasEC2Provider && { "ui:widget": "hidden" }),
  }),
};
