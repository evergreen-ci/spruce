import { FieldValidation, FormProps, Field } from "@rjsf/core";

// typescript utility to recursively iterate through an object and add a method called addError to each property
type RecursivelyAddError<T> = T extends object
  ? {
      [K in keyof T]: RecursivelyAddError<T[K]>;
    } & FieldValidation
  : FieldValidation;

/** typescript utility to coerce @rjsf/core validate prop signature to more accurately represent the shape of the actual validate function signature  */
export type ValidateProps<T> = (
  FormState: T,
  errors: RecursivelyAddError<T>,
) => RecursivelyAddError<T>;

type CustomFormatFields = {
  jiraHost?: string;
};

export type SpruceFormProps<A = any> = Pick<
  FormProps<A>,
  "schema" | "onChange" | "formData"
> &
  Partial<FormProps<A>> & { customFormatFields?: CustomFormatFields };

export type GetFormSchema = (...any) => {
  fields: Record<string, Field>;
  schema: SpruceFormProps["schema"];
  uiSchema: SpruceFormProps["uiSchema"];
};
