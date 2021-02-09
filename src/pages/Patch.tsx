import React from "react";
import { useQuery } from "@apollo/client";
import { useParams, Redirect } from "react-router-dom";
import { Banners } from "components/Banners";
import { BreadCrumb } from "components/Breadcrumb";
import { PageTitle } from "components/PageTitle";
import { PatchStatusBadge } from "components/PatchStatusBadge";
import {
  PageWrapper,
  PageContent,
  PageLayout,
  PageSider,
} from "components/styles";
import { pollInterval } from "constants/index";
import { commitQueueAlias } from "constants/patch";
import { getPatchRoute } from "constants/routes";
import {
  useBannerDispatchContext,
  useBannerStateContext,
} from "context/banners";
import { PatchQuery, PatchQueryVariables } from "gql/generated/types";
import { GET_PATCH } from "gql/queries/patch";
import { withBannersContext } from "hoc/withBannersContext";
import { usePageTitle, useNetworkStatus } from "hooks";
import { BuildVariants } from "pages/patch/BuildVariants";
import { ActionButtons } from "pages/patch/index";
import { Metadata } from "pages/patch/Metadata";
import { PatchTabs } from "pages/patch/PatchTabs";

const PatchCore: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const dispatchBanner = useBannerDispatchContext();
  const bannersState = useBannerStateContext();

  const { data, loading, error, startPolling, stopPolling } = useQuery<
    PatchQuery,
    PatchQueryVariables
  >(GET_PATCH, {
    variables: { id },
    pollInterval,
    onError: (e) =>
      dispatchBanner.errorBanner(
        `There was an error loading the patch: ${e.message}`
      ),
  });

  useNetworkStatus(startPolling, stopPolling);

  const { patch } = data || {};
  const {
    status,
    description,
    activated,
    commitQueuePosition,
    alias,
    patchNumber,
    author,
    canEnqueueToCommitQueue,
    taskCount,
  } = patch || {};

  const isPatchOnCommitQueue = commitQueuePosition !== null;

  usePageTitle(`Patch${patch ? ` - ${patchNumber} ` : ""}`);

  if (activated === false && alias !== commitQueueAlias) {
    return <Redirect to={getPatchRoute(id, { configure: true })} />;
  }
  if (error) {
    return (
      <PageWrapper>
        <Banners
          banners={bannersState}
          removeBanner={dispatchBanner.removeBanner}
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper data-cy="patch-page">
      <Banners
        banners={bannersState}
        removeBanner={dispatchBanner.removeBanner}
      />
      {patch && <BreadCrumb patchAuthor={author} patchNumber={patchNumber} />}
      <PageTitle
        loading={loading}
        hasData={!!patch}
        title={description || `Patch ${patchNumber}`}
        badge={<PatchStatusBadge status={status} />}
        buttons={
          <ActionButtons
            canEnqueueToCommitQueue={canEnqueueToCommitQueue}
            isPatchOnCommitQueue={isPatchOnCommitQueue}
            patchId={id}
          />
        }
      />
      <PageLayout>
        <PageSider>
          <Metadata loading={loading} patch={patch} error={error} />
          <BuildVariants />
        </PageSider>
        <PageLayout>
          <PageContent>
            <PatchTabs taskCount={patch ? taskCount : null} />
          </PageContent>
        </PageLayout>
      </PageLayout>
    </PageWrapper>
  );
};

export const Patch = withBannersContext(PatchCore);
