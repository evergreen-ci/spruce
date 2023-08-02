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
    type: "object" as "object",
    properties: {
      hostName: {
        title: "Edit Host Name",
        type: "string",
        default: "",
      },
      expirationDetails: {
        title: "",
        type: "object" as "object",
        properties: {
          expiration: {
            type: "string" as "string",
            title: "Edit Expiration",
            default: getDefaultExpiration(),
          },
          noExpiration: {
            type: "boolean" as "boolean",
            title: "Never expire",
            default: false,
          },
        },
        dependencies: {
          noExpiration: {
            oneOf: [
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
            ],
          },
        },
      },
      instanceType: {
        title: "Change Instance Type",
        type: "string" as "string",
        default: "",
        oneOf: instanceTypes.map((it) => ({
          type: "string" as "string",
          title: it,
          enum: [it],
        })),
      },
      volume: {
        title: "Add Volume",
        type: "string" as "string",
        default: "",
        oneOf: [
          {
            type: "string" as "string",
            title: "Select volume…",
            enum: [""],
          },
          ...volumes.map((v) => ({
            type: "string" as "string",
            title: `(${v.size}GB) ${v.displayName || v.id}`,
            enum: [v.id],
          })),
        ],
      },
      ...(canEditRdpPassword && {
        rdpPassword: {
          title: "Set New RDP Password",
          type: "string",
          default: "",
        },
      }),
      userTags: {
        title: "",
        type: "array" as "array",
        items: {
          type: "object" as "object",
          properties: {
            key: {
              type: "string" as "string",
              title: "Key",
              default: "",
            },
            value: {
              type: "string" as "string",
              title: "Value",
              default: "",
            },
          },
        },
      },
      publicKeySection: {
        title: "",
        type: "object",
        properties: {
          useExisting: {
            title: "Add SSH Key",
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
                    default: "",
                    oneOf: [
                      {
                        type: "string" as "string",
                        title: "Select public key…",
                        enum: [""],
                      },
                      ...myPublicKeys.map((d) => ({
                        type: "string" as "string",
                        title: d.name,
                        enum: [d.name],
                      })),
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
                            default: "",
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
  },
  uiSchema: {
    expirationDetails: {
      "ui:ObjectFieldTemplate": ExpirationRow,
      expiration: {
        "ui:disableBefore": add(today, { days: 1 }),
        "ui:disableAfter": add(today, { days: 30 }),
        "ui:widget": "date-time",
        "ui:elementWrapperCSS": datePickerCSS,
      },
      noExpiration: {
        "ui:disabled": disableExpirationCheckbox,
        "ui:tooltipDescription": noExpirationCheckboxTooltip ?? "",
        "ui:elementWrapperCSS": checkboxCSS,
      },
    },
    instanceType: {
      "ui:description": !canEditInstanceType
        ? "Instance type can only be changed when the host is stopped."
        : "",
      "ui:disabled": !canEditInstanceType,
      "ui:allowDeselect": false,
    },
    volume: {
      "ui:allowDeselect": false,
      "ui:disabled": volumes.length === 0,
      "ui:description": volumes.length === 0 ? "No volumes available." : "",
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
      "ui:descriptionNode": <InputLabel>Add User Tags</InputLabel>,
      "ui:addButtonText": "Add Tag",
      "ui:orderable": false,
      items: {
        "ui:ObjectFieldTemplate": UserTagRow,
        "ui:label": false,
      },
    },
    publicKeySection: {
      useExisting: {
        "ui:widget": widgets.RadioBoxWidget,
        "ui:description": !canEditSshKeys
          ? "SSH keys can only be added when the host is running."
          : "",
        "ui:disabled": !canEditSshKeys,
      },
      publicKeyNameDropdown: {
        "ui:allowDeselect": false,
        "ui:disabled": !canEditSshKeys || myPublicKeys.length === 0,
        "ui:description":
          canEditSshKeys && myPublicKeys.length === 0
            ? "No keys available."
            : "",
      },
      newPublicKey: {
        "ui:widget": LeafyGreenTextArea,
        "ui:disabled": !canEditSshKeys,
      },
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
