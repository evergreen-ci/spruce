import styled from "@emotion/styled";
import { size } from "constants/tokens";
import { CustomStoryObj, CustomMeta } from "test_utils/types";

import { PodStatus } from "types/pod";
import PodStatusBadge from ".";

export default {
  component: PodStatusBadge,
} satisfies CustomMeta<typeof PodStatusBadge>;

export const Default: CustomStoryObj<typeof PodStatusBadge> = {
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
