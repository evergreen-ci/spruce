import styled from "@emotion/styled";
import { size } from "constants/tokens";
import { PodStatus } from "types/pod";
import PodStatusBadge from ".";

export default {
  title: "Components/Pod Status Badges",
  component: PodStatusBadge,
};

export const Default = () => {
  const podStatuses = Object.keys(PodStatus);
  return (
    <Container>
      {podStatuses.map((status) => (
        <Wrapper key={`badge_${status}`}>
          <PodStatusBadge status={PodStatus[status]} />
        </Wrapper>
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
const Wrapper = styled.div`
  padding: ${size.xxs};
`;
