import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { InfoSprinkle } from "@leafygreen-ui/info-sprinkle";
import {
  Analytics,
  useSpawnAnalytics,
} from "analytics/spawn/useSpawnAnalytics";
import { DoesNotExpire, DetailsCard } from "components/Spawn";
import { StyledLink, StyledRouterLink } from "components/styles";
import { getIdeUrl } from "constants/externalResources";
import { getHostRoute, getSpawnVolumeRoute } from "constants/routes";
import { size } from "constants/tokens";
import { useDateFormat } from "hooks";
import { HostStatus } from "types/host";
import { MyHost } from "types/spawn";
import { workstationSupportedDistros } from "./constants";

type SendEvent = Analytics["sendEvent"];

interface SpawnHostCardProps {
  host: MyHost;
}

const SpawnHostCard: React.FC<SpawnHostCardProps> = ({ host }) => {
  const { sendEvent } = useSpawnAnalytics();

  return (
    <DetailsCard
      data-cy="spawn-host-card"
      fieldMaps={spawnHostCardFieldMaps(sendEvent)}
      type={host}
    />
  );
};

const HostUptime: React.FC<MyHost> = ({ uptime }) => {
  const getDateCopy = useDateFormat();
  return <span>{getDateCopy(uptime)}</span>;
};

const HostExpiration: React.FC<MyHost> = ({ expiration, noExpiration }) => {
  const getDateCopy = useDateFormat();
  return <span>{noExpiration ? DoesNotExpire : getDateCopy(expiration)}</span>;
};
const spawnHostCardFieldMaps = (sendEvent: SendEvent) => ({
  ID: (host: MyHost) => (
    <span>
      {host?.id} (
      <StyledRouterLink to={getHostRoute(host?.id)}>Event Log</StyledRouterLink>
      )
    </span>
  ),
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
          ),
      )}
    </span>
  ),
  "Instance Type": (host: MyHost) => <span>{host?.instanceType}</span>,
  "Mounted Volumes": (host: MyHost) => (
    <>
      {host.volumes.map(({ displayName, id }) => (
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
    host?.status === HostStatus.Running &&
    workstationSupportedDistros.includes(host?.distro?.id) ? (
      <IDEContainer>
        <StyledLink
          href={getIdeUrl(host.id)}
          onClick={() => sendEvent({ name: "Opened IDE" })}
        >
          Open IDE (Deprecated)
        </StyledLink>
        <InfoSprinkle>
          The Evergreen IDE is now deprecated and is no longer installed on
          Workstations
        </InfoSprinkle>
      </IDEContainer>
    ) : undefined,
});

const IDEContainer = styled.div`
  display: flex;
  gap: ${size.xs};
`;
const PaddedBadge = styled(Badge)`
  margin-right: ${size.xs};
`;

export default SpawnHostCard;
