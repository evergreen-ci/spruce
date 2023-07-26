import { useMemo } from "react";
import { ColumnProps } from "antd/es/table";
import { formatDistanceToNow } from "date-fns";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import { DoesNotExpire, SpawnTable } from "components/Spawn";
import { StyledRouterLink, WordBreak } from "components/styles";
import { SEEN_MIGRATE_GUIDE_CUE } from "constants/cookies";
import { getSpawnHostRoute } from "constants/routes";
import { MyVolume, TableVolume } from "types/spawn";
import { queryString, string } from "utils";
import { SpawnVolumeCard } from "./SpawnVolumeCard";
import { SpawnVolumeTableActions } from "./SpawnVolumeTableActions";
import { VolumeStatusBadge } from "./VolumeStatusBadge";

const { sortFunctionDate } = string;
const { parseQueryString } = queryString;

interface SpawnVolumeTableProps {
  volumes: MyVolume[];
}

export const SpawnVolumeTable: React.VFC<SpawnVolumeTableProps> = ({
  volumes,
}) => {
  const { search } = useLocation();
  const volume = parseQueryString(search)?.volume;
  const dataSource: TableVolume[] = useMemo(() => {
    const volumesCopy = [...volumes];
    volumesCopy.sort(sortByHost);
    const firstMigrateableVolumeId =
      volumesCopy.find((v) => v.homeVolume)?.id ?? "";
    return volumes.map((v) => ({
      ...v,
      showMigrateBtnCue:
        v.id === firstMigrateableVolumeId &&
        Cookies.get(SEEN_MIGRATE_GUIDE_CUE) !== "true",
    }));
  }, [volumes]);
  return (
    <SpawnTable
      expandedRowRender={(record: TableVolume) => (
        <SpawnVolumeCard volume={record} />
      )}
      columns={columns}
      dataSource={dataSource}
      defaultExpandedRowKeys={[volume as string]}
    />
  );
};

const getVolumeDisplayName = (v: TableVolume) =>
  v.displayName ? v.displayName : v.id;

const getHostDisplayName = (v: TableVolume) =>
  v?.host?.displayName ? v.host.displayName : v.hostID;

const sortByHost = (a: TableVolume, b: TableVolume) =>
  getHostDisplayName(a).localeCompare(getHostDisplayName(b));

const columns: Array<ColumnProps<TableVolume>> = [
  {
    key: "displayName",
    render: (_, volume: TableVolume) => (
      <WordBreak data-cy="vol-name">{getVolumeDisplayName(volume)}</WordBreak>
    ),
    sorter: (a: TableVolume, b: TableVolume) =>
      getVolumeDisplayName(a).localeCompare(getVolumeDisplayName(b)),
    title: "Volume",
  },
  {
    key: "mountedOn",
    render: (_, volume: TableVolume) => (
      <StyledRouterLink
        data-cy="host-link"
        to={getSpawnHostRoute({ host: volume.hostID })}
      >
        <WordBreak>{getHostDisplayName(volume)}</WordBreak>
      </StyledRouterLink>
    ),
    sorter: sortByHost,
    title: "Mounted On",
  },
  {
    defaultSortOrder: "ascend",
    key: "status",
    render: (_, volume: TableVolume) => <VolumeStatusBadge volume={volume} />,
    sorter: sortByHost,
    title: "Status",
  },
  {
    dataIndex: "expiration",
    render: (expiration, volume: TableVolume) =>
      volume.noExpiration || !volume.expiration
        ? DoesNotExpire
        : formatDistanceToNow(new Date(expiration)),
    sorter: (a: TableVolume, b: TableVolume) =>
      sortFunctionDate(a, b, "expiration"),
    title: "Expires In",
  },
  {
    render: (volume: TableVolume) => (
      <SpawnVolumeTableActions volume={volume} />
    ),
    title: "Actions",
  },
];
