import { css } from "@emotion/react";
import { add } from "date-fns";
import widgets from "components/SpruceForm/Widgets";
import { AntdSelect } from "components/SpruceForm/Widgets/AntdWidgets";
import { LeafyGreenTextArea } from "components/SpruceForm/Widgets/LeafyGreenWidgets";
import { InputLabel, StyledLink } from "components/styles";
import { windowsPasswordRulesURL } from "constants/externalResources";
import { GetMyPublicKeysQuery, MyVolumesQuery } from "gql/generated/types";
import { GetFormSchema } from "pages/projectSettings/tabs/types";
import { ExpirationRow } from "./FieldTemplates/ExpirationRow";
import { UserTagRow } from "./FieldTemplates/UserTagRow";

interface Props {
  disableExpirationCheckbox: boolean;
  noExpirationCheckboxTooltip: string;
  myPublicKeys: GetMyPublicKeysQuery["myPublicKeys"];
  volumes: MyVolumesQuery["myVolumes"];
  instanceTypes: string[];
  canEditRDPPassword: boolean;
  canEditInstanceType: boolean;
  canEditSshKeys: boolean;
}

export const getFormSchema = ({
  disableExpirationCheckbox,
  noExpirationCheckboxTooltip,
  myPublicKeys,
  volumes,
  instanceTypes,
  canEditRDPPassword,
  canEditInstanceType,
  canEditSshKeys,
}: Props): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as "object",
    properties: {
      hostName: {
        title: "Edit Host Name",
        type: "string",
      },
      expirationDetails: {
        title: "",
        type: "object" as "object",
        properties: {
          expiration: {
            type: "string" as "string",
            title: "Edit Expiration",
          },
          noExpiration: {
            type: "boolean" as "boolean",
            title: "Never expire",
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
        oneOf: volumes.map((v) => ({
          type: "string" as "string",
          title: `(${v.size}GB) ${v.displayName || v.id}`,
          enum: [v.id],
        })),
      },
      ...(canEditRDPPassword && {
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
                    oneOf:
                      myPublicKeys?.map((d) => ({
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
        "ui:data-cy": "never-expire-checkbox",
        "ui:elementWrapperCSS": checkboxCSS,
      },
    },
    instanceType: {
      "ui:widget": AntdSelect,
      "ui:hideError": true,
      "ui:description":
        "Instance type can only be changed when the host is stopped.",
      "ui:disabled": !canEditInstanceType,
    },
    volume: {
      "ui:widget": AntdSelect,
      "ui:hideError": true,
      "ui:allowDeselect": false,
      "ui:data-cy": "volume-select",
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
      },
    },
    publicKeySection: {
      useExisting: {
        "ui:widget": widgets.RadioBoxWidget,
        "ui:description":
          "SSH keys can only be added when the host is running.",
        "ui:disabled": !canEditSshKeys,
      },
      publicKeyNameDropdown: {
        "ui:widget": AntdSelect,
        "ui:hideError": true,
        "ui:valuePlaceholder": "Select a key",
        "ui:data-cy": "key-select",
        "ui:disabled": !canEditSshKeys,
      },
      newPublicKey: {
        "ui:widget": LeafyGreenTextArea,
        "ui:data-cy": "key-value-text-area",
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
