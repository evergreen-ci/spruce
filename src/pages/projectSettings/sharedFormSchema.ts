export const projectName = {
  schema: {
    format: "noSpaces",
    minLength: 1,
    title: "Project Name",
    type: "string" as "string",
  },
  uiSchema: {
    "ui:data-cy": "project-name-input",
  },
};

export const projectId = {
  schema: {
    format: "noSpaces",
    title: "Project ID",
    type: "string" as "string",
  },
  uiSchema: {
    "ui:data-cy": "project-id-input",
    "ui:description":
      "Project ID is used by Evergreen internally; it should only be user-specified with good reason, such as if the project will be using performance tooling. It cannot be changed!",
    "ui:optional": true,
  },
};

export const requestS3Creds = {
  schema: {
    default: false,
    title: "Open a JIRA ticket to request an S3 Bucket from the Build team",
    type: "boolean" as "boolean",
  },
  uiSchema: {
    "ui:data-cy": "request-s3-creds",
  },
};
