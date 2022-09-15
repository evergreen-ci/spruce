import { css } from "@emotion/react";
import { validateTask } from "components/Spawn/utils";
import widgets from "components/SpruceForm/Widgets";
import { AntdSelect } from "components/SpruceForm/Widgets/AntdWidgets";
import {
  LeafyGreenTextArea,
  LeafyGreenCheckBox,
} from "components/SpruceForm/Widgets/LeafyGreenWidgets";
import { SearchableDropdownWidget } from "components/SpruceForm/Widgets/SearchableDropdown";
import { SpruceWidgetProps } from "components/SpruceForm/Widgets/types";
import {
  GetMyPublicKeysQuery,
  GetSpawnTaskQuery,
  MyVolumesQuery,
} from "gql/generated/types";
import { GetFormSchema } from "pages/projectSettings/tabs/types";
import { shortenGithash } from "utils/string";

const getDefaultExpiration = () => {
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  return nextWeek.toString();
};

interface LoadTaskDataOntoHostLabelProps {
  options: {
    buildVariant: string;
    taskDisplayName: string;
    revision: string;
  };
}

export const LeafyGreenCheckboWithCustomLabel: React.VFC<
  SpruceWidgetProps & LoadTaskDataOntoHostLabelProps
> = (props) => {
  const { taskDisplayName, buildVariant, revision } = props.options;
  const label = (
    <>
      Load data for <b>{taskDisplayName}</b> on <b>{buildVariant}</b> @{" "}
      <b>{shortenGithash(revision)}</b> onto host at startup
    </>
  );
  return <LeafyGreenCheckBox {...{ ...props, customLabel: label }} />;
};
interface Props {
  distros: {
    isVirtualWorkStation: boolean;
    name?: string;
  }[];
  awsRegions: string[];
  disableExpirationCheckbox: boolean;
  distroId?: string;
  isVirtualWorkstation: boolean;
  noExpirationCheckboxTooltip: string;
  publicKeys: GetMyPublicKeysQuery["myPublicKeys"];
  spawnTaskData?: GetSpawnTaskQuery["task"];
  timezone: string;
  userAwsRegion?: string;
  volumes: MyVolumesQuery["myVolumes"];
}

const dropdownWrapperClassName = css`
  max-width: 225px;
`;

const textAreaWrapperClassName = css`
  max-width: 675px;
`;

const indentCSS = css`
  margin-left: 16px;
`;

const loadDataFieldSetCSS = css`
  margin-bottom: 20px;
`;

export const getFormSchema = ({
  awsRegions,
  disableExpirationCheckbox,
  distroId,
  distros,
  isVirtualWorkstation,
  noExpirationCheckboxTooltip,
  publicKeys,
  spawnTaskData,
  timezone,
  userAwsRegion,
  volumes,
}: Props): ReturnType<GetFormSchema> => {
  const {
    displayName: taskDisplayName,
    buildVariant,
    revision,
    project,
    canSync,
  } = spawnTaskData || {};
  const hasValidTask = validateTask(spawnTaskData);
  return {
    fields: {},
    schema: {
      type: "object" as "object",
      properties: {
        requiredHostInformationTitle: {
          title: "Required Host Information",
          type: "null",
        },
        distro: {
          type: "string" as "string",
          title: "Distro",
          default: distroId || "",
          oneOf: [
            ...(distros?.map((d) => ({
              type: "string" as "string",
              title: d.name,
              enum: [d.name],
              isVirtualWorkstation: d.isVirtualWorkStation,
            })) || []),
          ],
        },
        region: {
          type: "string" as "string",
          title: "Region",
          default: userAwsRegion || (awsRegions?.length && awsRegions[0]),
          oneOf: [
            ...(awsRegions.map((r) => ({
              type: "string" as "string",
              title: r,
              enum: [r],
            })) || []),
          ],
        },
        publicKeySection: {
          title: "",
          type: "object",
          properties: {
            useExisting: {
              title: "Key selection",
              default: true,
              type: "boolean" as "boolean",
              oneOf: [
                {
                  type: "boolean" as "boolean",
                  title: "Use existing key",
                  enum: [true],
                },
                {
                  type: "boolean" as "boolean",
                  title: "Add new key",
                  enum: [false],
                },
              ],
            },
          },
          dependencies: {
            useExisting: {
              oneOf: [
                {
                  properties: {
                    useExisting: {
                      enum: [true],
                    },
                    publicKeyNameDropdown: {
                      title: "Choose key",
                      type: "string" as "string",
                      default: publicKeys?.length ? publicKeys[0]?.name : "",
                      oneOf:
                        publicKeys?.map((d) => ({
                          type: "string" as "string",
                          title: d.name,
                          enum: [d.name],
                        })) || [],
                    },
                  },
                },
                {
                  properties: {
                    useExisting: {
                      enum: [false],
                    },
                    newPublicKey: {
                      title: "Public key",
                      default: "",
                      type: "string" as "string",
                    },
                    savePublicKey: {
                      title: "Save Public Key",
                      type: "boolean" as "boolean",
                    },
                  },
                  dependencies: {
                    savePublicKey: {
                      oneOf: [
                        {
                          properties: {
                            savePublicKey: {
                              enum: [true],
                            },
                            newPublicKeyName: {
                              title: "Key name",
                              type: "string" as "string",
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
        optionalInformationTitle: {
          title: "Optional Host Details",
          type: "null",
        },
        userdataScriptSection: {
          type: "object" as "object",
          title: "",
          properties: {
            runUserdataScript: {
              title: "Run Userdata script on start",
              type: "boolean",
            },
          },
          dependencies: {
            runUserdataScript: {
              oneOf: [
                {
                  properties: {
                    runUserdataScript: {
                      enum: [true],
                    },
                    userdataScript: {
                      title: "Userdata Script",
                      type: "string" as "string",
                    },
                  },
                },
                {
                  properties: {
                    runUserdataScript: {
                      enum: [false],
                    },
                  },
                },
              ],
            },
          },
        },
        setupScriptSection: {
          type: "object" as "object",
          title: "",
          properties: {
            defineSetupScriptCheckbox: {
              title:
                "Define setup script to run after host is configured (i.e. task data and artifacts are loaded)",
              type: "boolean",
            },
          },
          dependencies: {
            defineSetupScriptCheckbox: {
              oneOf: [
                {
                  properties: {
                    defineSetupScriptCheckbox: {
                      enum: [true],
                    },
                    setupScript: {
                      title: "Setup Script",
                      type: "string" as "string",
                    },
                  },
                },
                {
                  properties: {
                    runUserdataScript: {
                      enum: [false],
                    },
                  },
                },
              ],
            },
          },
        },
        ...(hasValidTask && {
          loadData: {
            title: "",
            type: "object" as "object",
            properties: {
              loadDataOntoHostAtStartup: {
                type: "boolean" as "boolean",
                default: true,
              },
            },
            dependencies: {
              loadDataOntoHostAtStartup: {
                oneOf: [
                  {
                    properties: {
                      loadDataOntoHostAtStartup: {
                        enum: [true],
                      },
                      runProjectSpecificSetupScript: {
                        type: "boolean" as "boolean",
                        title: `Use project-specific setup script defined at ${project?.spawnHostScriptPath}`,
                      },
                      taskSync: {
                        type: "boolean" as "boolean",
                        title: "Load from task sync",
                      },
                      startHosts: {
                        type: "boolean" as "boolean",
                        title:
                          "Also start any hosts this task started (if applicable)",
                      },
                    },
                  },
                ],
              },
            },
          },
        }),
        expirationDetails: {
          title: "",
          type: "object" as "object",
          properties: {
            noExpiration: {
              type: "boolean" as "boolean",
              title: "Never expire",
              default: isVirtualWorkstation && !disableExpirationCheckbox, // only default virtual workstations to unexpirable if possible
            },
          },
          dependencies: {
            noExpiration: {
              oneOf: [
                {
                  properties: {
                    noExpiration: {
                      enum: [false],
                    },
                    expiration: {
                      type: "string" as "string",
                      title: "Expiration",
                      default: getDefaultExpiration(),
                    },
                  },
                },
                {
                  properties: {
                    noExpiration: {
                      enum: [true],
                    },
                  },
                },
              ],
            },
          },
        },
        homeVolumeDetails: {
          type: "object" as "object",
          title: isVirtualWorkstation && "Virtual workstation",
          properties: {
            selectExistingVolume: {
              title: "Volume selection",
              type: "boolean" as "boolean",
              default: true,
              oneOf: [
                {
                  type: "boolean" as "boolean",
                  title: "Attach existing volume",
                  enum: [true],
                },
                {
                  type: "boolean" as "boolean",
                  title: "Attach new volume",
                  enum: [false],
                },
              ],
            },
          },
          dependencies: {
            selectExistingVolume: {
              oneOf: [
                {
                  properties: {
                    selectExistingVolume: {
                      enum: [true],
                    },
                    volumeSelect: {
                      title: "Volume",
                      type: "string" as "string",
                      default: "",
                      oneOf: (volumes || [])?.map((v) => ({
                        type: "string" as "string",
                        title: `(${v.size}gb) ${v.displayName || v.id}`,
                        enum: [v.id],
                      })),
                    },
                  },
                },
                {
                  properties: {
                    selectExistingVolume: {
                      enum: [false],
                    },
                    volumeSize: {
                      title: "Volume size (gb)",
                      type: "number" as "number",
                      default: 500,
                    },
                  },
                },
              ],
            },
          },
        },
      },
      dependencies: {
        runUserdataScript: {
          oneOf: [
            {
              properties: {
                runUserdataScript: {
                  enum: [true],
                },
                userdataScript: {
                  title: "Userdata Script",
                  type: "string" as "string",
                },
              },
            },
            {
              properties: {
                runUserdataScript: {
                  enum: [false],
                },
              },
            },
          ],
        },
      },
    },
    uiSchema: {
      distro: {
        "ui:widget": SearchableDropdownWidget,
        "ui:elementWrapperCSS": dropdownWrapperClassName,
        "ui:valuePlaceholder": "Select a distro",
      },
      region: {
        "ui:widget": AntdSelect,
        "ui:elementWrapperCSS": dropdownWrapperClassName,
        "ui:valuePlaceholder": "Select a region",
      },
      publicKeySection: {
        useExisting: {
          "ui:widget": widgets.RadioBoxWidget,
        },
        publicKeyNameDropdown: {
          "ui:widget": AntdSelect,
          "ui:elementWrapperCSS": dropdownWrapperClassName,
          "ui:valuePlaceholder": "Select a key",
        },
        newPublicKey: {
          "ui:widget": LeafyGreenTextArea,
          "ui:elementWrapperCSS": textAreaWrapperClassName,
        },
      },
      userdataScriptSection: {
        userdataScript: {
          "ui:widget": LeafyGreenTextArea,
          "ui:elementWrapperCSS": textAreaWrapperClassName,
        },
      },
      setupScriptSection: {
        setupScript: {
          "ui:widget": LeafyGreenTextArea,
          "ui:elementWrapperCSS": textAreaWrapperClassName,
        },
      },
      expirationDetails: {
        noExpiration: {
          "ui:disabled": disableExpirationCheckbox,
          "ui:tooltipDescription": noExpirationCheckboxTooltip ?? "",
        },
        expiration: {
          "ui:disablePastDatetime": true,
          "ui:timezone": timezone,
          "ui:widget": "date-time",
        },
      },
      ...(hasValidTask && {
        loadData: {
          "ui:fieldSetCSS": loadDataFieldSetCSS,
          loadDataOntoHostAtStartup: {
            "ui:widget": hasValidTask
              ? LeafyGreenCheckboWithCustomLabel
              : "hidden",
            "ui:buildVariant": buildVariant,
            "ui:taskDisplayName": taskDisplayName,
            "ui:revision": revision,
            "ui:marginBottom": 0,
          },
          runProjectSpecificSetupScript: {
            "ui:widget":
              hasValidTask && project?.spawnHostScriptPath
                ? widgets.CheckboxWidget
                : "hidden",
            "ui:elementWrapperCSS": indentCSS,
            "ui:marginBottom": 0,
          },
          taskSync: {
            "ui:widget":
              hasValidTask && canSync ? widgets.CheckboxWidget : "hidden",
            "ui:elementWrapperCSS": indentCSS,
            "ui:marginBottom": 0,
          },
          startHosts: {
            "ui:widget": hasValidTask ? widgets.CheckboxWidget : "hidden",
            "ui:elementWrapperCSS": indentCSS,
            "ui:marginBottom": 0,
          },
        },
      }),
      homeVolumeDetails: {
        selectExistingVolume: {
          "ui:widget": isVirtualWorkstation ? widgets.RadioBoxWidget : "hidden",
        },
        volumeSelect: {
          "ui:widget": isVirtualWorkstation ? AntdSelect : "hidden",
          "ui:allowDeselect": false,
          "ui:disabledEnums": volumes
            .filter((v) => !!v.hostID)
            .map((v) => v.id),
        },
        volumeSize: {
          "ui:type": "number",
        },
      },
    },
  };
};
