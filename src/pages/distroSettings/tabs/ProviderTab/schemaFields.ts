import { BuildType } from "./types";

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
