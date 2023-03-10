import { css } from "@emotion/react";
import { add } from "date-fns";
import { GetFormSchema } from "components/SpruceForm/types";
import { ExpirationRow } from "../ExpirationRow";

interface Props {
  disableExpirationCheckbox: boolean;
  hasName: boolean;
  noExpirationCheckboxTooltip: string;
}

export const getFormSchema = ({
  disableExpirationCheckbox,
  hasName,
  noExpirationCheckboxTooltip,
}: Props): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        title: "Volume Name",
        // The back end requires a name if one has previously been set, so prevent users from unsetting a name.
        ...(hasName && { minLength: 1 }),
      },
      expirationDetails: {
        type: "object",
        properties: {
          expiration: {
            type: "string" as "string",
            title: "Expiration",
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
    },
  },
  uiSchema: {
    name: {
      "ui:data-cy": "volume-name-input",
    },
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
