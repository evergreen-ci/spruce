import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { H1, H2 } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";
import { environmentalVariables } from "utils";
import errorPage from "./errorPage.svg";

const { getSpruceURL } = environmentalVariables;
const { white } = uiColors;

const ErrorFallback = () => (
  <Center>
    <Text>
      {/* @ts-expect-error */}
      <StyledHeader>Error</StyledHeader>
      {/* @ts-expect-error */}
      <StyledSubtitle>
        Ouch! That&apos;s gotta hurt,
        <br /> sorry about that!
      </StyledSubtitle>
      <StyledLink href={getSpruceURL()}>Back To Home</StyledLink>
    </Text>
    <img src={errorPage} alt="Error Background" />
  </Center>
);

export default ErrorFallback;

// @ts-expect-error
const StyledHeader = styled(H1)`
  color: ${white};
`;
// @ts-expect-error
const StyledSubtitle = styled(H2)`
  color: ${white};
`;
const StyledLink = styled.a`
  padding-top: ${size.xl}px;
  color: ${white};
  text-decoration: underline;
`;
const Text = styled.div`
  position: absolute;
  color: white;
  margin-left: 5%;
  margin-top: 10%;
`;

const Center = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  background-color: #5bbf7d; // Green Color from image
`;
