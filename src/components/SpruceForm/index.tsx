import Form from "@rjsf/core";
import { SpruceFormContainer } from "./Container";
import { customFormats } from "./customFormats";
import { transformErrors } from "./errors";
import baseFields from "./Fields";
import {
  ArrayFieldTemplate,
  DefaultFieldTemplate,
  ObjectFieldTemplate,
} from "./FieldTemplates";
import { GetFormSchema, SpruceFormProps, ValidateProps } from "./types";
import widgets from "./Widgets";

export const SpruceForm: React.FC<SpruceFormProps> = ({
  customFormatFields,
  disabled,
  fields,
  formData,
  onChange,
  schema,
  tagName,
  uiSchema,
  validate,
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
    {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
    <></>
  </Form>
);

export { SpruceFormContainer };
export type { GetFormSchema, ValidateProps };
