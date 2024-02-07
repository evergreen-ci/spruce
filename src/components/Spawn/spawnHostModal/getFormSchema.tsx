import { css } from "@emotion/react";
import { add } from "date-fns";
import { GetFormSchema } from "components/SpruceForm/types";
import widgets from "components/SpruceForm/Widgets";
import { LeafyGreenTextArea } from "components/SpruceForm/Widgets/LeafyGreenWidgets";
import {
  MyPublicKeysQuery,
  SpawnTaskQuery,
  MyVolumesQuery,
} from "gql/generated/types";
import { shortenGithash } from "utils/string";
import { getDefaultExpiration } from "../utils";
import { validateTask } from "./utils";
import { DistroDropdown } from "./Widgets/DistroDropdown";

interface Props {
  distros: {
    adminOnly: boolean;
    isVirtualWorkStation: boolean;
    name?: string;
  }[];
  awsRegions: string[];
  disableExpirationCheckbox: boolean;
  distroIdQueryParam?: string;
  isVirtualWorkstation: boolean;
  noExpirationCheckboxTooltip: string;
  myPublicKeys: MyPublicKeysQuery["myPublicKeys"];
  spawnTaskData?: SpawnTaskQuery["task"];
  userAwsRegion?: string;
  volumes: MyVolumesQuery["myVolumes"];
  isMigration: boolean;
  useSetupScript?: boolean;
  useProjectSetupScript?: boolean;
}

export const getFormSchema = ({
  awsRegions,
  disableExpirationCheckbox,
  distroIdQueryParam,
  distros,
  isMigration,
  isVirtualWorkstation,
  myPublicKeys,
  noExpirationCheckboxTooltip,
  spawnTaskData,
  useProjectSetupScript = false,
  useSetupScript = false,
  userAwsRegion,
  volumes,
}: Props): ReturnType<GetFormSchema> => {
  const {
    buildVariant,
    canSync,
    displayName: taskDisplayName,
    project,
    revision,
  } = spawnTaskData || {};
  const hasValidTask = validateTask(spawnTaskData);
  const shouldRenderVolumeSelection = !isMigration && isVirtualWorkstation;
  const availableVolumes = volumes
    ? volumes.filter((v) => v.homeVolume && !v.hostID)
    : [];

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
          default: distroIdQueryParam
            ? {
                value: distroIdQueryParam,
                isVirtualWorkstation: !!distros?.find(
                  (v) =>
                    v.name === distroIdQueryParam && v.isVirtualWorkStation,
                ),
              }
            : null,
          oneOf: [
            ...(distros?.map((d) => ({
              type: "string" as "string",
              title: d.name,
              enum: [d.name],
              isVirtualWorkstation: d.isVirtualWorkStation,
              adminOnly: d.adminOnly,
            })) || []),
          ],
        },
        region: {
          type: "string" as "string",
          title: "Region",
          default: userAwsRegion || (awsRegions?.length && awsRegions[0]),
          oneOf: [
            ...(awsRegions?.map((r) => ({
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
                      default: myPublicKeys?.length
                        ? myPublicKeys[0]?.name
                        : "",
                      oneOf:
                        myPublicKeys?.length > 0
                          ? myPublicKeys.map((d) => ({
                              type: "string" as "string",
                              title: d.name,
                              enum: [d.name],
                            }))
                          : [
                              {
                                type: "string" as "string",
                                title: "No keys available.",
                                enum: [""],
                              },
                            ],
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
                      type: "string" as "string",
                      default: "",
                    },
                    savePublicKey: {
                      title: "Save Public Key",
                      type: "boolean" as "boolean",
                      default: false,
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
              default: false,
              type: "boolean" as "boolean",
              title: "Never expire",
            },
            expiration: {
              type: "string" as "string",
              title: "Expiration",
              default: getDefaultExpiration(),
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
                      readOnly: false,
                    },
                  },
                },
                {
                  properties: {
                    noExpiration: {
                      enum: [true],
                    },
                    expiration: {
                      readOnly: true,
                    },
                  },
                },
              ],
            },
          },
        },
        ...(shouldRenderVolumeSelection && {
          homeVolumeDetails: {
            type: "object" as "object",
            title: "Virtual Workstation",
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
                        default: availableVolumes[0]?.id ?? "",
                        oneOf:
                          availableVolumes.length > 0
                            ? availableVolumes.map((v) => ({
                                type: "string" as "string",
                                title: `(${v.size}GB) ${v.displayName || v.id}`,
                                enum: [v.id],
                              }))
                            : [
                                {
                                  type: "string" as "string",
                                  title: "No volumes available.",
                                  enum: [""],
                                },
                              ],
                      },
                    },
                  },
                  {
                    properties: {
                      selectExistingVolume: {
                        enum: [false],
                      },
                      volumeSize: {
                        title: "Volume size (GB)",
                        type: "number" as "number",
                        default: 500,
                      },
                    },
                  },
                ],
              },
            },
          },
        }),
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
        "ui:widget": DistroDropdown,
        "ui:elementWrapperCSS": dropdownWrapperClassName,
        "ui:data-cy": "distro-input",
      },
      region: {
        "ui:data-cy": "region-select",
        "ui:disabled": isMigration,
        "ui:elementWrapperCSS": dropdownWrapperClassName,
        "ui:placeholder": "Select a region",
        "ui:allowDeselect": false,
      },
      publicKeySection: {
        useExisting: {
          "ui:widget": widgets.RadioBoxWidget,
        },
        publicKeyNameDropdown: {
          "ui:elementWrapperCSS": dropdownWrapperClassName,
          "ui:data-cy": "key-select",
          "ui:allowDeselect": false,
          "ui:disabled": myPublicKeys?.length === 0,
        },
        newPublicKey: {
          "ui:widget": LeafyGreenTextArea,
          "ui:elementWrapperCSS": textAreaWrapperClassName,
          "ui:data-cy": "key-value-text-area",
        },
      },
      userdataScriptSection: {
        userdataScript: {
          "ui:widget": LeafyGreenTextArea,
          "ui:elementWrapperCSS": textAreaWrapperClassName,
          "ui:data-cy": "user-data-script-text-area",
        },
      },
      setupScriptSection: {
        defineSetupScriptCheckbox: {
          "ui:disabled": useProjectSetupScript,
          "ui:data-cy": "setup-script-checkbox",
        },
        setupScript: {
          "ui:widget": LeafyGreenTextArea,
          "ui:elementWrapperCSS": textAreaWrapperClassName,
          "ui:data-cy": "setup-script-text-area",
        },
      },
      expirationDetails: {
        noExpiration: {
          "ui:disabled": disableExpirationCheckbox,
          "ui:tooltipDescription": noExpirationCheckboxTooltip ?? "",
          "ui:data-cy": "never-expire-checkbox",
        },
        expiration: {
          "ui:disableBefore": add(today, { days: 1 }),
          "ui:disableAfter": add(today, { days: 30 }),
          "ui:widget": "date-time",
          "ui:elementWrapperCSS": datePickerCSS,
        },
      },
      ...(hasValidTask && {
        loadData: {
          "ui:fieldSetCSS": loadDataFieldSetCSS,
          loadDataOntoHostAtStartup: {
            "ui:widget": hasValidTask ? widgets.CheckboxWidget : "hidden",
            "ui:customLabel": (
              <>
                Load data for <b>{taskDisplayName}</b> on <b>{buildVariant}</b>{" "}
                @ <b>{shortenGithash(revision)}</b> onto host at startup
              </>
            ),
            "ui:elementWrapperCSS": dropMarginBottomCSS,
            "ui:data-cy": "load-data-checkbox",
          },
          runProjectSpecificSetupScript: {
            "ui:widget":
              hasValidTask && project?.spawnHostScriptPath
                ? widgets.CheckboxWidget
                : "hidden",
            "ui:disabled": useSetupScript,
            "ui:data-cy": "project-setup-script-checkbox",
            "ui:elementWrapperCSS": childCheckboxCSS,
          },
          taskSync: {
            "ui:widget":
              hasValidTask && canSync ? widgets.CheckboxWidget : "hidden",
            "ui:elementWrapperCSS": childCheckboxCSS,
          },
          startHosts: {
            "ui:widget": hasValidTask ? widgets.CheckboxWidget : "hidden",
            "ui:elementWrapperCSS": childCheckboxCSS,
          },
        },
      }),
      ...(shouldRenderVolumeSelection && {
        homeVolumeDetails: {
          selectExistingVolume: {
            "ui:widget": isVirtualWorkstation
              ? widgets.RadioBoxWidget
              : "hidden",
          },
          volumeSelect: {
            "ui:allowDeselect": false,
            "ui:data-cy": "volume-select",
            "ui:disabled": availableVolumes?.length === 0,
            "ui:enumDisabled": (volumes || [])
              .filter((v) => !!v.hostID)
              .map((v) => v.id),
          },
          volumeSize: {
            "ui:inputType": "number",
          },
        },
      }),
    },
  };
};

const dropdownWrapperClassName = css`
  max-width: 225px;
`;
const textAreaWrapperClassName = css`
  max-width: 675px;
`;
const indentCSS = css`
  margin-left: 16px;
`;
const dropMarginBottomCSS = css`
  margin-bottom: 0px;
`;
const childCheckboxCSS = css`
  ${indentCSS}
  ${dropMarginBottomCSS}
`;
const loadDataFieldSetCSS = css`
  margin-bottom: 20px;
`;
const datePickerCSS = css`
  position: relative;
  z-index: 1;
`;

const today = new Date();
