import React from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { Link } from "react-router-dom";
import { SiderCard } from "components/styles";
import { routes } from "constants/routes";
import { getDateCopy } from "utils/string";
import { Maybe } from "graphql/jsutils/Maybe";
interface Host {
  expiration?: Maybe<Date>;
  hostUrl: string;
  homeVolumeID?: Maybe<string>;
  id: string;
  instanceType?: Maybe<string>;
  noExpiration: boolean;
  provider: string;
  status: string;
  startedBy: string;
  tag: string;
  user?: Maybe<string>;
  uptime?: Maybe<Date>;
  distro?: Maybe<{
    isVirtualWorkStation?: Maybe<boolean>;
    id?: Maybe<string>;
    user?: Maybe<string>;
    workDir?: Maybe<string>;
  }>;
  instanceTags: Array<{
    key?: Maybe<string>;
    value?: Maybe<string>;
    canBeModified?: Maybe<boolean>;
  }>;
}
interface SpawnHostCardProps {
  host: Host;
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
  "Availability Zone": (host: Host) => <span>{host?.availabilityZone}</span>,
  "User Tags": (host: Host) => (
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
