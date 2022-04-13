import styled from "@emotion/styled";
import { Description, H3, Subtitle } from "@leafygreen-ui/typography";
import { Field, FieldProps } from "@rjsf/core";
import { size } from "constants/tokens";

type TitleFieldProps = Pick<FieldProps, "id" | "title" | "uiSchema">;

export const TitleField: React.VFC<TitleFieldProps> = ({
  id,
  title,
  uiSchema,
}) => {
  const isSectionTitle = uiSchema?.["ui:sectionTitle"] ?? false;
  const Component = isSectionTitle ? StyledH3 : StyledSubtitle;
  return (
    /* @ts-expect-error */
    <Component id={id}>{title}</Component>
  );
};

/* @ts-expect-error  */
const StyledH3 = styled(H3)`
  margin-top: ${size.m};
  margin-bottom: 12px;
`;

/* @ts-expect-error  */
const StyledSubtitle = styled(Subtitle)`
  margin-top: ${size.s};
  margin-bottom: 12px;
`;

export const DescriptionField: Field = ({ id, description }) =>
  description ? (
    <StyledDescription id={id}>{description}</StyledDescription>
  ) : null;

const StyledDescription = styled(Description)`
  margin-bottom: 12px;
`;
