import { useMemo, useRef } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import {
  Cell,
  ExpandedContent,
  flexRender,
  HeaderCell,
  HeaderGroup,
  HeaderRow,
  LeafyGreenTableRow,
  Row,
  Table,
  TableBody,
  TableHead,
  useLeafyGreenTable,
} from "@leafygreen-ui/table/new";
import { SettingsCard, SettingsCardTitle } from "components/SettingsCard";
import { StyledRouterLink } from "components/styles";
import {
  getCommitQueueRoute,
  getHostRoute,
  getPatchRoute,
  getTaskRoute,
  getVersionRoute,
} from "constants/routes";
import { getSubscriberText } from "constants/subscription";
import { size } from "constants/tokens";
import {
  GeneralSubscription,
  UserSubscriptionsQuery,
  UserSubscriptionsQueryVariables,
} from "gql/generated/types";
import { USER_SUBSCRIPTIONS } from "gql/queries";
import { notificationMethodToCopy } from "types/subscription";
import {
  ResourceType,
  resourceTypeToCopy,
  triggerToCopy,
} from "types/triggers";

export const UserSubscriptions: React.VFC<{}> = () => {
  const { data } = useQuery<
    UserSubscriptionsQuery,
    UserSubscriptionsQueryVariables
  >(USER_SUBSCRIPTIONS);

  const subscriptions = useMemo(
    () =>
      // Filter out a user's global subscriptions for tasks, spawn hosts, etc.
      data?.user?.subscriptions
        ?.filter((subscription) =>
          subscription?.selectors?.find(
            (s) =>
              s.type !== "object" &&
              (s.type === "id" || s.type.startsWith("in-"))
          )
        )
        .map((subscription) => ({
          ...subscription,
          ...(Object.entries(subscription?.triggerData ?? {}).length > 0 && {
            renderExpandedContent: (row) => (
              <TriggerDataBlock>
                {JSON.stringify(row.original.triggerData, null, 2)}
              </TriggerDataBlock>
            ),
          }),
        })),
    [data]
  );

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useLeafyGreenTable<GeneralSubscription | any>({
    columns,
    containerRef: tableContainerRef,
    data: subscriptions ?? [],
  });

  if (!subscriptions) return null;
  // console.log(subscriptions);

  const { rows } = table.getRowModel();

  return (
    <>
      <SettingsCardTitle>Manage subscriptions</SettingsCardTitle>
      <SettingsCard>
        <Table table={table} ref={tableContainerRef} shouldAlternateRowColor>
          <TableHead>
            {table
              .getHeaderGroups()
              .map((headerGroup: HeaderGroup<GeneralSubscription>) => (
                <HeaderRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <HeaderCell key={header.id} header={header}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </HeaderCell>
                  ))}
                </HeaderRow>
              ))}
          </TableHead>
          <TableBody>
            {rows.map((row: LeafyGreenTableRow<GeneralSubscription>) => (
              <Row key={row.id} row={row}>
                {row.getVisibleCells().map((cell) => (
                  <Cell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Cell>
                ))}
                {row.original.renderExpandedContent && (
                  <ExpandedContent row={row} />
                )}
              </Row>
            ))}
          </TableBody>
        </Table>
      </SettingsCard>
    </>
  );
};

const columns = [
  {
    header: "Type",
    accessorKey: "resourceType",
    cell: ({ getValue }) => {
      const resourceType = getValue();
      return resourceTypeToCopy?.[resourceType] ?? resourceType;
    },
  },
  {
    header: "ID",
    accessorKey: "selectors",
    cell: ({
      getValue,
      row: {
        original: { resourceType },
      },
    }) => {
      const selectors = getValue();
      const selectorId = selectors.find((s) => s.type !== "object")?.data;
      const route = getRoute(resourceType, selectorId);

      return route ? <IdLink to={route}>{selectorId}</IdLink> : selectorId;
    },
  },
  {
    header: "Event",
    accessorKey: "trigger",
    cell: ({ getValue }) => {
      const trigger = getValue();
      return triggerToCopy?.[trigger] ?? trigger;
    },
  },
  {
    header: "Notify by",
    accessorKey: "subscriber.type",
    cell: ({ getValue }) => {
      const subscriberType = getValue();
      return notificationMethodToCopy[subscriberType] ?? subscriberType;
    },
  },
  {
    header: "Target",
    accessorKey: "subscriber",
    cell: ({ getValue }) => getSubscriberText(getValue()),
  },
];

const getRoute = (resourceType: ResourceType, id: string) => {
  if (!id) {
    return "";
  }

  switch (resourceType) {
    case ResourceType.Build:
    case ResourceType.Version:
      return getVersionRoute(id);
    case ResourceType.Patch:
      return getPatchRoute(id, { configure: false });
    case ResourceType.Task:
      return getTaskRoute(id);
    case ResourceType.Host:
      return getHostRoute(id);
    case ResourceType.CommitQueue:
      return getCommitQueueRoute(id);
    default:
      return "";
  }
};

const IdLink = styled(StyledRouterLink)`
  span {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const TriggerDataBlock = styled.pre`
  padding: ${size.s} ${size.l};
`;
