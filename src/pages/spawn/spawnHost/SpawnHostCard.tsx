import React from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { Link } from "react-router-dom";
import { SiderCard } from "components/styles";
import { routes } from "constants/routes";
import { Host } from "gql/generated/types";
import { getDateCopy } from "utils/string";

interface SpawnHostCardProps {
  host: Host;
}

export const SpawnHostCard: React.FC<SpawnHostCardProps> = ({ host }) => (
  <SiderCard>
    {Object.keys(spawnHostCardFieldMaps).map((key) => (
      <SpawnHostEntry
        key={key}
        field={key}
        value={spawnHostCardFieldMaps[key](host)}
      />
    ))}
  </SiderCard>
);

interface SpawnHostEntryProps {
  field: string;
  value: string | { key: string; value: string }[];
  type?: string;
}
const SpawnHostEntry: React.FC<SpawnHostEntryProps> = ({ field, value }) => (
  <SpawnHostEntryWrapper>
    <KeyWrapper>{field}</KeyWrapper>
    <div>{value}</div>
  </SpawnHostEntryWrapper>
);

const spawnHostCardFieldMaps = {
  "Created at": (host: Host) => <span>{getDateCopy(host?.uptime)}</span>,
  "Started at": (host: Host) => <span>{getDateCopy(host?.uptime)}</span>,
  "Expires at": (host: Host) => (
    <span>
      {host?.noExpiration ? "Does not expire" : getDateCopy(host?.expiration)}
    </span>
  ),
  "SSH User": (host: Host) => <span>{host?.distro?.user}</span>,
  "DNS Name": (host: Host) => <span>{host?.hostUrl}</span>,
  "Working Directory": (host: Host) => <span>{host?.distro?.workDir}</span>,
  "Availability Zone": (host: Host) => <span>{host?.distro?.user}</span>,
  "User Tags": (host: Host) => (
    <span>
      {host?.instanceTags?.map((tag) => (
        <Badge>
          {tag?.key}:{tag?.value}
        </Badge>
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
const SpawnHostEntryWrapper = styled.div`
  display: flex;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const KeyWrapper = styled.div`
  width: 150px;
`;
