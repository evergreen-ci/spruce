import React from "react";
import { formatDistanceToNow } from "date-fns";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { SpawnTable } from "components/Spawn";
import { getHostRoute } from "constants/routes";
import { Volume, Host, Maybe } from "gql/generated/types";
import { SpawnVolumeCard } from "pages/spawn/spawnVolume/spawnVolumeTable/SpawnVolumeCard";
import { parseQueryString } from "utils";
import { sortFunctionDate } from "utils/string";
import { SpawnHostTableActions } from "../spawnHost/SpawnHostTableActions";
import { VolumeStatusBadge } from "./spawnVolumeTable/VolumeStatusBadge";
import { ColumnProps } from "antd/es/table";

interface SpawnVolumeTableProps {
  volumes: Array<{
    id: string;
    displayName: string;
    createdBy: string;
    type: string;
    availabilityZone: string;
    size: number;
    expiration?: Maybe<Date>;
    deviceName?: Maybe<string>;
    hostID: string;
    noExpiration: boolean;
    homeVolume: boolean;
    host?: Maybe<{ displayName?: Maybe<string> }>;
  }>;
}

export const SpawnVolumeTable: React.FC<SpawnVolumeTableProps> = ({
  volumes,
}) => {
  const { search } = useLocation();
  const queryParams = parseQueryString(search);
  const volume = queryParams?.volume;
  return (
    <SpawnTable
      expandedRowRender={(record: Volume) => (
        <SpawnVolumeCard volume={record} />
      )}
      columns={columns}
      dataSource={volumes}
      defaultExpandedRowKeys={[volume as string]}
    />
  );
};

const getVolumeDisplayName = (v: Volume) => v.displayName ?? v.id;
const getHostDisplayName = (v: Volume) => v?.host?.displayName ?? v.hostID;
const sortByHost = (a: Volume, b: Volume) =>
  getHostDisplayName(a).localeCompare(getHostDisplayName(b));

const columns: Array<ColumnProps<Volume>> = [
  {
    title: "Volume",
    key: "displayName",
    sorter: (a: Volume, b: Volume) =>
      getVolumeDisplayName(a).localeCompare(getVolumeDisplayName(b)),
    render: (_, volume: Volume) => getVolumeDisplayName(volume),
  },
  {
    title: "Mounted On",
    key: "mountedOn",
    sorter: sortByHost,
    render: (_, volume: Volume) => (
      <Link data-cy="host-link" to={getHostRoute(volume.hostID)}>
        {getHostDisplayName(volume)}
      </Link>
    ),
  },
  {
    title: "Status",
    key: "status",
    sorter: sortByHost,
    render: (_, volume: Volume) => <VolumeStatusBadge volume={volume} />,
  },
  {
    title: "Expires In",
    dataIndex: "expiration",
    key: "expiration",
    sorter: (a: Volume, b: Volume) => sortFunctionDate(a, b, "expiration"),
    render: (expiration, volume: Volume) =>
      volume.noExpiration
        ? "Does not expire"
        : formatDistanceToNow(new Date(expiration)),
  },
  {
    title: "Actions",
    dataIndex: "uptime",
    key: "uptime",
    sorter: (a: Volume, b: Host) => sortFunctionDate(a, b, "uptime"),
    render: (uptime) => formatDistanceToNow(new Date(uptime)),
  },
];
