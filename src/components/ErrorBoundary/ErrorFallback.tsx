import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { H1, H2 } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";
import { H1Type, H2Type } from "types/leafygreen";
import { environmentalVariables } from "utils";
import errorPage from "./errorPage.svg";

const { getSpruceURL } = environmentalVariables;
const { white } = palette;

const ErrorFallback = () => (
  <Center>
    <Text>
      <StyledHeader>Error</StyledHeader>
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

const StyledHeader = styled<H1Type>(H1)`
  color: ${white};
`;

const StyledSubtitle = styled<H2Type>(H2)`
  color: ${white};
`;

const StyledLink = styled.a`
  padding-top: ${size.xl};
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
