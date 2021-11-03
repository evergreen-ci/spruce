import styled from "@emotion/styled";
import { Description, Subtitle } from "@leafygreen-ui/typography";
import { FieldProps } from "@rjsf/core";

export const TitleField: React.FC<FieldProps> = ({ id, title }) => (
  <>
    {/* @ts-expect-error  */}
    <StyledSubtitle id={id}>{title}</StyledSubtitle>
  </>
);

/* @ts-expect-error  */
const StyledSubtitle = styled(Subtitle)`
  margin-top: 16px;
  margin-bottom: 12px;
`;

export const DescriptionField: React.FC<FieldProps> = ({ id, description }) => (
  <StyledDescription id={id}>{description}</StyledDescription>
);

const StyledDescription = styled(Description)`
  margin-bottom: 12px;
`;
