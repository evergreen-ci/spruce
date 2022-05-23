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
          if (error.params.format === "noSpaces") {
            return {
              ...error,
              message: "Value should not contain a space.",
            };
          }
          return {
            ...error,
            message: "",
          };
        default:
          return error;
      }
    })
    .filter((e) => e);
