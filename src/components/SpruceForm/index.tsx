import Form from "@rjsf/core";
import { customizeValidator } from "@rjsf/validator-ajv8";
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

export const SpruceForm: React.VFC<SpruceFormProps> = ({
  schema,
  onChange,
  uiSchema,
  formData,
  fields,
  tagName,
  customValidate,
  disabled,
  customFormatFields,
}) => (
  <Form
    fields={fields}
    schema={schema}
    onChange={onChange}
    widgets={widgets}
    uiSchema={uiSchema}
    formData={formData}
    tagName={tagName}
    templates={{
      ArrayFieldTemplate,
      FieldTemplate: DefaultFieldTemplate,
      ObjectFieldTemplate,
      DescriptionFieldTemplate: baseFields.DescriptionField,
      TitleFieldTemplate: baseFields.TitleField,
    }}
    transformErrors={transformErrors}
    showErrorList={false}
    customValidate={customValidate}
    disabled={disabled}
    validator={customizeValidator({
      customFormats: customFormats(customFormatFields?.jiraHost),
    })}
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
