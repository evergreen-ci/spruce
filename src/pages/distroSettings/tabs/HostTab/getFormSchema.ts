import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import {
  Arch,
  BootstrapMethod,
  CommunicationMethod,
  FeedbackRule,
  HostAllocatorVersion,
  OverallocatedRule,
  Provider,
  RoundingRule,
} from "gql/generated/types";

type FormSchemaParams = {
  provider: Provider;
};

export const getFormSchema = ({
  provider,
}: FormSchemaParams): ReturnType<GetFormSchema> => {
  const hasStaticProvider = provider === Provider.Static;
  const hasDockerProvider = provider === Provider.Docker;

  return {
    fields: {},
    schema: {
      type: "object" as "object",
      properties: {
        setup: {
          type: "object" as "object",
          title: "Host Setup",
          properties: {
            bootstrapMethod: {
              type: "string" as "string",
              title: "Host Bootstrap Method",
              oneOf: enumSelect(bootstrapMethodToCopy),
            },
            communicationMethod: {
              type: "string" as "string",
              title: "Host Communication Method",
              oneOf: enumSelect(communicationMethodToCopy),
            },
            arch: {
              type: "string" as "string",
              title: "Agent Architecture",
              oneOf: enumSelect(architectureToCopy),
            },
            workDir: {
              type: "string" as "string",
              title: "Working Directory",
            },
            setupScript: {
              type: "string" as "string",
              title: "Setup Script",
            },
            setupAsSudo: {
              type: "boolean" as "boolean",
              title: "Run script as sudo",
            },
          },
        },
        sshConfig: {
          type: "object" as "object",
          title: "SSH Configuration",
          properties: {
            user: {
              type: "string" as "string",
              title: "SSH User",
            },
            sshKey: {
              type: "string" as "string",
              title: "SSH Key",
            },
            authorizedKeysFile: {
              type: "string" as "string",
              title: "Authorized Keys File",
            },
            sshOptions: {
              type: "array" as "array",
              title: "SSH Options",
              items: {
                type: "string" as "string",
                title: "SSH Option",
              },
            },
          },
        },
        allocation: {
          type: "object" as "object",
          title: "Host Allocation",
          properties: {
            version: {
              type: "string" as "string",
              title: "Host Allocator Version",
              oneOf: enumSelect(hostAllocatorVersionToCopy),
            },
            roundingRule: {
              type: "string" as "string",
              title: "Host Allocator Rounding Rule",
              oneOf: enumSelect(roundingRuleToCopy),
            },
            feedbackRule: {
              type: "string" as "string",
              title: "Host Allocator Feedback Rule",
              oneOf: enumSelect(feedbackRuleToCopy),
            },
            hostsOverallocatedRule: {
              type: "string" as "string",
              title: "Host Overallocation Rule",
              oneOf: enumSelect(overallocatedRuleToCopy),
            },
            minimumHosts: {
              type: "number" as "number",
              title: "Minimum Number of Hosts Allowed",
              minimum: 0,
            },
            maximumHosts: {
              type: "number" as "number",
              title: "Maxiumum Number of Hosts Allowed",
              minimum: 0,
            },
            acceptableHostIdleTime: {
              type: "number" as "number",
              title: "Acceptable Host Idle Time (s)",
            },
            futureHostFraction: {
              type: "number" as "number",
              title: "Future Host Fraction",
              minimum: 0,
              maximum: 1,
            },
          },
        },
      },
    },
    uiSchema: {
      setup: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        bootstrapMethod: {
          "ui:allowDeselect": false,
        },
        communicationMethod: {
          "ui:allowDeselect": false,
        },
        arch: {
          "ui:allowDeselect": false,
        },
        setupScript: {
          "ui:widget": "textarea",
        },
      },
      sshConfig: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        authorizedKeysFile: {
          ...(!hasStaticProvider && { "ui:widget": "hidden" }),
        },
        sshOptions: {
          "ui:addButtonText": "Add SSH option",
          "ui:orderable": false,
        },
      },
      allocation: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        version: {
          "ui:allowDeselect": false,
        },
        roundingRule: {
          "ui:allowDeselect": false,
        },
        feedbackRule: {
          "ui:allowDeselect": false,
        },
        hostsOverallocatedRule: {
          "ui:allowDeselect": false,
        },
        minimumHosts: {
          "ui:data-cy": "minimum-hosts-input",
          ...((hasStaticProvider || hasDockerProvider) && {
            "ui:widget": "hidden",
          }),
        },
        maximumHosts: {
          "ui:data-cy": "maximum-hosts-input",
          ...((hasStaticProvider || hasDockerProvider) && {
            "ui:widget": "hidden",
          }),
        },
        acceptableHostIdleTime: {
          "ui:data-cy": "idle-time-input",
          ...((hasStaticProvider || hasDockerProvider) && {
            "ui:widget": "hidden",
          }),
        },
        futureHostFraction: {
          "ui:data-cy": "future-fraction-input",
          ...((hasStaticProvider || hasDockerProvider) && {
            "ui:widget": "hidden",
          }),
        },
      },
    },
  };
};

const enumSelect = (enumObject: Record<string, string>) =>
  Object.entries(enumObject).map(([value, title]) => ({
    type: "string" as "string",
    title,
    enum: [value],
  }));

const architectureToCopy = {
  [Arch.Linux_64Bit]: "Linux 64-bit",
  [Arch.LinuxArm_64Bit]: "Linux ARM 64-bit",
  [Arch.LinuxPpc_64Bit]: "Linux PowerPC 64-bit",
  [Arch.LinuxZseries]: "Linux zSeries",
  [Arch.Osx_64Bit]: "macOS 64-bit",
  [Arch.OsxArm_64Bit]: "macOS ARM 64-bit",
  [Arch.Windows_64Bit]: "Windows 64-bit",
};

const bootstrapMethodToCopy = {
  [BootstrapMethod.LegacySsh]: "Legacy SSH",
  [BootstrapMethod.Ssh]: "SSH",
  [BootstrapMethod.UserData]: "User Data",
};

const communicationMethodToCopy = {
  [CommunicationMethod.LegacySsh]: "Legacy SSH",
  [CommunicationMethod.Ssh]: "SSH",
  [CommunicationMethod.Rpc]: "RPC",
};

const hostAllocatorVersionToCopy = {
  [HostAllocatorVersion.Utilization]: "Utilization",
};

const roundingRuleToCopy = {
  [RoundingRule.Default]: "Default",
  [RoundingRule.Down]: "Round down",
  [RoundingRule.Up]: "Round up",
};

const feedbackRuleToCopy = {
  [FeedbackRule.Default]: "Default",
  [FeedbackRule.NoFeedback]: "No feedback",
  [FeedbackRule.WaitsOverThresh]: "Wait over threshold",
};

const overallocatedRuleToCopy = {
  [OverallocatedRule.Default]: "Default",
  [OverallocatedRule.Ignore]: "No terminations when overallocated",
  [OverallocatedRule.Terminate]: "Terminate hosts when overallocated",
};
