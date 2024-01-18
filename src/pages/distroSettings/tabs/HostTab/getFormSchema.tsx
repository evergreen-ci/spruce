import { GetFormSchema } from "components/SpruceForm";
import { Arch, BootstrapMethod, Provider, SshKey } from "gql/generated/types";
import { nonWindowsArchitectures, windowsArchitectures } from "./constants";
import {
  allocation as allocationProperties,
  bootstrap as bootstrapProperties,
  setup,
  sshConfig as sshConfigProperties,
  icecreamConfigPath,
  icecreamSchedulerHost,
  isVirtualWorkStation,
  rootDir,
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
          properties: setup.schema,
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
      setup: setup.uiSchema(architecture, hasStaticProvider),
      bootstrapSettings: bootstrapProperties.uiSchema(architecture),
      sshConfig: sshConfigProperties.uiSchema(hasStaticProvider),
      allocation: allocationProperties.uiSchema(
        hasEC2Provider,
        hasStaticProvider,
      ),
    },
  };
};

const bootstrapSettings = {
  type: "object" as "object",
  title: "Bootstrap Settings",
  properties: bootstrapProperties.schema,
};

const sshConfig = (sshKeys: SshKey[]) => ({
  type: "object" as "object",
  title: "SSH Configuration",
  properties: sshConfigProperties.schema(sshKeys),
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
  properties: allocationProperties.schema,
};
