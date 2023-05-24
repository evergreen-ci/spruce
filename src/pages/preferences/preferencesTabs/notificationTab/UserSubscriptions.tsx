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
import { getSubscriberText } from "constants/subscription";
import {
  GeneralSubscription,
  Selector,
  UserSubscriptionsQuery,
  UserSubscriptionsQueryVariables,
} from "gql/generated/types";
import { USER_SUBSCRIPTIONS } from "gql/queries";
import { notificationMethodToCopy } from "types/subscription";
import { resourceTypeToCopy, triggerToCopy } from "types/triggers";
import { getResourceRoute, processSubscriptionData } from "./utils";

export const UserSubscriptions: React.VFC<{}> = () => {
  const { data } = useQuery<
    UserSubscriptionsQuery,
    UserSubscriptionsQueryVariables
  >(USER_SUBSCRIPTIONS);

  const globalSubscriptionIds = useMemo(() => {
    const {
      buildBreakId,
      commitQueueId,
      patchFinishId,
      patchFirstFailureId,
      spawnHostExpirationId,
      spawnHostOutcomeId,
    } = data?.userSettings?.notifications ?? {};
    return new Set([
      buildBreakId,
      commitQueueId,
      patchFinishId,
      patchFirstFailureId,
      spawnHostExpirationId,
      spawnHostOutcomeId,
    ]);
  }, [data?.userSettings?.notifications]);

  const subscriptions = useMemo(
    () =>
      processSubscriptionData(data?.user?.subscriptions, globalSubscriptionIds),
    [data?.user?.subscriptions, globalSubscriptionIds]
  );

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useLeafyGreenTable<GeneralSubscription | any>({
    columns,
    containerRef: tableContainerRef,
    data: subscriptions ?? [],
  });

  const { rows } = table.getRowModel();

  return (
    <>
      <SettingsCardTitle>Manage subscriptions</SettingsCardTitle>
      <SettingsCard>
        {!subscriptions?.length ? (
          "No subscriptions found."
        ) : (
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
                <Row key={row.id} row={row} data-cy="subscription-row">
                  {row.getVisibleCells().map((cell) => (
                    <Cell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Cell>
                  ))}
                  {row.original.renderExpandedContent && (
                    <ExpandedContent row={row} />
                  )}
                </Row>
              ))}
            </TableBody>
          </Table>
        )}
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
      const resourceSelector = selectors.find(
        (s: Selector) => s.type !== "object" && s.type !== "requester"
      );
      const { data: selectorId } = resourceSelector ?? {};
      const route = getResourceRoute(resourceType, resourceSelector);

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

const IdLink = styled(StyledRouterLink)`
  span {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
