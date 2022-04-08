import styled from "@emotion/styled";
import Card from "@leafygreen-ui/card";
import { H3 } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";

interface ContainerProps {
  title?: string;
  id?: string;
  "data-cy"?: string;
  children: React.ReactNode;
}

export const SpruceFormContainer: React.VFC<ContainerProps> = ({
  children,
  "data-cy": dataCy,
  id,
  title,
}) => (
  <div>
    {/* @ts-expect-error  */}
    {title && <StyledH3 id={id}>{title}</StyledH3>}
    {/* @ts-expect-error  */}
    <StyledCard data-cy={dataCy}>{children}</StyledCard>
  </div>
);

/* @ts-expect-error */
const StyledH3 = styled(H3)`
  margin: ${size.m} 0;
`;

/* @ts-expect-error */
const StyledCard = styled(Card)`
  margin-bottom: 48px;
  padding: ${size.m};
`;
