import React from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import get from "lodash/get";
import { useParams } from "react-router-dom";
import Badge from "components/Badge";
import { Banners } from "components/Banners";
import { PageTitle } from "components/PageTitle";
import { PageWrapper } from "components/styles";
import {
  useBannerDispatchContext,
  useBannerStateContext,
} from "context/banners";
import {
  CommitQueueQuery,
  CommitQueueQueryVariables,
} from "gql/generated/types";
import { GET_COMMIT_QUEUE } from "gql/queries/get-commit-queue";
import { withBannersContext } from "hoc/withBannersContext";
import { usePageTitle } from "hooks";
import { CommitQueueCard } from "./commitqueue/CommitQueueCard";

const { gray } = uiColors;

const CommitQueueCore: React.FC = () => {
  const { id } = useParams();
  const dispatchBanner = useBannerDispatchContext();
  const bannersState = useBannerStateContext();
  const { data, loading } = useQuery<
    CommitQueueQuery,
    CommitQueueQueryVariables
  >(GET_COMMIT_QUEUE, {
    variables: { id },
    onError: (err) => {
      dispatchBanner.errorBanner(
        `There was an error loading the commit queue: ${err.message}`
      );
    },
  });

  const commitQueue = get(data, "commitQueue");
  const queue = get(commitQueue, "queue");
  usePageTitle(`Commit Queue - ${id}`);

  return (
    <PageWrapper>
      <Banners
        banners={bannersState}
        removeBanner={dispatchBanner.removeBanner}
      />
      <PageTitle
        title="Commit Queue"
        badge={
          <Badge variant="darkgray">
            {buildBadgeString(queue ? queue.length : 0)}
          </Badge>
        }
        loading={loading}
        hasData
      />
      <HR />
      {queue &&
        queue.map((queueItems, i) => (
          <CommitQueueCard
            key={queueItems.issue}
            index={i + 1}
            title={queueItems.patch && queueItems.patch.description}
            author={queueItems.patch && queueItems.patch.author}
            patchId={queueItems.patch && queueItems.patch.id}
            commitTime={queueItems.enqueueTime}
            moduleCodeChanges={
              queueItems.patch && queueItems.patch.moduleCodeChanges
            }
            commitQueueId={commitQueue.projectId}
          />
        ))}
      {!queue && <Body>There are no items in this queue. </Body>}
    </PageWrapper>
  );
};

const HR = styled("hr")`
  background-color: ${gray.light2};
  border: 0;
  height: 3px;
`;

const buildBadgeString = (queueLength: number): string => {
  if (queueLength !== 1) {
    return `${queueLength} Items`;
  }
  return `${queueLength} Item`;
};

export const CommitQueue = withBannersContext(CommitQueueCore);
