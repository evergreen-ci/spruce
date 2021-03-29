import styled from "@emotion/styled";
import { EditableTagField } from "components/EditableTagField";

export const ArrayField = ({ onChange, formData }) => (
  <ElementWrapper>
    <EditableTagField
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
