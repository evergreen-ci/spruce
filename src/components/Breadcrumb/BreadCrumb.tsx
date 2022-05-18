import styled from "@emotion/styled";
import { StyledRouterLink } from "components/styles";
import { H3, P1 } from "components/Typography";

export interface BreadCrumb {
  text: string;
  to?: string;
  onClick?: () => void;
}
interface BreadCrumbsProps {
  breadcrumbs: BreadCrumb[];
}
const BreadCrumbs: React.VFC<BreadCrumbsProps> = ({ breadcrumbs }) => (
  <>
    {breadcrumbs.map((breadcrumb, index) => (
      <>
        <BreadcrumbItem
          breadcrumb={breadcrumb}
          key={`breadcrumb-${breadcrumb.text}`}
          active={breadcrumbs.length - 1 === index}
        />
        {breadcrumbs.length - 1 !== index && " / "}
      </>
    ))}
  </>
);

interface BreadcrumbProps {
  breadcrumb: BreadCrumb;
  active: boolean;
}
const BreadcrumbItem: React.VFC<BreadcrumbProps> = ({ breadcrumb, active }) =>
  active ? (
    <H3>{breadcrumb.text}</H3>
  ) : (
    <StyledP1>
      <StyledRouterLink to={breadcrumb.to} onClick={breadcrumb.onClick}>
        {breadcrumb.text}
      </StyledRouterLink>
    </StyledP1>
  );

const StyledP1 = styled(P1)`
  display: inline-block;
`;
export default BreadCrumbs;
