import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { BreadCrumb } from "components/Breadcrumb";
import { PageTitle } from "components/PageTitle";
import { ActionButtons } from "pages/patch/index";
import {
  PageWrapper,
  PageContent,
  PageLayout,
  PageSider,
} from "components/styles";
import { useQuery } from "@apollo/react-hooks";
import { GET_PATCH } from "gql/queries/patch";
import { PatchQuery, PatchQueryVariables } from "gql/generated/types";
import { PatchTabs } from "pages/patch/PatchTabs";
import { BuildVariants } from "pages/patch/BuildVariants";
import get from "lodash/get";
import { Metadata } from "pages/patch/Metadata";
import { paths } from "constants/routes";
import {
  useBannerDispatchContext,
  useBannerStateContext,
} from "context/banners";
import { Banners } from "components/Banners";
import { PatchStatusBadge } from "components/PatchStatusBadge";
import { withBannersContext } from "hoc/withBannersContext";
import { usePageTitle, usePollMonitor } from "hooks";
import { pollInterval } from "constants/index";
import { commitQueueAlias } from "constants/patch";

const PatchCore: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const dispatchBanner = useBannerDispatchContext();

  const bannersState = useBannerStateContext();

  const router = useHistory();
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

  useEffect(() => stopPolling, [stopPolling]);
  usePollMonitor(startPolling, stopPolling);
  const patch = get(data, "patch");
  const status = get(patch, "status");
  const description = get(patch, "description");
  const activated = get(patch, "activated");

  const alias = patch?.alias ?? null;
  const commitQueuePosition = patch?.commitQueuePosition ?? null;
  const isPatchOnCommitQueue = commitQueuePosition !== null;

  if (activated === false && alias !== commitQueueAlias) {
    router.replace(`${paths.patch}/${id}/configure`);
  }

  usePageTitle(`Patch${patch ? ` - ${patch.patchNumber} ` : ""}`);

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
      {patch && <BreadCrumb patchNumber={patch.patchNumber} />}
      <PageTitle
        loading={loading}
        hasData={!!patch}
        title={description || `Patch ${get(patch, "patchNumber")}`}
        badge={<PatchStatusBadge status={status} />}
        buttons={<ActionButtons isPatchOnCommitQueue={isPatchOnCommitQueue} />}
      />
      <PageLayout>
        <PageSider>
          <Metadata loading={loading} patch={patch} error={error} />
          <BuildVariants />
        </PageSider>
        <PageLayout>
          <PageContent>
            <PatchTabs taskCount={patch ? patch.taskCount : null} />
          </PageContent>
        </PageLayout>
      </PageLayout>
    </PageWrapper>
  );
};

export const Patch = withBannersContext(PatchCore);
