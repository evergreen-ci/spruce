import { css } from "@emotion/react";
import { InlineCode } from "@leafygreen-ui/typography";
import { GetFormSchema } from "components/SpruceForm";
import {
  AccordionFieldTemplate,
  CardFieldTemplate,
  FieldRow,
} from "components/SpruceForm/FieldTemplates";
import { Arch, BootstrapMethod, Provider, SshKey } from "gql/generated/types";
import {
  architectureToCopy,
  bootstrapMethodToCopy,
  communicationMethodToCopy,
  feedbackRuleToCopy,
  hostAllocatorVersionToCopy,
  linuxArchitectures,
  nonWindowsArchitectures,
  overallocatedRuleToCopy,
  roundingRuleToCopy,
  windowsArchitectures,
} from "./constants";

type FormSchemaParams = {
  architecture: Arch;
  provider: Provider;
  sshKeys: SshKey[];
};

export const getFormSchema = ({
  architecture,
  provider,
  sshKeys,
}: FormSchemaParams): ReturnType<GetFormSchema> => {
  const hasStaticProvider = provider === Provider.Static;
  const hasDockerProvider = provider === Provider.Docker;
  const hasEC2Provider = !hasStaticProvider && !hasDockerProvider;

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
            setupAsSudo: {
              type: "boolean" as "boolean",
              title: "Run script as sudo",
            },
            setupScript: {
              type: "string" as "string",
              title: "Setup Script",
            },
            userSpawnAllowed: {
              type: "boolean" as "boolean",
              title: "Allow users to spawn these hosts for personal use",
            },
          },
          dependencies: {
            arch: {
              oneOf: [
                {
                  properties: {
                    arch: { enum: windowsArchitectures },
                    rootDir: {
                      type: "string" as "string",
                      title: "Root Directory",
                    },
                  },
                },
                {
                  properties: {
                    arch: { enum: nonWindowsArchitectures },
                  },
                },
              ],
            },
            userSpawnAllowed: {
              oneOf: [
                {
                  properties: {
                    userSpawnAllowed: { enum: [false] },
                  },
                },
                {
                  properties: {
                    userSpawnAllowed: { enum: [true] },
                    isVirtualWorkStation: {
                      type: "boolean" as "boolean",
                      title:
                        "Allow spawned hosts of this distro to be used as virtual workstations",
                    },
                  },
                  dependencies: {
                    isVirtualWorkStation: {
                      oneOf: [
                        {
                          properties: {
                            isVirtualWorkStation: {
                              enum: [false],
                            },
                          },
                        },
                        {
                          properties: {
                            isVirtualWorkStation: {
                              enum: [true],
                            },
                            icecreamSchedulerHost: {
                              type: "string" as "string",
                              title: "Icecream Scheduler Host",
                            },
                            icecreamConfigPath: {
                              type: "string" as "string",
                              title: "Icecream Config File Path",
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
      },
      dependencies: {
        setup: {
          oneOf: [
            {
              properties: {
                setup: {
                  properties: {
                    bootstrapMethod: { enum: [BootstrapMethod.LegacySsh] },
                  },
                },
                sshConfig: sshConfig(sshKeys),
                allocation,
              },
            },
            {
              properties: {
                setup: {
                  properties: {
                    bootstrapMethod: {
                      enum: [BootstrapMethod.Ssh, BootstrapMethod.UserData],
                    },
                  },
                },
                bootstrapSettings,
                sshConfig: sshConfig(sshKeys),
                allocation,
              },
            },
          ],
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
        setupAsSudo: {
          "ui:elementWrapperCSS": css`
            display: flex;
            justify-content: flex-end;
            margin-bottom: 0;
          `,
        },
        setupScript: {
          "ui:elementWrapperCSS": css`
            margin-top: -22px;
          `,
          "ui:widget": "textarea",
        },
        userSpawnAllowed: {
          ...(hasStaticProvider && {
            "ui:disabled": true,
            "ui:tooltipDescription": "Static distros are not spawnable.",
          }),
        },
      },
      bootstrapSettings: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        serviceUser: {
          // Only visible for Windows
          ...(!windowsArchitectures.includes(architecture) && {
            "ui:widget": "hidden",
          }),
        },
        resourceLimits: {
          // Only visible for Linux
          ...(!linuxArchitectures.includes(architecture) && {
            "ui:widget": "hidden",
          }),
        },
        env: {
          "ui:addButtonText": "Add variable",
          "ui:fullWidth": true,
          "ui:orderable": false,
          items: {
            "ui:ObjectFieldTemplate": FieldRow,
          },
        },
        preconditionScripts: {
          "ui:addButtonText": "Add script",
          "ui:fullWidth": true,
          "ui:orderable": false,
          "ui:topAlignDelete": true,
          items: {
            "ui:ObjectFieldTemplate": AccordionFieldTemplate,
            "ui:numberedTitle": "Precondition Script",
            path: {
              "ui:description":
                "Absolute path where the script will be placed.",
            },
            script: {
              "ui:description":
                "The precondition script that must run and succeed.",
              "ui:widget": "textarea",
            },
          },
        },
      },
      sshConfig: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        sshKey: {
          "ui:allowDeselect": false,
        },
        authorizedKeysFile: {
          "ui:data-cy": "authorized-keys-input",
          ...(!hasStaticProvider && { "ui:widget": "hidden" }),
        },
        sshOptions: {
          "ui:addButtonText": "Add SSH option",
          "ui:descriptionNode": (
            <>
              Option keywords supported by <InlineCode>ssh_config</InlineCode>.
            </>
          ),
          "ui:orderable": false,
          items: {
            "ui:placeholder": "ConnectTimeout=10",
          },
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
          ...(!hasEC2Provider && { "ui:widget": "hidden" }),
        },
        maximumHosts: {
          "ui:data-cy": "maximum-hosts-input",
          ...(!hasEC2Provider && { "ui:widget": "hidden" }),
        },
        acceptableHostIdleTime: {
          "ui:data-cy": "idle-time-input",
          ...(!hasEC2Provider && { "ui:widget": "hidden" }),
        },
        futureHostFraction: {
          "ui:data-cy": "future-fraction-input",
          ...(!hasEC2Provider && { "ui:widget": "hidden" }),
        },
      },
    },
  };
};

const bootstrapSettings = {
  type: "object" as "object",
  title: "Bootstrap Settings",
  properties: {
    jasperBinaryDir: {
      type: "string" as "string",
      title: "Jasper Binary Directory",
    },
    jasperCredentialsPath: {
      type: "string" as "string",
      title: "Jasper Credentials Path",
    },
    clientDir: {
      type: "string" as "string",
      title: "Client Directory",
    },
    shellPath: {
      type: "string" as "string",
      title: "Shell Path",
    },
    serviceUser: {
      type: "string" as "string",
      title: "Service User",
    },
    homeVolumeFormatCommand: {
      type: "string" as "string",
      title: "Home Volume Format Command",
    },
    resourceLimits: {
      type: "object" as "object",
      title: "Resource Limits",
      properties: {
        numFiles: {
          type: "number" as "number",
          title: "Number of Files",
        },
        numTasks: {
          type: "number" as "number",
          title: "Number of CGroup Tasks",
        },
        numProcesses: {
          type: "number" as "number",
          title: "Number of Processes",
        },
        lockedMemoryKb: {
          type: "number" as "number",
          title: "Locked Memory (kB)",
        },
        virtualMemoryKb: {
          type: "number" as "number",
          title: "Virtual Memory (kB)",
        },
      },
    },
    env: {
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
    preconditionScripts: {
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
  },
};

const enumSelect = (enumObject: Record<string, string>) =>
  Object.entries(enumObject).map(([key, title]) => ({
    type: "string" as "string",
    title,
    enum: [key],
  }));

const sshConfig = (sshKeys: SshKey[]) => ({
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
      oneOf: sshKeys.map(({ location, name }) => ({
        type: "string" as "string",
        title: `${name} – ${location}`,
        enum: [name],
      })),
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
        default: "",
        minLength: 1,
      },
    },
  },
});

const allocation = {
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
};
