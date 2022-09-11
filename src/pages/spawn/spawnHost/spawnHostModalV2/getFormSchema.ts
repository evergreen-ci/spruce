import { css } from "@emotion/react";
import widgets from "components/SpruceForm/Widgets";
import { LeafyGreenTextArea } from "components/SpruceForm/Widgets/LeafyGreenWidgets";
import { SearchableDropdownWidget } from "components/SpruceForm/Widgets/SearchableDropdown";
import { GetMyPublicKeysQuery } from "gql/generated/types";
import { GetFormSchema } from "pages/projectSettings/tabs/types";

interface Props {
  distros: {
    name?: string;
    isVirtualWorkStation: boolean;
  }[];
  awsRegions: string[];
  userAwsRegion: string;
  publicKeys: GetMyPublicKeysQuery["myPublicKeys"];
}

const dropdownWrapperClassName = css`
  max-width: 225px;
`;

const textAreaWrapperClassName = css`
  max-width: 400px;
`;
export const getFormSchema = ({
  distros,
  awsRegions,
  userAwsRegion,
  publicKeys,
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
        default: userAwsRegion ?? "",
        oneOf: [
          ...(awsRegions?.map((r) => ({
            type: "string" as "string",
            title: r,
            enum: [r],
          })) || []),
        ],
      },
      publicKeySection: {
        title: "Public key",
        type: "object",
        properties: {
          useExisting: {
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
                    title: "Existing key",
                    type: "string" as "string",
                    default: "",
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
                },
              },
            ],
          },
        },
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
    publicKeySection: {
      useExisting: {
        "ui:showLabel": false,
        "ui:widget": widgets.RadioBoxWidget,
      },
      publicKeyNameDropdown: {
        "ui:widget": SearchableDropdownWidget,
        "ui:elementWrapperCSS": dropdownWrapperClassName,
        "ui:valuePlaceholder": "Select a key",
      },
      newPublicKey: {
        "ui:widget": LeafyGreenTextArea,
        "ui:elementWrapperCSS": textAreaWrapperClassName,
      },
    },
  },
});
