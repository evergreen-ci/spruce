import styled from "@emotion/styled";
import { StoryObj } from "@storybook/react";
import { size } from "constants/tokens";
import { HostStatus } from "types/host";
import HostStatusBadge from ".";

export default {
  component: HostStatusBadge,
};

export const Default: StoryObj<typeof HostStatusBadge> = {
  render: () => (
    <Container>
      {Object.keys(HostStatus).map((status) => (
        <Wrapper key={`badge_${status}`}>
          <HostStatusBadge status={HostStatus[status]} />
        </Wrapper>
      ))}
    </Container>
  ),
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
const Wrapper = styled.div`
  padding: ${size.xxs};
`;
