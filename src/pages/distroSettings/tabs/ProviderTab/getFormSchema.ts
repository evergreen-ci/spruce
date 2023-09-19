import { css } from "@emotion/react";
import { GetFormSchema } from "components/SpruceForm";
import {
  CardFieldTemplate,
  AccordionFieldTemplate,
} from "components/SpruceForm/FieldTemplates";
import { STANDARD_FIELD_WIDTH } from "components/SpruceForm/utils";
import { Provider, ContainerPool } from "gql/generated/types";
import {
  dockerProviderSettings,
  staticProviderSettings,
  ec2FleetProviderSettings,
} from "./schemaFields";

export const getFormSchema = ({
  awsRegions,
  fleetRegions,
  poolMappingInfo,
  pools,
}: {
  awsRegions: string[];
  poolMappingInfo: string;
  pools: ContainerPool[];
  fleetRegions: string[];
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
          {
            properties: {
              provider: {
                properties: {
                  providerName: {
                    enum: [Provider.Ec2Fleet],
                  },
                },
              },
              ec2FleetProviderSettings: {
                type: "array" as "array",
                minItems: 1,
                title: "",
                items: {
                  type: "object" as "object",
                  properties: {
                    region: {
                      type: "string" as "string",
                      title: "Region",
                      default: "",
                      oneOf: awsRegions.map((r) => ({
                        type: "string" as "string",
                        title: r,
                        enum: [r],
                      })),
                    },
                    ...ec2FleetProviderSettings,
                  },
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
    ec2FleetProviderSettings: {
      "ui:data-cy": "ec2-fleet-provider-settings",
      "ui:addable": awsRegions.length !== fleetRegions.length,
      "ui:addButtonText": "Add region settings",
      "ui:orderable": false,
      "ui:useExpandableCard": true,
      items: {
        "ui:displayTitle": "New AWS Region",
        userData: {
          "ui:widget": "textarea",
          "ui:elementWrapperCSS": textAreaCSS,
        },
        securityGroups: {
          "ui:addButtonText": "Add security group",
          "ui:orderable": false,
        },
        region: {
          "ui:data-cy": "region-select",
          "ui:allowDeselect": false,
          "ui:enumDisabled": fleetRegions,
        },
        amiId: {
          "ui:placeholder": "e.g. ami-1ecba176",
        },
        instanceType: {
          "ui:description": "EC2 instance type for the AMI. Must be available.",
          "ui:placeholder": "e.g. t1.micro",
        },
        fleetOptions: {
          fleetInstanceType: {
            "ui:allowDeselect": false,
          },
          useCapacityOptimization: {
            "ui:data-cy": "use-capacity-optimization",
          },
        },
        vpcOptions: {
          useVpc: {
            "ui:data-cy": "use-vpc",
          },
          subnetId: {
            "ui:placeholder": "e.g. subnet-xxxx",
          },
          subnetPrefix: {
            "ui:description":
              "Will look for subnets like <prefix>.subnet_1a, <prefix>.subnet_1b, etc.",
          },
        },
        mountPoints: {
          "ui:data-cy": "mount-points",
          "ui:addButtonText": "Add mount point",
          "ui:orderable": true,
          "ui:topAlignDelete": true,
          items: {
            "ui:ObjectFieldTemplate": AccordionFieldTemplate,
            "ui:numberedTitle": "Mount Point",
          },
        },
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
