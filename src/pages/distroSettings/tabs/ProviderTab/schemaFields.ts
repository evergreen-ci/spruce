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

const userData = {
  type: "string" as "string",
  title: "User Data",
};

export const staticProviderSettings = {
  userData,
  mergeUserData,
  securityGroups,
};

export const uiSchema = {
  providerSettings: {
    userData: {
      "ui:widget": "textarea",
    },
    securityGroups: {
      "ui:addButtonText": "Add security group",
    },
  },
};
