import React from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { CardContainer, CardField, DoesNotExpire } from "components/Spawn";
import { routes } from "constants/routes";
import { MyHost } from "types/spawn";
import { getDateCopy } from "utils/string";

interface SpawnHostCardProps {
  host: MyHost;
}

export const SpawnHostCard: React.FC<SpawnHostCardProps> = ({ host }) => (
  <CardContainer data-cy="spawn-host-card">
    {Object.keys(spawnHostCardFieldMaps).map((key) => (
      <CardField
        key={`${key}_${host.id}`}
        field={key}
        value={spawnHostCardFieldMaps[key](host)}
      />
    ))}
  </CardContainer>
);

const spawnHostCardFieldMaps = {
  ID: (host: MyHost) => <span>{host?.id}</span>,
  "Created at": (host: MyHost) => <span>{getDateCopy(host?.uptime)}</span>,
  "Started at": (host: MyHost) => <span>{getDateCopy(host?.uptime)}</span>,
  "Expires at": (host: MyHost) => (
    <span>
      {host?.noExpiration ? <DoesNotExpire /> : getDateCopy(host?.expiration)}
    </span>
  ),
  "SSH User": (host: MyHost) => <span>{host?.distro?.user}</span>,
  "DNS Name": (host: MyHost) => <span>{host?.hostUrl}</span>,
  "Working Directory": (host: MyHost) => <span>{host?.distro?.workDir}</span>,
  "Availability Zone": (host: MyHost) => <span>{host?.availabilityZone}</span>,
  "User Tags": (host: MyHost) => (
    <span>
      {host?.instanceTags?.map((tag) => (
        <span key={uuid()}>
          {tag.canBeModified && (
            <PaddedBadge>
              {tag?.key}:{tag?.value}
            </PaddedBadge>
          )}
        </span>
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
      <Link to={`${routes.spawnVolume}/${host?.homeVolumeID}`}>
        {host?.homeVolumeID}
      </Link>
    </span>
  ),
};

const PaddedBadge = styled(Badge)`
  margin-right: 8px;
`;
