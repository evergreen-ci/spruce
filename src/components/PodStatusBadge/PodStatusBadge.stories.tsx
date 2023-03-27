import styled from "@emotion/styled";
import { StoryObj } from "@storybook/react";
import { size } from "constants/tokens";
import { PodStatus } from "types/pod";
import PodStatusBadge from ".";

export default {
  component: PodStatusBadge,
};

export const Default: StoryObj<typeof PodStatusBadge> = {
  render: () => (
    <Container>
      {Object.keys(PodStatus).map((status) => (
        <Wrapper key={`badge_${status}`}>
          <PodStatusBadge status={PodStatus[status]} />
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
