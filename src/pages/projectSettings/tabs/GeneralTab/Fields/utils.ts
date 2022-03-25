const formContext = {};

export const defaultFieldProps = {
  schema: {},
  uiSchema: {},
  idSchema: null,
  formData: null,
  errorSchema: {},
  onChange: () => {},
  onBlur: () => {},
  onFocus: () => {},
  registry: {
    fields: {},
    widgets: {},
    definitions: {},
    formContext,
    rootSchema: {},
  },
  formContext,
  autofocus: false,
  disabled: false,
  readonly: false,
  required: false,
  name: "testField",
};
