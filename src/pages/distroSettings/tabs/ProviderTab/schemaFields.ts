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

const poolMappingInfo = {
  type: "string" as "string",
  title: "Pool Mapping Information",
};

const amiId = {
  type: "string" as "string",
  title: "EC2 AMI ID",
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
  title:
    "Use the capacity-optimized allocation strategy for spot (default: lowest-cost)",
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
              enum: [FleetInstanceType.Spot],
            },
            useCapacityOptimization,
          },
        },
        {
          properties: {
            fleetInstanceType: {
              enum: [FleetInstanceType.SpotWithOnDemandFallback],
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
  userData,
  mergeUserData,
  securityGroups,
};

export const dockerProviderSettings = {
  imageUrl,
  buildType,
  registryUsername,
  registryPassword,
  poolMappingInfo,
  userData,
  mergeUserData,
  securityGroups,
};

export const ec2FleetProviderSettings = {
  amiId,
  instanceType,
  sshKeyName,
  fleetOptions,
  instanceProfileARN,
  userData,
  mergeUserData,
  securityGroups,
  vpcOptions,
  mountPoints,
};
