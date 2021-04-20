import styled from "@emotion/styled";
import { Subtitle } from "@leafygreen-ui/typography";
import Form, { FormProps } from "@rjsf/core";
import { SiderCard } from "components/styles";
import fields from "./Fields";
import widgets from "./Widgets";

interface Props {
  title: string;
  schema: FormProps<any>["schema"];
  onChange: (d: any) => void;
  uiSchema?: FormProps<any>["uiSchema"];
  formData: FormProps<any>["formData"];
}
export const SpruceForm: React.FC<Props> = ({
  title,
  schema,
  onChange,
  uiSchema,
  formData,
}) => (
  <div>
    <Subtitle>{title}</Subtitle>
    {/* @ts-expect-error  */}
    <Card>
      <Form
        fields={fields}
        schema={schema}
        onChange={onChange}
        widgets={widgets}
        uiSchema={uiSchema}
        formData={formData}
      >
        {/*  Need to pass in an empty fragment child to remove default submit button */}
        <></>
      </Form>
    </Card>
  </div>
);

const Card = styled(SiderCard)`
  margin-top: 22px;
  padding-bottom: 60px;
  padding-right: 22px;
`;
