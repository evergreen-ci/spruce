import Form, { FormProps } from "@rjsf/core";
import { SpruceFormContainer } from "./Container";
import { transformErrors } from "./Errors";
import baseFields from "./Fields";
import { ArrayFieldTemplate, DefaultFieldTemplate } from "./FieldTemplates";
import widgets from "./Widgets";

export type FormDataProps = FormProps<any>["formData"];

export interface SpruceFormProps {
  schema: FormProps<any>["schema"];
  onChange: (d: any) => void;
  uiSchema?: FormProps<any>["uiSchema"];
  formData: FormDataProps;
  fields?: FormProps<any>["fields"];
  tagName?: FormProps<any>["tagName"];
}

export const SpruceForm: React.FC<SpruceFormProps> = ({
  schema,
  onChange,
  uiSchema,
  formData,
  fields,
  tagName,
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
    transformErrors={transformErrors}
    showErrorList={false}
    liveValidate
  >
    {/*  Need to pass in an empty fragment child to remove default submit button */}
    <></>
  </Form>
);

export { SpruceFormContainer };
