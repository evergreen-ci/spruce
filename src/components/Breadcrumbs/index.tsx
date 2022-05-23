import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { StyledRouterLink } from "components/styles";
import { H3, P1 } from "components/Typography";
import { size } from "constants/tokens";

const { gray } = uiColors;
export interface Breadcrumb {
  text: string;
  to?: string;
  onClick?: () => void;
}
interface BreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
}
const Breadcrumbs: React.VFC<BreadcrumbsProps> = ({ breadcrumbs }) => (
  <Container>
    {breadcrumbs.map((bc, index) => (
      <Fragment
        breadcrumb={bc}
        key={`breadCrumb-${bc.text}`}
        active={breadcrumbs.length - 1 === index}
      />
    ))}
  </Container>
);

interface FragmentProps {
  breadcrumb: Breadcrumb;
  active: boolean;
}
const Fragment: React.VFC<FragmentProps> = ({ breadcrumb, active }) => {
  const { text, to, onClick, ...rest } = breadcrumb;

  return active || !to ? (
    <H3 {...rest}>{text}</H3>
  ) : (
    <StyledP1 {...rest}>
      <StyledRouterLink to={to} onClick={onClick}>
        {text}
      </StyledRouterLink>
    </StyledP1>
  );
};

const StyledP1 = styled(P1)`
  display: inline-block;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  > * {
    margin-bottom: 0;
  }
  *:not(:last-child) {
    ::after {
      margin: 0 ${size.xs};
      content: "/";
      color: ${gray.base};
      opacity: 0.4;
    }
  }
`;

export default Breadcrumbs;
