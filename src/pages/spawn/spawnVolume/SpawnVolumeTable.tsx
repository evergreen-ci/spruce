import React from "react";
import { formatDistanceToNow } from "date-fns";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { SpawnTable } from "components/Spawn";
import { getHostRoute } from "constants/routes";
import { Volume, Host } from "gql/generated/types";
import { SpawnVolumeCard } from "pages/spawn/spawnVolume/spawnVolumeTable/SpawnVolumeCard";
import { parseQueryString } from "utils";
import { sortFunctionString, sortFunctionDate } from "utils/string";
import { SpawnHostTableActions } from "../spawnHost/SpawnHostTableActions";
import { VolumeStatusBadge } from "./spawnVolumeTable/VolumeStatusBadge";

interface SpawnVolumeTableProps {
  volumes: Volume[];
}

export const SpawnHostTable: React.FC<SpawnVolumeTableProps> = ({
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
const columns = [
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
    sorter: (a: Volume, b: Volume) => a.hostID.localeCompare(b.hostID),
    render: (_, volume: Volume) => (
      <Link data-cy="host-link" to={getHostRoute(volume.hostID)}>
        {volume.hostID}
      </Link>
    ),
  },
  {
    title: "Status",
    key: "status",
    sorter: (a: Volume, b: Volume) => a.hostID.localeCompare(b.hostID),
    render: (_, volume: Volume) => <VolumeStatusBadge volume={volume} />,
  },
  {
    title: "Expires In",
    dataIndex: "expiration",
    key: "expiration",
    sorter: (a: Host, b: Host) => sortFunctionDate(a, b, "expiration"),
    render: (expiration, host: Host) =>
      host?.noExpiration
        ? "Does not expire"
        : formatDistanceToNow(new Date(expiration)),
  },
  {
    title: "Actions",
    dataIndex: "uptime",
    key: "uptime",
    sorter: (a: Host, b: Host) => sortFunctionDate(a, b, "uptime"),
    render: (uptime) => formatDistanceToNow(new Date(uptime)),
  },
];
