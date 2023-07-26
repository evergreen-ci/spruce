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
            title: "Expiration",
            type: "string" as "string",
          },
          noExpiration: {
            title: "Never expire",
            type: "boolean" as "boolean",
          },
        },
        type: "object",
      },
      name: {
        title: "Volume Name",
        type: "string",
        // The back end requires a name if one has previously been set, so prevent users from unsetting a name.
        ...(hasName && { minLength: 1 }),
      },
    },
    type: "object",
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
    name: {
      "ui:data-cy": "volume-name-input",
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
