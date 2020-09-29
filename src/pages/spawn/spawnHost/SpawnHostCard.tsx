import React from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { Card, DoesNotExpire } from "components/Spawn";
import { routes } from "constants/routes";
import { MyHost } from "types/spawn";
import { getDateCopy } from "utils/string";

interface SpawnHostCardProps {
  host: MyHost;
}

export const SpawnHostCard: React.FC<SpawnHostCardProps> = ({ host }) => (
  <Card
    data-cy="spawn-host-card"
    cardItems={spawnHostCardFieldMaps.map(({ label, Comp }) => ({
      label,
      value: <Comp {...host} />,
    }))}
  />
);

const spawnHostCardFieldMaps = [
  { label: "ID", Comp: (host: MyHost) => <span>{host?.id}</span> },
  {
    label: "Created at",
    Comp: (host: MyHost) => <span>{getDateCopy(host?.uptime)}</span>,
  },
  {
    label: "Started at",
    Comp: (host: MyHost) => <span>{getDateCopy(host?.uptime)}</span>,
  },
  {
    label: "Expires at",
    Comp: (host: MyHost) => (
      <span>
        {host?.noExpiration ? DoesNotExpire : getDateCopy(host?.expiration)}
      </span>
    ),
  },
  {
    label: "SSH User",
    Comp: (host: MyHost) => <span>{host?.distro?.user}</span>,
  },
  { label: "DNS Name", Comp: (host: MyHost) => <span>{host?.hostUrl}</span> },
  {
    label: "Working Directory",
    Comp: (host: MyHost) => <span>{host?.distro?.workDir}</span>,
  },
  {
    label: "Availability Zone",
    Comp: (host: MyHost) => <span>{host?.availabilityZone}</span>,
  },
  {
    label: "User Tags",
    Comp: (host: MyHost) => (
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
  },
  {
    label: "Instance Type",
    Comp: (host: MyHost) => <span>{host?.instanceType}</span>,
  },
  {
    label: "Mounted to",
    Comp: (host: MyHost) => (
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
  },
  {
    label: "Home Volume",
    Comp: (host: MyHost) => (
      <span>
        <Link to={`${routes.spawnVolume}/${host?.homeVolumeID}`}>
          {host?.homeVolumeID}
        </Link>
      </span>
    ),
  },
];

const PaddedBadge = styled(Badge)`
  margin-right: 8px;
`;
