import Banner from "@leafygreen-ui/banner";
import { Field } from "@rjsf/core";

export const projectName = {
  schema: {
    type: "string" as "string",
    title: "Project Name",
    minLength: 1,
    format: "noSpecialCharacters",
  },
  uiSchema: {
    "ui:data-cy": "project-name-input",
  },
};

export const enablePerformanceTooling = {
  schema: {
    type: "boolean" as "boolean",
    title: "Enable performance tooling",
    default: false,
  },
  uiSchema: {
    "ui:data-cy": "enable-performance-tooling",
  },
};

export const PerformanceToolingBanner: Field = () => (
  <Banner
    variant="warning"
    data-cy="performance-tooling-banner"
    style={{ marginBottom: "20px" }}
  >
    Please confirm your preferences before creating your project. You will not
    be able to configure the project for performance tooling at a later date.
  </Banner>
);

export const requestS3Creds = {
  schema: {
    type: "boolean" as "boolean",
    title: "Open a JIRA ticket to request an S3 Bucket from the Build team",
    default: false,
  },
  uiSchema: {
    "ui:data-cy": "request-s3-creds",
  },
};
