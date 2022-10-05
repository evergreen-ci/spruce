import { Fragment } from "react";
import styled from "@emotion/styled";
import Tooltip from "@leafygreen-ui/tooltip";
import { Body } from "@leafygreen-ui/typography";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import Icon from "components/Icon";
import { StyledRouterLink } from "components/styles";
import { trimStringFromMiddle } from "utils/string";

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
      <Fragment key={`breadCrumb-${bc.text}`}>
        <BreadcrumbFragment breadcrumb={bc} />
        {breadcrumbs.length - 1 !== index && (
          <Icon data-cy="breadcrumb-chevron" glyph="ChevronRight" />
        )}
      </Fragment>
    ))}
  </Container>
);

interface BreadcrumbFragmentProps {
  breadcrumb: Breadcrumb;
}
const BreadcrumbFragment: React.VFC<BreadcrumbFragmentProps> = ({
  breadcrumb,
}) => {
  const { text, to, onClick, ...rest } = breadcrumb;
  const shouldTrimMessage = text?.length > 25;
  const message = shouldTrimMessage ? trimStringFromMiddle(text, 25) : text;
  return (
    <ConditionalWrapper
      condition={shouldTrimMessage}
      wrapper={(children) => (
        <Tooltip
          align="top"
          justify="middle"
          trigger={children}
          triggerEvent="hover"
        >
          {text}
        </Tooltip>
      )}
    >
      {!to ? (
        <Body {...rest}>{message}</Body>
      ) : (
        <Body {...rest}>
          <StyledRouterLink to={to} onClick={onClick}>
            {message}
          </StyledRouterLink>
        </Body>
      )}
    </ConditionalWrapper>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  > * {
    margin-bottom: 0;
  }
`;

export default Breadcrumbs;
