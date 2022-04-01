import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { H1, H3 } from "@leafygreen-ui/typography";
import { Logo } from "components/AprilFools";
import { PageWrapper } from "components/styles";
import { usePageTitle } from "hooks";

const { green } = uiColors;

export const AprilFools: React.FC = () => {
  usePageTitle(`April Fools!`);
  return (
    <PageWrapper>
      <Container>
        {/* @ts-expect-error */}
        <Title>April Fool&apos;s from the Evergreen Team!</Title>
        <ContentWrapper>
          <Logo />
          {/* @ts-expect-error */}
          <Body>
            While we may not be building a decentralized Metaverse NFT platform,
            we are building an amazing developer experience.
          </Body>
        </ContentWrapper>
      </Container>
    </PageWrapper>
  );
};

// @ts-expect-error
const Title = styled(H1)`
  color: ${green.base};
`;
// @ts-expect-error
const Body = styled(H3)`
  color: ${green.base};
`;
const ContentWrapper = styled.div`
  width: 600px;
  color: ${green.base};
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
