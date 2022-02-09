import React from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { DoesNotExpire, DetailsCard } from "components/Spawn";
import { StyledLink, StyledRouterLink } from "components/styles";
import { getIdeUrl } from "constants/externalResources";
import { getSpawnVolumeRoute } from "constants/routes";
import { size } from "constants/tokens";
import { HostStatus } from "types/host";
import { MyHost } from "types/spawn";
import { string } from "utils";

const { getDateCopy } = string;

interface SpawnHostCardProps {
  host: MyHost;
}

export const SpawnHostCard: React.FC<SpawnHostCardProps> = ({ host }) => (
  <DetailsCard
    data-cy="spawn-host-card"
    fieldMaps={spawnHostCardFieldMaps}
    type={host}
  />
);

const spawnHostCardFieldMaps = {
  ID: (host: MyHost) => <span>{host?.id}</span>,
  "Created at": (host: MyHost) => <span>{getDateCopy(host?.uptime)}</span>,
  "Started at": (host: MyHost) => <span>{getDateCopy(host?.uptime)}</span>,
  "Expires at": (host: MyHost) => (
    <span>
      {host?.noExpiration ? DoesNotExpire : getDateCopy(host?.expiration)}
    </span>
  ),
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
        <StyledLink href={getIdeUrl(host.id)}>Open IDE</StyledLink>
      </span>
    ) : undefined,
};

const PaddedBadge = styled(Badge)`
  margin-right: ${size.xs};
`;
