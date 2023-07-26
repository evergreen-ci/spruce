import styled from "@emotion/styled";
import { InlineCode } from "@leafygreen-ui/typography";
import {
  DownloadCard,
  AuthenticationCard,
  VerifyCard,
  NodeList,
} from "./cliTab/index";

export const CliTab = () => (
  <RelativeContainer>
    <NodeList list={list} />
  </RelativeContainer>
);

const Code = styled(InlineCode)`
  font-size: inherit;
`;

const list = [
  {
    child: <DownloadCard />,
    title: "Download the Command-Line Client.",
  },
  {
    title: (
      <>
        Move the command-line client to somewhere in your PATH. On many systems
        this will be <Code>/usr/local/bin</Code>.
      </>
    ),
  },
  {
    title: (
      <>
        Ensure the client is executable using <Code>chmod +x</Code>.
      </>
    ),
  },
  {
    child: <AuthenticationCard />,
    title: "Download the authentication file.",
  },
  {
    title: (
      <>
        Move the authentication file to <Code>~/.evergreen.yml</Code>.
      </>
    ),
  },
  {
    child: <VerifyCard />,
    title: "Make sure you are good to go!",
  },
];

const RelativeContainer = styled.div`
  // This is required for the NodeList component to allow the vertical line to render properly
  // It has to do with absolute positioning in relation to the nearest relative parent.
  position: relative;
`;
