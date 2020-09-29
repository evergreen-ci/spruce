import React from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { Link } from "react-router-dom";
import { DoesNotExpire, DetailsCard } from "components/Spawn";
import { routes } from "constants/routes";
import { MyHost } from "types/spawn";
import { getDateCopy } from "utils/string";

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
      {host?.instanceTags?.map((tag) => (
        <>
          {tag.canBeModified && (
            <PaddedBadge>
              {tag?.key}:{tag?.value}
            </PaddedBadge>
          )}
        </>
      ))}
    </span>
  ),
  "Instance Type": (host: MyHost) => <span>{host?.instanceType}</span>,
  "Mounted to": (host: MyHost) => (
    <>
      {host.volumes.map(({ id, displayName }) => (
        <div>
          <Link to={`${routes.spawnVolume}?volume=${id}`}>
            {displayName || id}
          </Link>
        </div>
      ))}
    </>
  ),
  "Home Volume": (host: MyHost) => (
    <span>
      <Link to={`${routes.spawnVolume}?volume=${host?.homeVolumeID}`}>
        {host?.homeVolumeID}
      </Link>
    </span>
  ),
};

const PaddedBadge = styled(Badge)`
  margin-right: 8px;
`;
