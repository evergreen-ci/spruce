import { AjvError } from "@rjsf/core";

export const transformErrors = (errors: AjvError[]) =>
  errors
    .map((error) => {
      switch (error.name) {
        case "enum":
          return {
            ...error,
            message: "",
          };
        case "required":
          return {
            ...error,
            message: "Value is required.",
          };
        case "type":
          return {
            ...error,
            message: `Value should be a ${error.params.type}.`,
          };
        case "minimum":
        case "maximum":
          return {
            ...error,
            message: `Value should be ${error.params.comparison} ${error.params.limit}.`,
          };
        case "minLength":
          return {
            ...error,
            message: "",
          };
        case "format":
          switch (error.params.format) {
            case "noSpaces":
              return {
                ...error,
                message: "Value should not contain spaces.",
              };
            case "validDuration":
              return {
                ...error,
                message: "Duration should be a positive integer.",
              };
            case "validEmail":
              return {
                ...error,
                message: "Value should be a valid email.",
              };
            case "validJiraTicket":
              return {
                ...error,
                message: "Value should be a valid JIRA ticket.",
              };
            case "validJiraURL":
              return {
                ...error,
                message: "Value should be a valid JIRA URL.",
              };
            case "validPercentage":
              return {
                ...error,
                message: "Percentage should be a positive integer.",
              };
            case "validRegex":
              return {
                ...error,
                message: "Value should be a valid regex expression.",
              };
            case "validSlack":
              return {
                ...error,
                message: "Value should be a valid Slack username or channel.",
              };
            case "validURL":
              return {
                ...error,
                message: "Value should be a valid URL.",
              };
            default:
              return { ...error, message: "" };
          }
        default:
          return error;
      }
    })
    .filter((e) => e);
