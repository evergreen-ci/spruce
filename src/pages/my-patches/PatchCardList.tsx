import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { PatchCard } from "pages/my-patches/patch-card-list/PatchCard";
import { Skeleton } from "antd";
import { FixedSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { Patch } from "gql/queries/my-patches";

interface Props {
  hasNextPage: boolean;
  isNextPageLoading: boolean;
  items: Patch[];
  loadNextPage: () => void;
}
export const PatchCardList = ({
  hasNextPage,
  isNextPageLoading,
  items,
  loadNextPage,
}: Props) => {
  const infiniteLoaderRef = useRef(null);
  const hasMountedRef = useRef(false);
  const { listen } = useHistory();
  useEffect(
    () =>
      listen(() => {
        if (hasMountedRef.current) {
          if (infiniteLoaderRef.current) {
            infiniteLoaderRef.current.resetloadMoreItemsCache();
          }
        }
        hasMountedRef.current = true;
      }),
    []
  );
  // If there are more items to be loaded then add an extra row to hold a loading indicator.
  const itemCount = hasNextPage ? items.length + 1 : items.length;

  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;

  // Every row is loaded except for our loading indicator row.
  const isItemLoaded = (index) => !hasNextPage || index < items.length;

  // Render an item or a loading indicator.
  const Item = ({ index }) =>
    !isItemLoaded(index) ? (
      <Skeleton active={true} title={false} paragraph={{ rows: 1 }} />
    ) : (
      <PatchCard {...items[index]} />
    );

  return (
    <InfiniteLoader
      ref={infiniteLoaderRef}
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <FixedSizeList
          itemCount={itemCount}
          onItemsRendered={onItemsRendered}
          ref={ref}
        >
          {Item}
        </FixedSizeList>
      )}
    </InfiniteLoader>
  );
};
