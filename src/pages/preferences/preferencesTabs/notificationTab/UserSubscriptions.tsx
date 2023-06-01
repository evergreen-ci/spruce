import { useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import {
  Cell,
  ExpandedContent,
  flexRender,
  HeaderCell,
  HeaderRow,
  Row,
  Table,
  TableBody,
  TableHead,
  useLeafyGreenTable,
} from "@leafygreen-ui/table/new";
import {
  getFacetedUniqueValues,
  getFilteredRowModel,
} from "@tanstack/react-table";
import Icon from "components/Icon";
import { SettingsCard, SettingsCardTitle } from "components/SettingsCard";
import { ShortenedRouterLink } from "components/styles";
import { getColumnTreeSelectFilterProps } from "components/Table/LGFilters";
import { getSubscriberText } from "constants/subscription";
import { size } from "constants/tokens";
import {
  resourceTypeToCopy,
  resourceTypeTreeData,
  triggerToCopy,
  triggerTreeData,
} from "constants/triggers";
import {
  DeleteSubscriptionsMutation,
  DeleteSubscriptionsMutationVariables,
  GeneralSubscription,
  Selector,
  UserSubscriptionsQuery,
  UserSubscriptionsQueryVariables,
} from "gql/generated/types";
import { DELETE_SUBSCRIPTIONS } from "gql/mutations";
import { USER_SUBSCRIPTIONS } from "gql/queries";
import { notificationMethodToCopy } from "types/subscription";
import { getResourceRoute, processSubscriptionData } from "./utils";

export const UserSubscriptions: React.VFC<{}> = () => {
  const { data } = useQuery<
    UserSubscriptionsQuery,
    UserSubscriptionsQueryVariables
  >(USER_SUBSCRIPTIONS);

  const [deleteSubscriptions] = useMutation<
    DeleteSubscriptionsMutation,
    DeleteSubscriptionsMutationVariables
  >(DELETE_SUBSCRIPTIONS, { refetchQueries: ["UserSubscriptions"] });

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

  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useLeafyGreenTable<GeneralSubscription>({
    columns,
    containerRef: tableContainerRef,
    data: subscriptions ?? [],
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    hasSelectableRows: true,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      rowSelection,
    },
  });

  const { rows } = table.getRowModel();

  const onDeleteSubscriptions = () => {
    const subscriptionIds = table
      .getSelectedRowModel()
      .rows.map(({ original }) => original.id);

    deleteSubscriptions({
      variables: { subscriptionIds },
    });

    table.resetRowSelection();
  };

  return (
    <>
      <SettingsCardTitle>Manage subscriptions</SettingsCardTitle>
      <SettingsCard>
        {!subscriptions?.length ? (
          "No subscriptions found."
        ) : (
          <>
            <InteractiveWrapper>
              <Button
                disabled={Object.entries(rowSelection).length === 0}
                leftGlyph={<Icon glyph="Trash" />}
                onClick={onDeleteSubscriptions}
                size="small"
              >
                Delete
              </Button>
            </InteractiveWrapper>

            <Table
              table={table}
              ref={tableContainerRef}
              shouldAlternateRowColor
            >
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
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
                {rows.map((row) => (
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
          </>
        )}
      </SettingsCard>
    </>
  );
};

const columns = [
  {
    accessorKey: "resourceType",
    cell: ({ getValue }) => {
      const resourceType = getValue();
      return resourceTypeToCopy?.[resourceType] ?? resourceType;
    },
    ...getColumnTreeSelectFilterProps({
      "data-cy": "status-filter-popover",
      tData: resourceTypeTreeData,
      title: "Type",
    }),
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

      return route ? (
        <ShortenedRouterLink to={route}>{selectorId}</ShortenedRouterLink>
      ) : (
        selectorId
      );
    },
  },
  {
    accessorKey: "trigger",
    ...getColumnTreeSelectFilterProps({
      "data-cy": "trigger-filter-popover",
      tData: triggerTreeData,
      title: "Event",
    }),
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

const InteractiveWrapper = styled.div`
  margin-bottom: ${size.s};
`;
