import styled from "@emotion/styled";
import { Label } from "@leafygreen-ui/typography";
import { FieldProps } from "@rjsf/core";
import { EditableTagField } from "components/EditableTagField";

export const ArrayField: React.FC<FieldProps> = ({
  onChange,
  formData,
  schema: { title },
}) => (
  <ElementWrapper>
    <Label htmlFor={`editable_tag_field_${title}`}>{title}</Label>
    <EditableTagField
      id={`editable_tag_field_${title}`}
      inputTags={formData}
      onChange={onChange}
      buttonText="Add New Expansion"
    />
  </ElementWrapper>
);

const ElementWrapper = styled.div`
  padding-top: 8px;
  padding-bottom: 8px;
`;
