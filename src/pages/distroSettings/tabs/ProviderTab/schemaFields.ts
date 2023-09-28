import { AccordionFieldTemplate } from "components/SpruceForm/FieldTemplates";
import {
  userDataCSS,
  mergeCheckboxCSS,
  capacityCheckboxCSS,
  indentCSS,
} from "./styles";
import { BuildType, FleetInstanceType } from "./types";

const userData = {
  type: "string" as "string",
  title: "User Data",
};

const mergeUserData = {
  type: "boolean" as "boolean",
  title: "Merge with existing user data",
};

const securityGroups = {
  type: "array" as "array",
  title: "Security Groups",
  items: {
    type: "string" as "string",
    title: "Security Group ID",
    default: "",
    minLength: 1,
  },
};

const hosts = {
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
};

const imageUrl = {
  type: "string" as "string",
  title: "Docker Image URL",
  default: "",
  format: "validURL",
  minLength: 1,
};

const buildType = {
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
};

const registryUsername = {
  type: "string" as "string",
  title: "Username for Registries",
};

const registryPassword = {
  type: "string" as "string",
  title: "Password for Registries",
};

const amiId = {
  type: "string" as "string",
  title: "EC2 AMI ID",
  default: "",
  minLength: 1,
};

const instanceType = {
  type: "string" as "string",
  title: "Instance Type",
};

const sshKeyName = {
  type: "string" as "string",
  title: "SSH Key Name",
};

const fleetInstanceType = {
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
};

const useCapacityOptimization = {
  type: "boolean" as "boolean",
  title: "Capacity optimization",
  default: false,
};

const fleetOptions = {
  type: "object" as "object",
  title: "",
  properties: {
    fleetInstanceType,
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
            useCapacityOptimization,
          },
        },
      ],
    },
  },
};

const instanceProfileARN = {
  type: "string" as "string",
  title: "IAM Instance Profile ARN",
};

const useVpc = {
  type: "boolean" as "boolean",
  title: "Use security groups in an EC2 VPC",
  default: false,
};

const subnetId = {
  type: "string" as "string",
  title: "Default VPC Subnet ID",
};

const subnetPrefix = {
  type: "string" as "string",
  title: "VPC Subnet Prefix",
};

const vpcOptions = {
  type: "object" as "object",
  title: "",
  properties: {
    useVpc,
  },
  dependencies: {
    useVpc: {
      oneOf: [
        {
          properties: {
            useVpc: {
              enum: [true],
            },
            subnetId,
            subnetPrefix,
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
};

const mountPoints = {
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
};

export const staticProviderSettings = {
  schema: {
    mergeUserData,
    userData,
    securityGroups,
    hosts,
  },
  uiSchema: {
    mergeUserData: {
      "ui:elementWrapperCSS": mergeCheckboxCSS,
    },
    userData: {
      "ui:widget": "textarea",
      "ui:elementWrapperCSS": userDataCSS,
      "ui:rows": 6,
    },
    securityGroups: {
      "ui:addButtonText": "Add security group",
      "ui:orderable": false,
    },
    hosts: {
      "ui:orderable": false,
      "ui:addButtonText": "Add host",
    },
  },
};

export const dockerProviderSettings = {
  schema: {
    buildType,
    imageUrl,
    registryUsername,
    registryPassword,
    mergeUserData,
    userData,
    securityGroups,
  },
  uiSchema: {
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
    mergeUserData: {
      "ui:elementWrapperCSS": mergeCheckboxCSS,
    },
    userData: {
      "ui:widget": "textarea",
      "ui:elementWrapperCSS": userDataCSS,
      "ui:rows": 6,
    },
    securityGroups: {
      "ui:addButtonText": "Add security group",
      "ui:orderable": false,
    },
  },
};

export const ec2FleetProviderSettings = {
  schema: {
    amiId,
    instanceType,
    sshKeyName,
    fleetOptions,
    instanceProfileARN,
    mergeUserData,
    userData,
    securityGroups,
    vpcOptions,
    mountPoints,
  },
  uiSchema: {
    amiId: {
      "ui:placeholder": "e.g. ami-1ecba176",
    },
    instanceType: {
      "ui:description": "EC2 instance type for the AMI. Must be available.",
      "ui:placeholder": "e.g. t1.micro",
    },
    sshKeyName: {
      "ui:description": "SSH key to add to the host machine.",
    },
    fleetOptions: {
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
    mergeUserData: {
      "ui:elementWrapperCSS": mergeCheckboxCSS,
    },
    userData: {
      "ui:widget": "textarea",
      "ui:elementWrapperCSS": userDataCSS,
      "ui:rows": 6,
    },
    securityGroups: {
      "ui:addButtonText": "Add security group",
      "ui:orderable": false,
    },
    vpcOptions: {
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
    mountPoints: {
      "ui:data-cy": "mount-points",
      "ui:addButtonText": "Add mount point",
      "ui:orderable": false,
      "ui:topAlignDelete": true,
      items: {
        "ui:ObjectFieldTemplate": AccordionFieldTemplate,
        "ui:numberedTitle": "Mount Point",
      },
    },
  },
};

export const ec2OnDemandProviderSettings = {
  schema: {
    amiId,
    instanceType,
    sshKeyName,
    instanceProfileARN,
    mergeUserData,
    userData,
    securityGroups,
    vpcOptions,
    mountPoints,
  },
  uiSchema: {
    amiId: {
      "ui:placeholder": "e.g. ami-1ecba176",
    },
    instanceType: {
      "ui:description": "EC2 instance type for the AMI. Must be available.",
      "ui:placeholder": "e.g. t1.micro",
    },
    sshKeyName: {
      "ui:description": "SSH key to add to the host machine.",
    },
    mergeUserData: {
      "ui:elementWrapperCSS": mergeCheckboxCSS,
    },
    userData: {
      "ui:widget": "textarea",
      "ui:elementWrapperCSS": userDataCSS,
      "ui:rows": 6,
    },
    securityGroups: {
      "ui:addButtonText": "Add security group",
      "ui:orderable": false,
    },
    vpcOptions: {
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
    mountPoints: {
      "ui:data-cy": "mount-points",
      "ui:addButtonText": "Add mount point",
      "ui:orderable": false,
      "ui:topAlignDelete": true,
      items: {
        "ui:ObjectFieldTemplate": AccordionFieldTemplate,
        "ui:numberedTitle": "Mount Point",
      },
    },
  },
};
