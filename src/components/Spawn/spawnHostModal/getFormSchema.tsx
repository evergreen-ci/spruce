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
      properties: {
        distro: {
          default: distroIdQueryParam
            ? {
                isVirtualWorkstation: !!distros?.find(
                  (v) => v.name === distroIdQueryParam && v.isVirtualWorkStation
                ),
                value: distroIdQueryParam,
              }
            : null,
          oneOf: [
            ...(distros?.map((d) => ({
              enum: [d.name],
              isVirtualWorkstation: d.isVirtualWorkStation,
              title: d.name,
              type: "string" as "string",
            })) || []),
          ],
          title: "Distro",
          type: "string" as "string",
        },
        optionalInformationTitle: {
          title: "Optional Host Details",
          type: "null",
        },
        publicKeySection: {
          dependencies: {
            useExisting: {
              oneOf: [
                {
                  properties: {
                    publicKeyNameDropdown: {
                      default: myPublicKeys?.length
                        ? myPublicKeys[0]?.name
                        : "",
                      oneOf:
                        myPublicKeys?.map((d) => ({
                          enum: [d.name],
                          title: d.name,
                          type: "string" as "string",
                        })) || [],
                      title: "Choose key",
                      type: "string" as "string",
                    },
                    useExisting: {
                      enum: [true],
                    },
                  },
                },
                {
                  dependencies: {
                    savePublicKey: {
                      oneOf: [
                        {
                          properties: {
                            newPublicKeyName: {
                              title: "Key name",
                              type: "string" as "string",
                            },
                            savePublicKey: {
                              enum: [true],
                            },
                          },
                        },
                      ],
                    },
                  },
                  properties: {
                    newPublicKey: {
                      default: "",
                      title: "Public key",
                      type: "string" as "string",
                    },
                    savePublicKey: {
                      default: false,
                      title: "Save Public Key",
                      type: "boolean" as "boolean",
                    },
                    useExisting: {
                      enum: [false],
                    },
                  },
                },
              ],
            },
          },
          properties: {
            useExisting: {
              default: true,
              oneOf: [
                {
                  enum: [true],
                  title: "Use existing key",
                  type: "boolean" as "boolean",
                },
                {
                  enum: [false],
                  title: "Add new key",
                  type: "boolean" as "boolean",
                },
              ],
              title: "Key selection",
              type: "boolean" as "boolean",
            },
          },
          title: "",
          type: "object",
        },
        region: {
          default: userAwsRegion || (awsRegions?.length && awsRegions[0]),
          oneOf: [
            ...(awsRegions?.map((r) => ({
              enum: [r],
              title: r,
              type: "string" as "string",
            })) || []),
          ],
          title: "Region",
          type: "string" as "string",
        },
        requiredHostInformationTitle: {
          title: "Required Host Information",
          type: "null",
        },
        setupScriptSection: {
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
          properties: {
            defineSetupScriptCheckbox: {
              title:
                "Define setup script to run after host is configured (i.e. task data and artifacts are loaded)",
              type: "boolean",
            },
          },
          title: "",
          type: "object" as "object",
        },
        userdataScriptSection: {
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
          properties: {
            runUserdataScript: {
              title: "Run Userdata script on start",
              type: "boolean",
            },
          },
          title: "",
          type: "object" as "object",
        },
        ...(hasValidTask && {
          loadData: {
            dependencies: {
              loadDataOntoHostAtStartup: {
                oneOf: [
                  {
                    properties: {
                      loadDataOntoHostAtStartup: {
                        enum: [true],
                      },
                      runProjectSpecificSetupScript: {
                        title: `Use project-specific setup script defined at ${project?.spawnHostScriptPath}`,
                        type: "boolean" as "boolean",
                      },
                      startHosts: {
                        title:
                          "Also start any hosts this task started (if applicable)",
                        type: "boolean" as "boolean",
                      },
                      taskSync: {
                        title: "Load from task sync",
                        type: "boolean" as "boolean",
                      },
                    },
                  },
                ],
              },
            },
            properties: {
              loadDataOntoHostAtStartup: {
                default: true,
                type: "boolean" as "boolean",
              },
            },
            title: "",
            type: "object" as "object",
          },
        }),
        expirationDetails: {
          dependencies: {
            noExpiration: {
              oneOf: [
                {
                  properties: {
                    expiration: {
                      default: getDefaultExpiration(),
                      title: "Expiration",
                      type: "string" as "string",
                    },
                    noExpiration: {
                      enum: [false],
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
          properties: {
            noExpiration: {
              default: false,
              title: "Never expire",
              type: "boolean" as "boolean",
            },
          },
          title: "",
          type: "object" as "object",
        },
        ...(shouldRenderVolumeSelection && {
          homeVolumeDetails: {
            dependencies: {
              selectExistingVolume: {
                oneOf: [
                  {
                    properties: {
                      selectExistingVolume: {
                        enum: [true],
                      },
                      volumeSelect: {
                        default: availableVolumes[0]?.id,
                        oneOf: availableVolumes.map((v) => ({
                          enum: [v.id],
                          title: `(${v.size}GB) ${v.displayName || v.id}`,
                          type: "string" as "string",
                        })),
                        title: "Volume",
                        type: "string" as "string",
                      },
                    },
                  },
                  {
                    properties: {
                      selectExistingVolume: {
                        enum: [false],
                      },
                      volumeSize: {
                        default: 500,
                        title: "Volume size (GB)",
                        type: "number" as "number",
                      },
                    },
                  },
                ],
              },
            },
            properties: {
              selectExistingVolume: {
                default: true,
                oneOf: [
                  {
                    enum: [true],
                    title: "Attach existing volume",
                    type: "boolean" as "boolean",
                  },
                  {
                    enum: [false],
                    title: "Attach new volume",
                    type: "boolean" as "boolean",
                  },
                ],
                title: "Volume selection",
                type: "boolean" as "boolean",
              },
            },
            title: "Virtual Workstation",
            type: "object" as "object",
          },
        }),
      },
      type: "object" as "object",
    },
    uiSchema: {
      distro: {
        "ui:data-cy": "distro-input",
        "ui:elementWrapperCSS": dropdownWrapperClassName,
        "ui:widget": DistroDropdown,
      },
      expirationDetails: {
        expiration: {
          "ui:disableAfter": add(today, { days: 30 }),
          "ui:disableBefore": add(today, { days: 1 }),
          "ui:elementWrapperCSS": datePickerCSS,
          "ui:widget": "date-time",
        },
        noExpiration: {
          "ui:data-cy": "never-expire-checkbox",
          "ui:disabled": disableExpirationCheckbox,
          "ui:tooltipDescription": noExpirationCheckboxTooltip ?? "",
        },
      },
      publicKeySection: {
        newPublicKey: {
          "ui:data-cy": "key-value-text-area",
          "ui:elementWrapperCSS": textAreaWrapperClassName,
          "ui:widget": LeafyGreenTextArea,
        },
        publicKeyNameDropdown: {
          "ui:allowDeselect": false,
          "ui:data-cy": "key-select",
          "ui:disabled": myPublicKeys?.length === 0,
          "ui:elementWrapperCSS": dropdownWrapperClassName,
          "ui:placeholder":
            myPublicKeys?.length > 0 ? "Select a key" : "No keys available",
        },
        useExisting: {
          "ui:widget": widgets.RadioBoxWidget,
        },
      },
      region: {
        "ui:allowDeselect": false,
        "ui:data-cy": "region-select",
        "ui:disabled": isMigration,
        "ui:elementWrapperCSS": dropdownWrapperClassName,
        "ui:placeholder": "Select a region",
      },
      setupScriptSection: {
        defineSetupScriptCheckbox: {
          "ui:data-cy": "setup-script-checkbox",
          "ui:disabled": useProjectSetupScript,
        },
        setupScript: {
          "ui:data-cy": "setup-script-text-area",
          "ui:elementWrapperCSS": textAreaWrapperClassName,
          "ui:widget": LeafyGreenTextArea,
        },
      },
      userdataScriptSection: {
        userdataScript: {
          "ui:data-cy": "user-data-script-text-area",
          "ui:elementWrapperCSS": textAreaWrapperClassName,
          "ui:widget": LeafyGreenTextArea,
        },
      },
      ...(hasValidTask && {
        loadData: {
          loadDataOntoHostAtStartup: {
            "ui:customLabel": (
              <>
                Load data for <b>{taskDisplayName}</b> on <b>{buildVariant}</b>{" "}
                @ <b>{shortenGithash(revision)}</b> onto host at startup
              </>
            ),
            "ui:data-cy": "load-data-checkbox",
            "ui:elementWrapperCSS": dropMarginBottomCSS,
            "ui:widget": hasValidTask ? widgets.CheckboxWidget : "hidden",
          },
          runProjectSpecificSetupScript: {
            "ui:data-cy": "project-setup-script-checkbox",
            "ui:disabled": useSetupScript,
            "ui:elementWrapperCSS": childCheckboxCSS,
            "ui:widget":
              hasValidTask && project?.spawnHostScriptPath
                ? widgets.CheckboxWidget
                : "hidden",
          },
          startHosts: {
            "ui:elementWrapperCSS": childCheckboxCSS,
            "ui:widget": hasValidTask ? widgets.CheckboxWidget : "hidden",
          },
          taskSync: {
            "ui:elementWrapperCSS": childCheckboxCSS,
            "ui:widget":
              hasValidTask && canSync ? widgets.CheckboxWidget : "hidden",
          },
          "ui:fieldSetCSS": loadDataFieldSetCSS,
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
            "ui:placeholder":
              availableVolumes?.length === 0
                ? "No Volumes Available"
                : undefined,
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
