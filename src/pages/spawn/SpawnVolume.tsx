import { useQuery } from "@apollo/client";
import Badge, { Variant } from "@leafygreen-ui/badge";
import { Subtitle } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import { Title, BadgeWrapper, TitleContainer } from "components/Spawn";
import { pollInterval } from "constants/index";
import { useToastContext } from "context/toast";
import { MyVolumesQuery, MyVolumesQueryVariables } from "gql/generated/types";
import { GET_MY_VOLUMES } from "gql/queries";
import { usePolling, usePageTitle } from "hooks";
import { SpawnVolumeTable } from "pages/spawn/spawnVolume/SpawnVolumeTable";
import { SpawnVolumeButton } from "./spawnVolume/SpawnVolumeButton";

export const SpawnVolume = () => {
  const dispatchToast = useToastContext();
  const {
    data: volumesData,
    loading,
    refetch,
    startPolling,
    stopPolling,
  } = useQuery<MyVolumesQuery, MyVolumesQueryVariables>(GET_MY_VOLUMES, {
    pollInterval,
    onError: (e) => {
      dispatchToast.error(
        `There was an error loading your spawn volume: ${e.message}`
      );
    },
  });
  usePolling(startPolling, stopPolling, refetch);
  usePageTitle("My Volumes");

  if (loading) {
    return <Skeleton />;
  }

  const mountedCount =
    volumesData?.myVolumes.filter((v) => v.hostID).length ?? 0;
  const unmountedCount =
    volumesData?.myVolumes.filter((v) => !v.hostID).length ?? 0;
  const volumes = volumesData?.myVolumes || [];
  return (
    <>
      <TitleContainer>
        <Title>Volumes</Title>
        <BadgeWrapper>
          <Badge
            data-cy="mounted-badge"
            variant={Variant.Green}
          >{`${mountedCount} Mounted`}</Badge>
          <Badge
            data-cy="free-badge"
            variant={Variant.Blue}
          >{`${unmountedCount} Free`}</Badge>
        </BadgeWrapper>
      </TitleContainer>
      <SpawnVolumeButton />
      {volumes.length ? (
        <SpawnVolumeTable volumes={volumes} />
      ) : (
        <Subtitle>
          No Spawned volumes available, Spawn one to get started
        </Subtitle>
      )}
    </>
  );
};
