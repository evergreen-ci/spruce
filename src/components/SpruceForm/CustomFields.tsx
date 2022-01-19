import styled from "@emotion/styled";
import { Description, H3, Subtitle } from "@leafygreen-ui/typography";
import { Field } from "@rjsf/core";

export const TitleField: Field = ({ id, isSectionTitle, title }) => {
  const Component = isSectionTitle ? StyledH3 : StyledSubtitle;
  return (
    <>
      {/* @ts-expect-error  */}
      <Component id={id}>{title}</Component>
    </>
  );
};

/* @ts-expect-error  */
const StyledH3 = styled(H3)`
  margin-top: 24px;
  margin-bottom: 12px;
`;

/* @ts-expect-error  */
const StyledSubtitle = styled(Subtitle)`
  margin-top: 16px;
  margin-bottom: 12px;
`;

export const DescriptionField: Field = ({ id, description }) => (
  <>
    {description && (
      <StyledDescription id={id}>{description}</StyledDescription>
    )}
  </>
);

const StyledDescription = styled(Description)`
  margin-bottom: 12px;
`;
