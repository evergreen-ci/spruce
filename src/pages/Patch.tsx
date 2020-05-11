import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { BreadCrumb } from "components/Breadcrumb";
import { PageTitle } from "components/PageTitle";
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

const PatchCore: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatchBanner = useBannerDispatchContext();
  const bannersState = useBannerStateContext();
  const router = useHistory();
  const { data, loading, error, stopPolling } = useQuery<
    PatchQuery,
    PatchQueryVariables
  >(GET_PATCH, {
    variables: { id },
    pollInterval: 5000,
    onError: (e) =>
      dispatchBanner.error(
        `There was an error loading the patch: ${e.message}`
      ),
  });
  useEffect(() => stopPolling, [stopPolling]);
  const patch = get(data, "patch");
  const status = get(patch, "status");
  const description = get(patch, "description");
  const activated = get(patch, "activated");
  if (activated === false) {
    router.push(`${paths.patch}/${id}/configure`);
  }
  if (error) {
    return (
      <PageWrapper>
        <Banners banners={bannersState} removeBanner={dispatchBanner.remove} />
      </PageWrapper>
    );
  }
  return (
    <PageWrapper data-cy="patch-page">
      <Banners banners={bannersState} removeBanner={dispatchBanner.remove} />
      {patch && <BreadCrumb patchNumber={patch.patchNumber} />}
      <PageTitle
        loading={loading}
        hasData={!!patch}
        title={description || `Patch ${get(patch, "patchNumber")}`}
        badge={<PatchStatusBadge status={status} />}
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
