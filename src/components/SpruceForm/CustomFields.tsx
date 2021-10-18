import styled from "@emotion/styled";
import { Label, Subtitle } from "@leafygreen-ui/typography";
import { FieldProps } from "@rjsf/core";
import { EditableTagField } from "components/EditableTagField";
import ElementWrapper from "./ElementWrapper";

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

export const TitleField: React.FC<FieldProps> = ({ title }) => (
  <>
    {/* @ts-expect-error  */}
    <StyledSubtitle>{title}</StyledSubtitle>
  </>
);

/* @ts-expect-error  */
const StyledSubtitle = styled(Subtitle)`
  margin-top: 16px;
  margin-bottom: 16px;
`;
