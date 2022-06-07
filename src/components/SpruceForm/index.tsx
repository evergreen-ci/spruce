import Form, { FormProps } from "@rjsf/core";
import { SpruceFormContainer } from "./Container";
import { customFormats } from "./customFormats";
import { transformErrors } from "./errors";
import baseFields from "./Fields";
import {
  ArrayFieldTemplate,
  DefaultFieldTemplate,
  ObjectFieldTemplate,
} from "./FieldTemplates";
import widgets from "./Widgets";

export type FormDataProps = FormProps<any>["formData"];

export type SpruceFormProps = Pick<
  FormProps<any>,
  "schema" | "onChange" | "formData"
> &
  Partial<FormProps<any>> & { customFormatFields?: CustomFormatFields };

type CustomFormatFields = {
  jiraHost?: string;
};

export const SpruceForm: React.VFC<SpruceFormProps> = ({
  schema,
  onChange,
  uiSchema,
  formData,
  fields,
  tagName,
  validate,
  disabled,
  customFormatFields,
}) => (
  <Form
    fields={{ ...baseFields, ...fields }}
    schema={schema}
    onChange={onChange}
    widgets={widgets}
    uiSchema={uiSchema}
    formData={formData}
    tagName={tagName}
    ArrayFieldTemplate={ArrayFieldTemplate}
    FieldTemplate={DefaultFieldTemplate}
    ObjectFieldTemplate={ObjectFieldTemplate}
    transformErrors={transformErrors}
    showErrorList={false}
    validate={validate}
    disabled={disabled}
    customFormats={customFormats(customFormatFields?.jiraHost)}
    liveValidate
    noHtml5Validate
  >
    {/*  Need to pass in an empty fragment child to remove default submit button */}
    <></>
  </Form>
);

export { SpruceFormContainer };
