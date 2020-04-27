import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { PatchCard } from "pages/my-patches/patch-card-list/PatchCard";
import { Skeleton } from "antd";
import { FixedSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { Patch } from "gql/queries/my-patches";
import AutoSizer from "react-virtualized-auto-sizer";

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
    [listen]
  );
  const itemCount = hasNextPage ? items.length + 1 : items.length;
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;
  const isItemLoaded = (index) => !hasNextPage || index < items.length;
  const Item = ({ index, style }) =>
    !isItemLoaded(index) ? (
      <Skeleton active={true} title={false} paragraph={{ rows: 2 }} />
    ) : (
      <PatchCard style={style} {...items[index]} />
    );

  return (
    <InfiniteLoader
      ref={infiniteLoaderRef}
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
      threshold={4}
    >
      {({ onItemsRendered, ref }) => (
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              itemCount={itemCount}
              onItemsRendered={onItemsRendered}
              ref={ref}
              height={height}
              itemSize={80}
              width={width}
            >
              {Item}
            </FixedSizeList>
          )}
        </AutoSizer>
      )}
    </InfiniteLoader>
  );
};
