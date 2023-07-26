import { css } from "@emotion/react";
import { add } from "date-fns";
import { GetFormSchema } from "components/SpruceForm/types";
import widgets from "components/SpruceForm/Widgets";
import { LeafyGreenTextArea } from "components/SpruceForm/Widgets/LeafyGreenWidgets";
import { InputLabel, StyledLink } from "components/styles";
import { windowsPasswordRulesURL } from "constants/externalResources";
import { MyPublicKeysQuery, MyVolumesQuery } from "gql/generated/types";
import { ExpirationRow } from "../ExpirationRow";
import { getDefaultExpiration } from "../utils";
import { UserTagRow } from "./FieldTemplates/UserTagRow";

interface Props {
  canEditInstanceType: boolean;
  canEditRdpPassword: boolean;
  canEditSshKeys: boolean;
  disableExpirationCheckbox: boolean;
  instanceTypes: string[];
  myPublicKeys: MyPublicKeysQuery["myPublicKeys"];
  noExpirationCheckboxTooltip: string;
  volumes: MyVolumesQuery["myVolumes"];
}

export const getFormSchema = ({
  canEditInstanceType,
  canEditRdpPassword,
  canEditSshKeys,
  disableExpirationCheckbox,
  instanceTypes,
  myPublicKeys,
  noExpirationCheckboxTooltip,
  volumes,
}: Props): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    properties: {
      expirationDetails: {
        dependencies: {
          noExpiration: {
            oneOf: [
              {
                properties: {
                  expiration: {
                    readOnly: true,
                  },
                  noExpiration: {
                    enum: [true],
                  },
                },
              },
              {
                properties: {
                  expiration: {
                    readOnly: false,
                  },
                  noExpiration: {
                    enum: [false],
                  },
                },
              },
            ],
          },
        },
        properties: {
          expiration: {
            default: getDefaultExpiration(),
            title: "Edit Expiration",
            type: "string" as "string",
          },
          noExpiration: {
            default: false,
            title: "Never expire",
            type: "boolean" as "boolean",
          },
        },
        title: "",
        type: "object" as "object",
      },
      hostName: {
        default: "",
        title: "Edit Host Name",
        type: "string",
      },
      instanceType: {
        default: "",
        oneOf: instanceTypes.map((it) => ({
          enum: [it],
          title: it,
          type: "string" as "string",
        })),
        title: "Change Instance Type",
        type: "string" as "string",
      },
      volume: {
        default: "",
        oneOf: [
          {
            enum: [""],
            title: "Select volume…",
            type: "string" as "string",
          },
          ...volumes.map((v) => ({
            enum: [v.id],
            title: `(${v.size}GB) ${v.displayName || v.id}`,
            type: "string" as "string",
          })),
        ],
        title: "Add Volume",
        type: "string" as "string",
      },
      ...(canEditRdpPassword && {
        rdpPassword: {
          default: "",
          title: "Set New RDP Password",
          type: "string",
        },
      }),
      publicKeySection: {
        dependencies: {
          useExisting: {
            oneOf: [
              {
                properties: {
                  publicKeyNameDropdown: {
                    default: "",
                    oneOf: [
                      {
                        enum: [""],
                        title: "Select public key…",
                        type: "string" as "string",
                      },
                      ...myPublicKeys.map((d) => ({
                        enum: [d.name],
                        title: d.name,
                        type: "string" as "string",
                      })),
                    ],
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
                            default: "",
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
            title: "Add SSH Key",
            type: "boolean" as "boolean",
          },
        },
        title: "",
        type: "object",
      },
      userTags: {
        items: {
          properties: {
            key: {
              default: "",
              title: "Key",
              type: "string" as "string",
            },
            value: {
              default: "",
              title: "Value",
              type: "string" as "string",
            },
          },
          type: "object" as "object",
        },
        title: "",
        type: "array" as "array",
      },
    },
    type: "object" as "object",
  },
  uiSchema: {
    expirationDetails: {
      expiration: {
        "ui:disableAfter": add(today, { days: 30 }),
        "ui:disableBefore": add(today, { days: 1 }),
        "ui:elementWrapperCSS": datePickerCSS,
        "ui:widget": "date-time",
      },
      noExpiration: {
        "ui:disabled": disableExpirationCheckbox,
        "ui:elementWrapperCSS": checkboxCSS,
        "ui:tooltipDescription": noExpirationCheckboxTooltip ?? "",
      },
      "ui:ObjectFieldTemplate": ExpirationRow,
    },
    instanceType: {
      "ui:allowDeselect": false,
      "ui:description": !canEditInstanceType
        ? "Instance type can only be changed when the host is stopped."
        : "",
      "ui:disabled": !canEditInstanceType,
    },
    publicKeySection: {
      newPublicKey: {
        "ui:disabled": !canEditSshKeys,
        "ui:widget": LeafyGreenTextArea,
      },
      publicKeyNameDropdown: {
        "ui:allowDeselect": false,
        "ui:description":
          canEditSshKeys && myPublicKeys.length === 0
            ? "No keys available."
            : "",
        "ui:disabled": !canEditSshKeys || myPublicKeys.length === 0,
      },
      useExisting: {
        "ui:description": !canEditSshKeys
          ? "SSH keys can only be added when the host is running."
          : "",
        "ui:disabled": !canEditSshKeys,
        "ui:widget": widgets.RadioBoxWidget,
      },
    },
    rdpPassword: {
      // Console error should be resolved by https://jira.mongodb.org/browse/LG-2342.
      "ui:description": (
        <>
          Password should match the criteria defined{" "}
          <StyledLink href={windowsPasswordRulesURL} target="__blank">
            here.
          </StyledLink>
        </>
      ),
    },
    userTags: {
      items: {
        "ui:ObjectFieldTemplate": UserTagRow,
      },
      "ui:addButtonText": "Add Tag",
      "ui:descriptionNode": <InputLabel>Add User Tags</InputLabel>,
      "ui:orderable": false,
    },
    volume: {
      "ui:allowDeselect": false,
      "ui:description": volumes.length === 0 ? "No volumes available." : "",
      "ui:disabled": volumes.length === 0,
    },
  },
});

const datePickerCSS = css`
  position: relative;
  z-index: 1;
`;

const checkboxCSS = css`
  margin-bottom: 0;
`;

const today = new Date();
