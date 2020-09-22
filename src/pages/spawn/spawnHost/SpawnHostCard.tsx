import React from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { Link } from "react-router-dom";
import { SiderCard } from "components/styles";
import { routes } from "constants/routes";
import { getDateCopy } from "utils/string";
import { MyHost } from "./types";

interface SpawnHostCardProps {
  host: MyHost;
}

export const SpawnHostCard: React.FC<SpawnHostCardProps> = ({ host }) => (
  <StyledSiderCard data-cy="spawn-host-card">
    {Object.keys(spawnHostCardFieldMaps).map((key) => (
      <SpawnHostEntry
        key={`${key}_${host.id}`}
        field={key}
        value={spawnHostCardFieldMaps[key](host)}
      />
    ))}
  </StyledSiderCard>
);

interface SpawnHostEntryProps {
  field: string;
  value: string | { key: string; value: string }[];
}
const SpawnHostEntry: React.FC<SpawnHostEntryProps> = ({ field, value }) => (
  <SpawnHostEntryWrapper>
    <KeyWrapper>{field}</KeyWrapper>
    <div>{value}</div>
  </SpawnHostEntryWrapper>
);

const spawnHostCardFieldMaps = {
  ID: (host: MyHost) => <span>{host?.id}</span>,
  "Created at": (host: MyHost) => <span>{getDateCopy(host?.uptime)}</span>,
  "Started at": (host: MyHost) => <span>{getDateCopy(host?.uptime)}</span>,
  "Expires at": (host: MyHost) => (
    <span>
      {host?.noExpiration ? "Does not expire" : getDateCopy(host?.expiration)}
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
const StyledSiderCard = styled(SiderCard)`
  width: 80%;
  padding-bottom: 32px;
`;
const SpawnHostEntryWrapper = styled.div`
  display: flex;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const KeyWrapper = styled.div`
  min-width: 150px;
`;
