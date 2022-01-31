import styled from "@emotion/styled";
import Card from "@leafygreen-ui/card";
import { H3 } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";

interface ContainerProps {
  title?: string;
  id?: string;
}

export const SpruceFormContainer: React.FC<ContainerProps> = ({
  children,
  id,
  title,
}) => (
  <div>
    {/* @ts-expect-error  */}
    {title && <StyledH3 id={id}>{title}</StyledH3>}
    {/* @ts-expect-error  */}
    <StyledCard>{children}</StyledCard>
  </div>
);

/* @ts-expect-error */
const StyledH3 = styled(H3)`
  margin-bottom: ${size.m}px;
`;

/* @ts-expect-error */
const StyledCard = styled(Card)`
  margin-bottom: 48px;
  padding: ${size.m}px;
`;
