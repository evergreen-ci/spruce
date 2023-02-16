import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import {
  Analytics,
  useSpawnAnalytics,
} from "analytics/spawn/useSpawnAnalytics";
import { DoesNotExpire, DetailsCard } from "components/Spawn";
import { StyledLink, StyledRouterLink } from "components/styles";
import { getIdeUrl } from "constants/externalResources";
import { getSpawnVolumeRoute } from "constants/routes";
import { size } from "constants/tokens";
import { useDateFormat } from "hooks";
import { HostStatus } from "types/host";
import { MyHost } from "types/spawn";

type SendEvent = Analytics["sendEvent"];

interface SpawnHostCardProps {
  host: MyHost;
}

export const SpawnHostCard: React.VFC<SpawnHostCardProps> = ({ host }) => {
  const { sendEvent } = useSpawnAnalytics();

  return (
    <DetailsCard
      data-cy="spawn-host-card"
      fieldMaps={spawnHostCardFieldMaps(sendEvent)}
      type={host}
    />
  );
};

const HostUptime: React.VFC<MyHost> = ({ uptime }) => {
  const getDateCopy = useDateFormat();
  return <span>{getDateCopy(uptime)}</span>;
};

const HostExpiration: React.VFC<MyHost> = ({ noExpiration, expiration }) => {
  const getDateCopy = useDateFormat();
  return <span>{noExpiration ? DoesNotExpire : getDateCopy(expiration)}</span>;
};
const spawnHostCardFieldMaps = (sendEvent: SendEvent) => ({
  ID: (host: MyHost) => <span>{host?.id}</span>,
  "Created at": HostUptime,
  "Started at": HostUptime,
  "Expires at": HostExpiration,
  "SSH User": (host: MyHost) => <span>{host?.distro?.user}</span>,
  "DNS Name": (host: MyHost) => <span>{host?.hostUrl}</span>,
  "Working Directory": (host: MyHost) => <span>{host?.distro?.workDir}</span>,
  "Availability Zone": (host: MyHost) => <span>{host?.availabilityZone}</span>,
  "User Tags": (host: MyHost) => (
    <span>
      {host?.instanceTags?.map(
        (tag) =>
          tag.canBeModified && (
            <PaddedBadge key={`user_tag_${host.id}_${tag.key}`}>
              {tag?.key}:{tag?.value}
            </PaddedBadge>
          )
      )}
    </span>
  ),
  "Instance Type": (host: MyHost) => <span>{host?.instanceType}</span>,
  "Mounted Volumes": (host: MyHost) => (
    <>
      {host.volumes.map(({ id, displayName }) => (
        <div key={`volume_link_${id}`}>
          <StyledRouterLink to={getSpawnVolumeRoute(id)}>
            {displayName || id}
          </StyledRouterLink>
        </div>
      ))}
    </>
  ),
  "Home Volume": (host: MyHost) => (
    <span>
      <StyledRouterLink to={getSpawnVolumeRoute(host?.homeVolumeID)}>
        {host?.homeVolume?.displayName || host?.homeVolumeID}
      </StyledRouterLink>
    </span>
  ),
  IDE: (host: MyHost) =>
    host?.distro?.isVirtualWorkStation &&
    host?.status === HostStatus.Running ? (
      <span>
        <StyledLink
          href={getIdeUrl(host.id)}
          onClick={() => sendEvent({ name: "Opened IDE" })}
        >
          Open IDE
        </StyledLink>
      </span>
    ) : undefined,
});

const PaddedBadge = styled(Badge)`
  margin-right: ${size.xs};
`;
