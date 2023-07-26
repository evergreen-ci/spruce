import { css } from "@emotion/react";
import { add } from "date-fns";
import { GetFormSchema } from "components/SpruceForm/types";
import { ExpirationRow } from "../ExpirationRow";
import { getDefaultExpiration } from "../utils";

interface Props {
  availabilityZones: string[];
  disableExpirationCheckbox: boolean;
  hosts: { id: string; displayName: string }[];
  maxSpawnableLimit: number;
  noExpirationCheckboxTooltip: string;
  types: string[];
}

export const getFormSchema = ({
  availabilityZones,
  disableExpirationCheckbox,
  hosts,
  maxSpawnableLimit,
  noExpirationCheckboxTooltip,
  types,
}: Props): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    properties: {
      optionalVolumeInformation: {
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
                title: "Expiration",
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
          mountToHost: {
            default: "",
            oneOf: [
              {
                enum: [""],
                title: "Select host…",
                type: "string" as "string",
              },
              ...hosts.map((h) => ({
                enum: [h.id],
                title: h.displayName,
                type: "string" as "string",
              })),
            ],
            title: "Mount to Host",
            type: "string" as "string",
          },
        },
        title: "Optional Volume Information",
        type: "object" as "object",
      },
      requiredVolumeInformation: {
        properties: {
          availabilityZone: {
            default: availabilityZones?.[0] ?? "",
            oneOf: availabilityZones.map((r) => ({
              enum: [r],
              title: r,
              type: "string" as "string",
            })),
            title: "Region",
            type: "string" as "string",
          },
          size: {
            default: maxSpawnableLimit > 500 ? 500 : maxSpawnableLimit,
            maximum: maxSpawnableLimit,
            minimum: 1,
            title: "Size (GiB)",
            type: "number" as "number",
          },
          type: {
            default: types?.[0] ?? "",
            oneOf: types.map((t) => ({
              enum: [t],
              title: t,
              type: "string" as "string",
            })),
            title: "Type",
            type: "string" as "string",
          },
        },
        title: "Required Volume Information",
        type: "object" as "object",
      },
    },
    type: "object" as "object",
  },
  uiSchema: {
    optionalVolumeInformation: {
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
      mountToHost: {
        "ui:allowDeselect": false,
        "ui:data-cy": "host-select",
        "ui:description": hosts.length === 0 ? "No hosts available." : "",
        "ui:disabled": hosts.length === 0,
      },
    },
    requiredVolumeInformation: {
      availabilityZone: {
        "ui:allowDeselect": false,
        "ui:data-cy": "availability-zone-select",
      },
      size: {
        "ui:data-cy": "volume-size-input",
        "ui:description": `The max spawnable volume size is ${maxSpawnableLimit} GiB.`,
      },
      type: {
        "ui:allowDeselect": false,
        "ui:data-cy": "type-select",
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
