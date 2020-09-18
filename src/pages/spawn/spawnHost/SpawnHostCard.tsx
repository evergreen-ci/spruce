import React from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { CardContainer, CardField, DoesNotExpire } from "components/Spawn";
import { routes } from "constants/routes";
import { MyHostsQuery } from "gql/generated/types";
import { getDateCopy } from "utils/string";

type Host = MyHostsQuery["myHosts"][0];
interface SpawnHostCardProps {
  host: Host;
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
  "Created at": (host: Host) => <span>{getDateCopy(host?.uptime)}</span>,
  "Started at": (host: Host) => <span>{getDateCopy(host?.uptime)}</span>,
  "Expires at": (host: Host) => (
    <span>
      {host?.noExpiration ? <DoesNotExpire /> : getDateCopy(host?.expiration)}
    </span>
  ),
  "SSH User": (host: Host) => <span>{host?.distro?.user}</span>,
  "DNS Name": (host: Host) => <span>{host?.hostUrl}</span>,
  "Working Directory": (host: Host) => <span>{host?.distro?.workDir}</span>,
  "Availability Zone": (host: Host) => <span>{host?.availabilityZone}</span>,
  "User Tags": (host: Host) => (
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
  "Instance Type": (host: Host) => <span>{host?.instanceType}</span>,
  "Mounted to": (host: Host) => (
    <span>
      <Link to={`${routes.spawnVolume}/${host?.homeVolumeID}`}>
        {host?.homeVolumeID}
      </Link>
    </span>
  ),
};

const PaddedBadge = styled(Badge)`
  margin-left: 8px;
  margin-right: 8px;
`;
