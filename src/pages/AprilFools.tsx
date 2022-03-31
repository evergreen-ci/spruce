import styled from "@emotion/styled";
import { H1, H3 } from "@leafygreen-ui/typography";
import { Logo } from "components/AprilFools";
import { PageWrapper } from "components/styles";

import { usePageTitle } from "hooks";

export const AprilFools: React.FC = () => {
  usePageTitle(`April Fools!`);
  return (
    <PageWrapper>
      <Container>
        <H1>April Fool&apos;s from the Evergreen Team!</H1>
        <ContentWrapper>
          <Logo />
          <H3>
            While we may not be building a decentralized Metaverse NFT platform,
            we are building an amazing developer experience.
          </H3>
        </ContentWrapper>
      </Container>
    </PageWrapper>
  );
};

const ContentWrapper = styled.div`
  width: 600px;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
