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
        case "minLength":
          return {
            ...error,
            message: "",
          };
        case "format":
          return {
            ...error,
            message: "",
          };
        default:
          return error;
      }
    })
    .filter((e) => e);
