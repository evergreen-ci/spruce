import styled from "@emotion/styled";
import { size } from "constants/tokens";
import { HostStatus } from "types/host";
import HostStatusBadge from ".";

export default {
  title: "Components/Host Status Badges",
  component: HostStatusBadge,
};

export const Default = () => {
  const hostStatuses = Object.keys(HostStatus);
  return (
    <Container>
      {hostStatuses.map((status) => (
        <Wrapper key={`badge_${status}`}>
          <HostStatusBadge status={HostStatus[status]} />
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
