import { useMemo, useRef } from "react";
import { LeafyGreenTableRow, useLeafyGreenTable } from "@leafygreen-ui/table";
import { formatDistanceToNow } from "date-fns";
import { useLocation } from "react-router-dom";
import { DoesNotExpire } from "components/Spawn";
import { StyledRouterLink, WordBreak } from "components/styles";
import { BaseTable } from "components/Table/BaseTable";
import { getSpawnHostRoute } from "constants/routes";
import { MyVolume, TableVolume } from "types/spawn";
import { queryString } from "utils";
import { SpawnVolumeCard } from "./SpawnVolumeCard";
import { SpawnVolumeTableActions } from "./SpawnVolumeTableActions";
import { VolumeStatusBadge } from "./VolumeStatusBadge";

const { parseQueryString } = queryString;

interface SpawnVolumeTableProps {
  volumes: MyVolume[];
}

export const SpawnVolumeTable: React.FC<SpawnVolumeTableProps> = ({
  volumes,
}) => {
  const { search } = useLocation();
  const dataSource: TableVolume[] = useMemo(() => {
    const volumesCopy = [...volumes];
    volumesCopy.sort(sortByHost);
    return volumes.map((v) => ({
      ...v,
      renderExpandedContent: (row: LeafyGreenTableRow<TableVolume>) => (
        <SpawnVolumeCard volume={row.original} />
      ),
    }));
  }, [volumes]);

  const selectedVolume = parseQueryString(search)?.volume;
  const initialExpanded = Object.fromEntries(
    dataSource.map(({ id }, i) => [i, id === selectedVolume])
  );

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useLeafyGreenTable<TableVolume>({
    columns,
    containerRef: tableContainerRef,
    data: dataSource,
    defaultColumn: {
      size: "auto" as unknown as number,
    },
    initialState: {
      expanded: initialExpanded,
    },
  });

  return <BaseTable table={table} shouldAlternateRowColor />;
};

const getHostDisplayName = (v: TableVolume) =>
  v?.host?.displayName ? v.host.displayName : v.hostID;

const sortByHost = (a: TableVolume, b: TableVolume) =>
  getHostDisplayName(a).localeCompare(getHostDisplayName(b));

const columns = [
  {
    header: "Volume",
    accessorFn: ({ displayName, id }) => displayName || id,
    enableSorting: true,
    cell: ({ getValue }) => (
      <WordBreak data-cy="vol-name">{getValue()}</WordBreak>
    ),
  },
  {
    header: "Mounted On",
    accessorFn: ({ host, hostID }) => host?.displayName || hostID,
    enableSorting: true,
    cell: ({ getValue, row }) => {
      const hostId = row.original.hostID;
      return (
        hostId && (
          <StyledRouterLink
            data-cy="host-link"
            to={getSpawnHostRoute({ host: hostId })}
          >
            <WordBreak>{getValue()}</WordBreak>
          </StyledRouterLink>
        )
      );
    },
  },
  {
    header: "Status",
    accessorKey: "hostID",
    enableSorting: true,
    cell: ({ getValue, row }) => {
      const hostId = getValue();
      const { migrating } = row.original;
      return <VolumeStatusBadge hostId={hostId} migrating={migrating} />;
    },
  },
  {
    header: "Expires In",
    accessorFn: ({ expiration }) => new Date(expiration),
    enableSorting: true,
    cell: ({ getValue, row }) => {
      const expiration = getValue();
      const { noExpiration } = row.original;
      return noExpiration || !expiration
        ? DoesNotExpire
        : formatDistanceToNow(expiration);
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => <SpawnVolumeTableActions volume={row.original} />,
  },
];
