import { AjvError } from "@rjsf/core";

export const transformErrors = (errors: AjvError[]) =>
  errors
    .map((error) => {
      switch (error.name) {
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
            case "validURL":
              return {
                ...error,
                message: "Value should be a valid URL.",
              };
            case "validJiraTicket":
              return {
                ...error,
                message: "Value should be a valid Jira ticket URL.",
              };
            default:
              return { ...error, message: "" };
          }
        default:
          return error;
      }
    })
    .filter((e) => e);
