import { useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Pagination from "@leafygreen-ui/pagination";
import { palette } from "@leafygreen-ui/palette";
import { useLeafyGreenTable } from "@leafygreen-ui/table/new";
import {
  getFacetedUniqueValues,
  getFilteredRowModel,
} from "@tanstack/react-table";
import Icon from "components/Icon";
import { SettingsCard, SettingsCardTitle } from "components/SettingsCard";
import { ShortenedRouterLink } from "components/styles";
import { BaseTable } from "components/Table/BaseTable";
import { getColumnTreeSelectFilterProps } from "components/Table/LGFilters";
import { getSubscriberText } from "constants/subscription";
import { size } from "constants/tokens";
import {
  resourceTypeToCopy,
  resourceTypeTreeData,
  triggerToCopy,
  triggerTreeData,
} from "constants/triggers";
import { useToastContext } from "context/toast";
import {
  DeleteSubscriptionsMutation,
  DeleteSubscriptionsMutationVariables,
  GeneralSubscription,
  Selector,
} from "gql/generated/types";
import { DELETE_SUBSCRIPTIONS } from "gql/mutations";
import { notificationMethodToCopy } from "types/subscription";
import { ClearSubscriptions } from "./ClearSubscriptions";
import { getResourceRoute, useSubscriptionData } from "./utils";

const { gray } = palette;

export const UserSubscriptions: React.VFC<{}> = () => {
  const dispatchToast = useToastContext();

  const [deleteSubscriptions] = useMutation<
    DeleteSubscriptionsMutation,
    DeleteSubscriptionsMutationVariables
  >(DELETE_SUBSCRIPTIONS, {
    onCompleted: (result) => {
      dispatchToast.success(
        `Deleted ${result.deleteSubscriptions} subscription${
          result.deleteSubscriptions === 1 ? "" : "s"
        }.`
      );
    },
    onError: (e) => {
      dispatchToast.error(
        `Error attempting to delete subscriptions: ${e.message}`
      );
    },
    refetchQueries: ["UserSubscriptions"],
  });

  const subscriptions = useSubscriptionData();

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
    withPagination: true,
  });

  const onDeleteSubscriptions = () => {
    const subscriptionIds = table
      .getSelectedRowModel()
      .rows.map(({ original }) => original.id);

    deleteSubscriptions({ variables: { subscriptionIds } });

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
                data-cy="delete-some-button"
                disabled={Object.entries(rowSelection).length === 0}
                leftGlyph={<Icon glyph="Trash" />}
                onClick={onDeleteSubscriptions}
                size="small"
              >
                Delete
                {Object.entries(rowSelection).length
                  ? ` (${Object.entries(rowSelection).length})`
                  : ""}
              </Button>
              <PaginationWrapper>
                <Pagination
                  itemsPerPage={table.getState().pagination.pageSize}
                  onItemsPerPageOptionChange={(value: string) => {
                    table.setPageSize(Number(value));
                  }}
                  numTotalItems={subscriptions.length}
                  currentPage={table.getState().pagination.pageIndex + 1}
                  onCurrentPageOptionChange={(value: string) => {
                    table.setPageIndex(Number(value) - 1);
                  }}
                  onBackArrowClick={() => table.previousPage()}
                  onForwardArrowClick={() => table.nextPage()}
                />
              </PaginationWrapper>
            </InteractiveWrapper>
            <BaseTable
              data-cy-row="subscription-row"
              table={table}
              shouldAlternateRowColor
            />
            <TableFooter>
              <ClearSubscriptions />
            </TableFooter>
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
    header: "ID",
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
    accessorKey: "subscriber.type",
    cell: ({ getValue }) => {
      const subscriberType = getValue();
      return notificationMethodToCopy[subscriberType] ?? subscriberType;
    },
    header: "Notify by",
  },
  {
    accessorKey: "subscriber",
    cell: ({ getValue }) => getSubscriberText(getValue()),
    header: "Target",
  },
];

const InteractiveWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${size.s};
`;

const PaginationWrapper = styled.div`
  width: 50%;
`;

const TableFooter = styled.div`
  box-shadow: 0 -4px ${gray.light2};
  display: flex;
  justify-content: flex-end;
  margin-top: ${size.s};
  padding-top: ${size.s};
`;
