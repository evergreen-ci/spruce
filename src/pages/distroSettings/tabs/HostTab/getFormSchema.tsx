import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import { Arch, BootstrapMethod, Provider, SshKey } from "gql/generated/types";
import {
  linuxArchitectures,
  nonWindowsArchitectures,
  windowsArchitectures,
} from "./constants";
import {
  acceptableHostIdleTime,
  arch,
  authorizedKeysFile,
  bootstrapMethod,
  clientDir,
  communicationMethod,
  env,
  feedbackRule,
  futureHostFraction,
  homeVolumeFormatCommand,
  hostsOverallocatedRule,
  icecreamConfigPath,
  icecreamSchedulerHost,
  isVirtualWorkStation,
  jasperBinaryDir,
  jasperCredentialsPath,
  lockedMemoryKb,
  maximumHosts,
  minimumHosts,
  numFiles,
  numProcesses,
  numTasks,
  preconditionScripts,
  rootDir,
  roundingRule,
  serviceUser,
  setupAsSudo,
  setupScript,
  shellPath,
  sshKey,
  sshOptions,
  user,
  userSpawnAllowed,
  version,
  virtualMemoryKb,
  workDir,
} from "./schemaFields";

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
            bootstrapMethod: bootstrapMethod.schema,
            communicationMethod: communicationMethod.schema,
            arch: arch.schema,
            workDir: workDir.schema,
            setupAsSudo: setupAsSudo.schema,
            setupScript: setupScript.schema,
            userSpawnAllowed: userSpawnAllowed.schema,
          },
          dependencies: {
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
                    isVirtualWorkStation: isVirtualWorkStation.schema,
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
                            icecreamSchedulerHost: icecreamSchedulerHost.schema,
                            icecreamConfigPath: icecreamConfigPath.schema,
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
            arch: {
              oneOf: [
                {
                  properties: {
                    arch: { enum: windowsArchitectures },
                    rootDir: rootDir.schema,
                  },
                },
                {
                  properties: {
                    arch: { enum: nonWindowsArchitectures },
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
        bootstrapMethod: bootstrapMethod.uiSchema,
        communicationMethod: communicationMethod.uiSchema,
        arch: arch.uiSchema,
        setupAsSudo: setupAsSudo.uiSchema,
        workDir: workDir.uiSchema,
        setupScript: setupScript.uiSchema,
        userSpawnAllowed: userSpawnAllowed.uiSchema(hasStaticProvider),
        isVirtualWorkStation: isVirtualWorkStation.uiSchema(architecture),
        icecreamSchedulerHost: icecreamSchedulerHost.uiSchema,
        icecreamConfigPath: icecreamConfigPath.uiSchema,
      },
      bootstrapSettings: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        serviceUser: serviceUser.uiSchema,
        jasperBinaryDir: jasperBinaryDir.uiSchema,
        jasperCredentialsPath: jasperCredentialsPath.uiSchema,
        clientDir: clientDir.uiSchema,
        shellPath: shellPath.uiSchema,
        resourceLimits: {
          // Only visible for Linux
          ...(!linuxArchitectures.includes(architecture) && {
            "ui:widget": "hidden",
          }),
          numFiles: numFiles.uiSchema,
          numTasks: numTasks.uiSchema,
          numProcesses: numProcesses.uiSchema,
          lockedMemoryKb: lockedMemoryKb.uiSchema,
          virtualMemoryKb: virtualMemoryKb.uiSchema,
        },
        env: env.uiSchema,
        preconditionScripts: preconditionScripts.uiSchema,
      },
      sshConfig: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        user: user.uiSchema,
        sshKey: sshKey.uiSchema,
        authorizedKeysFile: authorizedKeysFile.uiSchema,
        sshOptions: sshOptions.uiSchema,
      },
      allocation: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        version: version.uiSchema,
        roundingRule: roundingRule.uiSchema,
        feedbackRule: feedbackRule.uiSchema,
        hostsOverallocatedRule: hostsOverallocatedRule.uiSchema,
        minimumHosts: minimumHosts.uiSchema(hasEC2Provider),
        maximumHosts: maximumHosts.uiSchema(hasEC2Provider),
        acceptableHostIdleTime: acceptableHostIdleTime.uiSchema(hasEC2Provider),
        futureHostFraction: futureHostFraction.uiSchema(hasEC2Provider),
      },
    },
  };
};

const bootstrapSettings = {
  type: "object" as "object",
  title: "Bootstrap Settings",
  properties: {
    jasperBinaryDir: jasperBinaryDir.schema,
    jasperCredentialsPath: jasperCredentialsPath.schema,
    clientDir: clientDir.schema,
    shellPath: shellPath.schema,
    homeVolumeFormatCommand: homeVolumeFormatCommand.schema,
    serviceUser: serviceUser.schema,
    resourceLimits: {
      type: "object" as "object",
      title: "Resource Limits",
      required: [
        "numFiles",
        "numTasks",
        "numProcesses",
        "lockedMemoryKb",
        "virtualMemoryKb",
      ],
      properties: {
        numFiles: numFiles.schema,
        numTasks: numTasks.schema,
        numProcesses: numProcesses.schema,
        lockedMemoryKb: lockedMemoryKb.schema,
        virtualMemoryKb: virtualMemoryKb.schema,
      },
    },
    env: env.schema,
    preconditionScripts: preconditionScripts.schema,
  },
};

const sshConfig = (sshKeys: SshKey[]) => ({
  type: "object" as "object",
  title: "SSH Configuration",
  properties: {
    user: user.schema,
    sshKey: sshKey.schema(sshKeys),
    authorizedKeysFile: authorizedKeysFile.schema,
    sshOptions: sshOptions.schema,
  },
});

const allocation = {
  type: "object" as "object",
  title: "Host Allocation",
  required: [
    "minimumHosts",
    "maximumHosts",
    "acceptableHostIdleTime",
    "futureHostFraction",
  ],
  properties: {
    version: version.schema,
    roundingRule: roundingRule.schema,
    feedbackRule: feedbackRule.schema,
    hostsOverallocatedRule: hostsOverallocatedRule.schema,
    minimumHosts: minimumHosts.schema,
    maximumHosts: maximumHosts.schema,
    acceptableHostIdleTime: acceptableHostIdleTime.schema,
    futureHostFraction: futureHostFraction.schema,
  },
};
