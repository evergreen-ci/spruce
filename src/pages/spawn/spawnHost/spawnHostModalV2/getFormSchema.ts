import { css } from "@emotion/react";
import widgets from "components/SpruceForm/Widgets";
import { SearchableDropdownWidget } from "components/SpruceForm/Widgets/SearchableDropdown";
import { GetFormSchema } from "pages/projectSettings/tabs/types";

interface Props {
  distros: {
    name?: string;
    isVirtualWorkStation: boolean;
  }[];
  awsRegions: string[];
  userAwsRegion: string;
}

const dropdownWrapperClassName = css`
  max-width: 225px;
`;
export const getFormSchema = ({
  distros,
  awsRegions,
  userAwsRegion,
}: Props): ReturnType<GetFormSchema> => ({
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
        default: "",
        oneOf: [
          ...(distros?.map((d) => ({
            type: "string" as "string",
            title: d.name,
            enum: [d.name],
          })) || []),
        ],
      },
      region: {
        type: "string" as "string",
        title: "Region",
        description: "oh rly?",
        default: userAwsRegion ?? "",
        oneOf: [
          ...(awsRegions?.map((r) => ({
            type: "string" as "string",
            title: r,
            enum: [r],
          })) || []),
        ],
      },
      publicKeyTitle: {
        title: "Public Key",
        type: "null",
      },
      publicKey: {
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
  },
  uiSchema: {
    distro: {
      "ui:widget": SearchableDropdownWidget,
      "ui:elementWrapperCSS": dropdownWrapperClassName,
      "ui:valuePlaceholder": "Select a distro",
    },
    region: {
      "ui:widget": SearchableDropdownWidget,
      "ui:elementWrapperCSS": dropdownWrapperClassName,
      "ui:valuePlaceholder": "Select a region",
    },
    publicKey: {
      "ui:widget": widgets.RadioBoxWidget,
      "ui:showLabel": false,
    },
  },
});
