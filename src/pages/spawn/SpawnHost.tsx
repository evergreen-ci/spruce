import { useQuery } from "@apollo/client";
import { Subtitle } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import { Variant } from "components/Badge";
import {
  TitleContainer,
  Title,
  BadgeWrapper,
  StyledBadge,
} from "components/Spawn";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { useToastContext } from "context/toast";
import { MyHostsQuery, MyHostsQueryVariables } from "gql/generated/types";
import { GET_MY_HOSTS } from "gql/queries";
import { usePolling, usePageTitle } from "hooks";
import { SpawnHostButton, SpawnHostTable } from "pages/spawn/spawnHost/index";
import { HostStatus } from "types/host";

export const SpawnHost = () => {
  const dispatchToast = useToastContext();

  const { data, loading, refetch, startPolling, stopPolling } = useQuery<
    MyHostsQuery,
    MyHostsQueryVariables
  >(GET_MY_HOSTS, {
    pollInterval: DEFAULT_POLL_INTERVAL,
    onError: (e) => {
      dispatchToast.error(
        `There was an error loading your spawn hosts: ${e.message}`
      );
    },
  });
  const migrationInProcess = !!data?.myHosts.find(
    ({ volumes }) => !!volumes.find(({ migrating }) => migrating)
  );
  usePolling({
    startPolling,
    stopPolling,
    refetch,
    shouldPollFaster: migrationInProcess,
  });

  usePageTitle("My Hosts");

  if (loading) {
    return <Skeleton />;
  }
  const hosts = data?.myHosts || [];
  const runningHosts = hosts.filter(
    (host) => host.status === HostStatus.Running
  );
  const pausedHosts = hosts.filter(
    (host) => host.status === HostStatus.Stopped
  );

  const hasHosts = hosts.length > 0;
  return (
    <>
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
      {hasHosts ? (
        <SpawnHostTable hosts={hosts} />
      ) : (
        <Subtitle>
          No Spawned hosts available, Spawn one to get started
        </Subtitle>
      )}
    </>
  );
};
