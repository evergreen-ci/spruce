import React from "react";
import styled from "@emotion/styled";
import { ColumnProps } from "antd/es/table";
import { formatDistanceToNow } from "date-fns";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { DoesNotExpire, SpawnTable } from "components/Spawn";
import { wordBreakCss } from "components/Typography";
import { getHostRoute } from "constants/routes";
import { SpawnVolumeCard } from "pages/spawn/spawnVolume/spawnVolumeTable/SpawnVolumeCard";
import { MyVolume } from "types/spawn";
import { parseQueryString } from "utils";
import { sortFunctionDate } from "utils/string";
import { SpawnVolumeTableActions } from "./spawnVolumeTable/SpawnVolumeTableActions";
import { VolumeStatusBadge } from "./spawnVolumeTable/VolumeStatusBadge";

interface SpawnVolumeTableProps {
  volumes: MyVolume[];
}

export const SpawnVolumeTable: React.FC<SpawnVolumeTableProps> = ({
  volumes,
}) => {
  const { search } = useLocation();
  const volume = parseQueryString(search)?.volume;
  return (
    <SpawnTable
      expandedRowRender={(record: MyVolume) => (
        <SpawnVolumeCard volume={record} />
      )}
      columns={columns}
      dataSource={volumes}
      defaultExpandedRowKeys={[volume as string]}
    />
  );
};

const getVolumeDisplayName = (v: MyVolume) =>
  v.displayName ? v.displayName : v.id;

const getHostDisplayName = (v: MyVolume) =>
  v?.host?.displayName ? v.host.displayName : v.hostID;

const sortByHost = (a: MyVolume, b: MyVolume) =>
  getHostDisplayName(a).localeCompare(getHostDisplayName(b));

const columns: Array<ColumnProps<MyVolume>> = [
  {
    title: "MyVolume",
    key: "displayName",
    sorter: (a: MyVolume, b: MyVolume) =>
      getVolumeDisplayName(a).localeCompare(getVolumeDisplayName(b)),
    render: (_, volume: MyVolume) => (
      <WordBreak data-cy="vol-name">{getVolumeDisplayName(volume)}</WordBreak>
    ),
    width: 400,
  },
  {
    title: "Mounted On",
    key: "mountedOn",
    sorter: sortByHost,
    render: (_, volume: MyVolume) => (
      <Link data-cy="host-link" to={getHostRoute(volume.hostID)}>
        <WordBreak> {getHostDisplayName(volume)}</WordBreak>
      </Link>
    ),
    width: 400,
  },
  {
    title: "Status",
    key: "status",
    sorter: sortByHost,
    defaultSortOrder: "ascend",
    render: (_, volume: MyVolume) => <VolumeStatusBadge volume={volume} />,
  },
  {
    title: "Expires In",
    dataIndex: "expiration",
    sorter: (a: MyVolume, b: MyVolume) => sortFunctionDate(a, b, "expiration"),
    render: (expiration, volume: MyVolume) =>
      volume.noExpiration || !volume.expiration
        ? DoesNotExpire
        : formatDistanceToNow(new Date(expiration)),
  },
  {
    title: "Actions",
    render: (volume: MyVolume) => <SpawnVolumeTableActions volume={volume} />,
  },
];

const WordBreak = styled.span`
  ${wordBreakCss};
`;
