import { AccordionFieldTemplate } from "components/SpruceForm/FieldTemplates";
import {
  textAreaCSS,
  mergeCheckboxCSS,
  capacityCheckboxCSS,
  indentCSS,
} from "./styles";
import { BuildType, FleetInstanceType } from "./types";

const userData = {
  schema: {
    type: "string" as "string",
    title: "User Data",
  },
  uiSchema: {
    "ui:widget": "textarea",
    "ui:elementWrapperCSS": textAreaCSS,
    "ui:rows": 6,
  },
};

const mergeUserData = {
  schema: {
    type: "boolean" as "boolean",
    title: "Merge with existing user data",
  },
  uiSchema: {
    "ui:elementWrapperCSS": mergeCheckboxCSS,
  },
};

const securityGroups = {
  schema: {
    type: "array" as "array",
    title: "Security Groups",
    items: {
      type: "string" as "string",
      title: "Security Group ID",
      default: "",
      minLength: 1,
      pattern: "^sg-.*",
    },
  },
  uiSchema: {
    "ui:addButtonText": "Add security group",
    "ui:orderable": false,
  },
};

const hosts = {
  schema: {
    type: "array" as "array",
    title: "Hosts",
    items: {
      type: "object" as "object",
      properties: {
        name: {
          type: "string" as "string",
          title: "Name",
          minLength: 1,
        },
      },
    },
  },
  uiSchema: {
    "ui:addButtonText": "Add host",
    "ui:orderable": false,
  },
};

const imageUrl = {
  schema: {
    type: "string" as "string",
    title: "Docker Image URL",
    default: "",
    format: "validURL",
    minLength: 1,
  },
  uiSchema: {
    "ui:description": "Docker image URL to import on host machine.",
  },
};

const buildType = {
  schema: {
    type: "string" as "string",
    title: "Image Build Method",
    default: BuildType.Import,
    oneOf: [
      {
        type: "string" as "string",
        title: "Import",
        enum: [BuildType.Import],
      },
      {
        type: "string" as "string",
        title: "Pull",
        enum: [BuildType.Pull],
      },
    ],
  },
  uiSchema: {
    "ui:allowDeselect": false,
  },
};

const registryUsername = {
  schema: {
    type: "string" as "string",
    title: "Username for Registries",
  },
  uiSchema: {
    "ui:optional": true,
  },
};

const registryPassword = {
  schema: { type: "string" as "string", title: "Password for Registries" },
  uiSchema: {
    "ui:optional": true,
    "ui:inputType": "password",
  },
};

const amiId = {
  schema: {
    type: "string" as "string",
    title: "EC2 AMI ID",
    default: "",
    minLength: 1,
  },
  uiSchema: {
    "ui:placeholder": "e.g. ami-1ecba176",
  },
};

const instanceType = {
  schema: {
    type: "string" as "string",
    title: "Instance Type",
  },
  uiSchema: {
    "ui:description": "EC2 instance type for the AMI. Must be available.",
    "ui:placeholder": "e.g. t1.micro",
  },
};

const sshKeyName = {
  schema: {
    type: "string" as "string",
    title: "SSH Key Name",
  },
  uiSchema: {
    "ui:description": "SSH key to add to the host machine.",
  },
};

const fleetOptions = {
  schema: {
    type: "object" as "object",
    title: "",
    properties: {
      fleetInstanceType: {
        type: "string" as "string",
        title: "Fleet Instance Type",
        default: FleetInstanceType.Spot,
        oneOf: [
          {
            type: "string" as "string",
            title: "Spot",
            enum: [FleetInstanceType.Spot],
          },
          {
            type: "string" as "string",
            title: "Spot with on-demand fallback",
            enum: [FleetInstanceType.SpotWithOnDemandFallback],
          },
          {
            type: "string" as "string",
            title: "On-demand",
            enum: [FleetInstanceType.OnDemand],
          },
        ],
      },
    },
    dependencies: {
      fleetInstanceType: {
        oneOf: [
          {
            properties: {
              fleetInstanceType: {
                enum: [FleetInstanceType.OnDemand],
              },
            },
          },
          {
            properties: {
              fleetInstanceType: {
                enum: [
                  FleetInstanceType.Spot,
                  FleetInstanceType.SpotWithOnDemandFallback,
                ],
              },
              useCapacityOptimization: {
                type: "boolean" as "boolean",
                title: "Capacity optimization",
                default: false,
              },
            },
          },
        ],
      },
    },
  },
  uiSchema: {
    fleetInstanceType: {
      "ui:allowDeselect": false,
    },
    useCapacityOptimization: {
      "ui:data-cy": "use-capacity-optimization",
      "ui:bold": true,
      "ui:description":
        "Use the capacity-optimized allocation strategy for spot (default: lowest-cost)",
      "ui:elementWrapperCSS": capacityCheckboxCSS,
    },
  },
};

const instanceProfileARN = {
  schema: {
    type: "string" as "string",
    title: "IAM Instance Profile ARN",
  },
  uiSchema: {
    "ui:description": "The Amazon Resource Name (ARN) of the instance profile.",
  },
};

const vpcOptions = {
  schema: {
    type: "object" as "object",
    title: "",
    properties: {
      useVpc: {
        type: "boolean" as "boolean",
        title: "Use security groups in an EC2 VPC",
        default: false,
      },
    },
    dependencies: {
      useVpc: {
        oneOf: [
          {
            properties: {
              useVpc: {
                enum: [true],
              },
              subnetId: {
                type: "string" as "string",
                title: "Default VPC Subnet ID",
                default: "",
                minLength: 1,
                pattern: "^subnet-.*",
              },
              subnetPrefix: {
                type: "string" as "string",
                title: "VPC Subnet Prefix",
                default: "",
                minLength: 1,
              },
            },
          },
          {
            properties: {
              useVpc: {
                enum: [false],
              },
            },
          },
        ],
      },
    },
  },
  uiSchema: {
    useVpc: {
      "ui:data-cy": "use-vpc",
    },
    subnetId: {
      "ui:placeholder": "e.g. subnet-xxxx",
      "ui:elementWrapperCSS": indentCSS,
    },
    subnetPrefix: {
      "ui:description":
        "Looks for subnets like <prefix>.subnet_1a, <prefix>.subnet_1b, etc.",
      "ui:elementWrapperCSS": indentCSS,
    },
  },
};

const mountPoints = {
  schema: {
    type: "array" as "array",
    title: "Mount Points",
    items: {
      type: "object" as "object",
      properties: {
        deviceName: {
          type: "string" as "string",
          title: "Device Name",
          default: "",
          minLength: 1,
        },
        virtualName: {
          type: "string" as "string",
          title: "Virtual Name",
        },
        volumeType: {
          type: "string" as "string",
          title: "Volume Type",
        },
        iops: {
          type: "number" as "number",
          title: "IOPS",
        },
        throughput: {
          type: "number" as "number",
          title: "Throughput",
        },
        size: {
          type: "number" as "number",
          title: "Size",
        },
      },
    },
  },
  uiSchema: {
    "ui:data-cy": "mount-points",
    "ui:addButtonText": "Add mount point",
    "ui:orderable": false,
    "ui:topAlignDelete": true,
    items: {
      "ui:ObjectFieldTemplate": AccordionFieldTemplate,
      "ui:defaultOpen": true,
      "ui:numberedTitle": "Mount Point",
    },
  },
};

export const staticProviderSettings = {
  schema: {
    mergeUserData: mergeUserData.schema,
    userData: userData.schema,
    securityGroups: securityGroups.schema,
    hosts: hosts.schema,
  },
  uiSchema: {
    mergeUserData: mergeUserData.uiSchema,
    userData: userData.uiSchema,
    securityGroups: securityGroups.uiSchema,
    hosts: hosts.uiSchema,
  },
};

export const dockerProviderSettings = {
  schema: {
    buildType: buildType.schema,
    imageUrl: imageUrl.schema,
    registryUsername: registryUsername.schema,
    registryPassword: registryPassword.schema,
    mergeUserData: mergeUserData.schema,
    userData: userData.schema,
    securityGroups: securityGroups.schema,
  },
  uiSchema: {
    buildType: buildType.uiSchema,
    imageUrl: imageUrl.uiSchema,
    registryUsername: registryUsername.uiSchema,
    registryPassword: registryPassword.uiSchema,
    mergeUserData: mergeUserData.uiSchema,
    userData: userData.uiSchema,
    securityGroups: securityGroups.uiSchema,
  },
};

export const ec2FleetProviderSettings = {
  schema: {
    amiId: amiId.schema,
    instanceType: instanceType.schema,
    sshKeyName: sshKeyName.schema,
    fleetOptions: fleetOptions.schema,
    instanceProfileARN: instanceProfileARN.schema,
    mergeUserData: mergeUserData.schema,
    userData: userData.schema,
    securityGroups: securityGroups.schema,
    vpcOptions: vpcOptions.schema,
    mountPoints: mountPoints.schema,
  },
  uiSchema: {
    amiId: amiId.uiSchema,
    instanceType: instanceType.uiSchema,
    sshKeyName: sshKeyName.uiSchema,
    instanceProfileARN: instanceProfileARN.uiSchema,
    fleetOptions: fleetOptions.uiSchema,
    mergeUserData: mergeUserData.uiSchema,
    userData: userData.uiSchema,
    securityGroups: securityGroups.uiSchema,
    vpcOptions: vpcOptions.uiSchema,
    mountPoints: mountPoints.uiSchema,
  },
};

export const ec2OnDemandProviderSettings = {
  schema: {
    amiId: amiId.schema,
    instanceType: instanceType.schema,
    sshKeyName: sshKeyName.schema,
    instanceProfileARN: instanceProfileARN.schema,
    mergeUserData: mergeUserData.schema,
    userData: userData.schema,
    securityGroups: securityGroups.schema,
    vpcOptions: vpcOptions.schema,
    mountPoints: mountPoints.schema,
  },
  uiSchema: {
    amiId: amiId.uiSchema,
    instanceType: instanceType.uiSchema,
    sshKeyName: sshKeyName.uiSchema,
    instanceProfileARN: instanceProfileARN.uiSchema,
    mergeUserData: mergeUserData.uiSchema,
    userData: userData.uiSchema,
    securityGroups: securityGroups.uiSchema,
    vpcOptions: vpcOptions.uiSchema,
    mountPoints: mountPoints.uiSchema,
  },
};
