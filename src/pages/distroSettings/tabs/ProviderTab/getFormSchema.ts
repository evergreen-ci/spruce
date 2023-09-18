import { css } from "@emotion/react";
import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import { STANDARD_FIELD_WIDTH } from "components/SpruceForm/utils";
import { Provider, ContainerPool } from "gql/generated/types";
import { dockerProviderSettings, staticProviderSettings } from "./schemaFields";

export const getFormSchema = ({
  poolMappingInfo,
  pools,
}: {
  poolMappingInfo: string;
  pools: ContainerPool[];
}): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as "object",
    properties: {
      provider: {
        type: "object" as "object",
        title: "",
        properties: {
          providerName: {
            type: "string" as "string",
            title: "Provider",
            oneOf: [
              {
                type: "string" as "string",
                title: "Static IP/VM",
                enum: [Provider.Static],
              },
              {
                type: "string" as "string",
                title: "Docker",
                enum: [Provider.Docker],
              },
              {
                type: "string" as "string",
                title: "EC2 Fleet",
                enum: [Provider.Ec2Fleet],
              },
              {
                type: "string" as "string",
                title: "EC2 On Demand",
                enum: [Provider.Ec2OnDemand],
              },
            ],
          },
        },
      },
    },
    dependencies: {
      provider: {
        oneOf: [
          {
            properties: {
              provider: {
                properties: {
                  providerName: {
                    enum: [Provider.Static],
                  },
                },
              },
              staticProviderSettings: {
                type: "object" as "object",
                title: "",
                properties: staticProviderSettings,
              },
            },
          },
          {
            properties: {
              provider: {
                properties: {
                  providerName: {
                    enum: [Provider.Docker],
                  },
                },
              },
              dockerProviderSettings: {
                type: "object" as "object",
                title: "",
                properties: {
                  imageUrl: dockerProviderSettings.imageUrl,
                  buildType: dockerProviderSettings.buildType,
                  registryUsername: dockerProviderSettings.registryUsername,
                  registryPassword: dockerProviderSettings.registryPassword,
                  containerPoolId: {
                    type: "string" as "string",
                    title: "Container Pool ID",
                    default: "",
                    oneOf: pools.map((p) => ({
                      type: "string" as "string",
                      title: p.id,
                      enum: [p.id],
                    })),
                  },
                  poolMappingInfo: dockerProviderSettings.poolMappingInfo,
                  userData: dockerProviderSettings.userData,
                  mergeUserData: dockerProviderSettings.mergeUserData,
                  securityGroups: dockerProviderSettings.securityGroups,
                },
              },
            },
          },
        ],
      },
    },
  },
  uiSchema: {
    provider: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      providerName: {
        "ui:allowDeselect": false,
        "ui:data-cy": "provider-select",
      },
    },
    staticProviderSettings: {
      "ui:data-cy": "static-provider-settings",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      userData: {
        "ui:widget": "textarea",
        "ui:elementWrapperCSS": textAreaCSS,
      },
      securityGroups: {
        "ui:addButtonText": "Add security group",
        "ui:orderable": false,
      },
    },
    dockerProviderSettings: {
      "ui:data-cy": "docker-provider-settings",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      userData: {
        "ui:widget": "textarea",
        "ui:elementWrapperCSS": textAreaCSS,
      },
      securityGroups: {
        "ui:addButtonText": "Add security group",
        "ui:orderable": false,
      },
      buildType: {
        "ui:allowDeselect": false,
      },
      registryUsername: {
        "ui:optional": true,
      },
      registryPassword: {
        "ui:optional": true,
        "ui:inputType": "password",
      },
      containerPoolId: {
        "ui:allowDeselect": false,
        "ui:placeholder": "Select a pool",
      },
      poolMappingInfo: {
        "ui:widget": poolMappingInfo.length > 0 ? "textarea" : "hidden",
        "ui:placeholder": poolMappingInfo,
        "ui:elementWrapperCSS": poolMappingInfoCss,
        "ui:readonly": true,
      },
    },
  },
});

const textAreaCSS = css`
  box-sizing: border-box;
  max-width: ${STANDARD_FIELD_WIDTH}px;
`;

const poolMappingInfoCss = css`
  ${textAreaCSS};
  textarea {
    min-height: 140px;
  }
`;
