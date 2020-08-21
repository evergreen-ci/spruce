import React from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { H2 } from "@leafygreen-ui/typography";
import Badge, { Variant } from "@leafygreen-ui/badge";
import { pollInterval } from "constants/index";
import { useBannerDispatchContext } from "context/banners";
import { MyHostsQuery, MyHostsQueryVariables } from "gql/generated/types";
import { GET_MY_HOSTS } from "gql/queries";
import { SpawnHostButton, SpawnHostTable } from "pages/spawn/spawnHost/index";
import { useNetworkStatus } from "hooks";
import { HostStatus } from "types/host";

export const SpawnHost = () => {
  const dispatchBanner = useBannerDispatchContext();

  const { data, loading, startPolling, stopPolling } = useQuery<
    MyHostsQuery,
    MyHostsQueryVariables
  >(GET_MY_HOSTS, {
    pollInterval,
    onError: (e) => {
      dispatchBanner.errorBanner(
        `There was an error loading the patch: ${e.message}`
      );
      console.log(e);
    },
  });
  useNetworkStatus(startPolling, stopPolling);

  if (loading) {
    return <b>loading</b>;
  }
  const hosts = data?.myHosts;
  const runningHosts = hosts.filter(
    (host) => host.status === HostStatus.Running
  );
  const pausedHosts = hosts.filter(
    (host) => host.status === HostStatus.Stopped
  );
  return (
    <Container>
      <TitleContainer>
        <Title>Hosts</Title>
        <BadgeWrapper>
          <StyledBadge variant={Variant.Green}>
            {runningHosts.length} Running
          </StyledBadge>
          <StyledBadge variant={Variant.Yellow}>
            {pausedHosts.length} Paused
          </StyledBadge>
        </BadgeWrapper>
      </TitleContainer>
      <SpawnHostButton />
      <SpawnHostTable hosts={hosts} />
    </Container>
  );
};

const Container = styled.div`
  margin-left: 50px;
  width: 100%;
`;
const Title = styled(H2)``;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
`;

const BadgeWrapper = styled.div`
  display: flex;
`;

const StyledBadge = styled(Badge)`
  margin-right: 10px;
  margin-left: 10px;
`;
