import { useMemo, useRef } from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { LeafyGreenTableRow, useLeafyGreenTable } from "@leafygreen-ui/table";
import { formatDistanceToNow } from "date-fns";
import { useLocation } from "react-router-dom";
import HostStatusBadge from "components/HostStatusBadge";
import { DoesNotExpire } from "components/Spawn";
import { WordBreak } from "components/styles";
import { BaseTable } from "components/Table/BaseTable";
import { size } from "constants/tokens";
import { MyHost } from "types/spawn";
import { queryString } from "utils";
import { SpawnHostCard } from "./SpawnHostCard";
import { SpawnHostTableActions } from "./SpawnHostTableActions";

const { parseQueryString } = queryString;

interface SpawnHostTableProps {
  hosts: MyHost[];
}
export const SpawnHostTable: React.FC<SpawnHostTableProps> = ({ hosts }) => {
  const { search } = useLocation();

  const dataSource = useMemo(
    () =>
      hosts.map((h) => ({
        ...h,
        renderExpandedContent: (row: LeafyGreenTableRow<MyHost>) => (
          <SpawnHostCard host={row.original} />
        ),
      })),
    [hosts]
  );

  const selectedHost = parseQueryString(search)?.host;
  const initialExpanded = Object.fromEntries(
    dataSource.map(({ id }, i) => [i, id === selectedHost])
  );

  console.log(dataSource);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useLeafyGreenTable<MyHost>({
    columns,
    containerRef: tableContainerRef,
    data: dataSource,
    defaultColumn: {
      enableColumnFilter: false,
      enableSorting: false,
      size: "auto" as unknown as number,
      // Handle bug in sorting order
      // https://github.com/TanStack/table/issues/4289
      sortDescFirst: false,
    },
    initialState: {
      expanded: initialExpanded,
    },
  });

  return <BaseTable table={table} shouldAlternateRowColor />;
};

const columns = [
  {
    header: "Host",
    accessorKey: "id",
    enableSorting: true,
    cell: ({ getValue, row }) => {
      const id = getValue();
      return row.original.distro?.isVirtualWorkStation ? (
        <FlexContainer>
          <NoWrap>{row.original.displayName || id}</NoWrap>
          <Badge>Workstation</Badge>
        </FlexContainer>
      ) : (
        <WordBreak>{row.original.displayName || id}</WordBreak>
      );
    },
  },
  {
    header: "Distro",
    accessorFn: ({ distro: { id } }) => id,
    enableSorting: true,
    cell: ({ getValue }) => <WordBreak>{getValue()}</WordBreak>,
  },
  {
    header: "Status",
    accessorKey: "status",
    enableSorting: true,
    cell: ({ getValue }) => <HostStatusBadge status={getValue()} />,
  },
  {
    header: "Expires In",
    accessorFn: ({ expiration }) => new Date(expiration),
    enableSorting: true,
    cell: ({ getValue, row }) =>
      row.original.noExpiration
        ? DoesNotExpire
        : formatDistanceToNow(getValue()),
  },
  {
    header: "Uptime",
    accessorFn: ({ uptime }) => new Date(uptime),
    enableSorting: true,
    cell: ({ getValue }) => formatDistanceToNow(getValue()),
  },
  {
    header: "Actions",
    cell: ({ row }) => <SpawnHostTableActions host={row.original} />,
  },
];

const FlexContainer = styled.div`
  align-items: baseline;
  display: flex;
  gap: ${size.xs};
`;

const NoWrap = styled.span`
  white-space: nowrap;
`;
