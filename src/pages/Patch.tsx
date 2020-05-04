import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
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
import Badge, { Variant } from "@leafygreen-ui/badge";
import { PatchStatus } from "types/patch";
import { useHistory } from "react-router-dom";
import { paths } from "constants/routes";
import {
  useBannerDispatchContext,
  useBannerStateContext,
  BannerContextProvider,
} from "context/banners";
import { Banners } from "components/Banners";
import Button from "@leafygreen-ui/button";

const PatchCore = () => {
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
  });
  useEffect(() => stopPolling, [stopPolling]);
  const patch = get(data, "patch");
  const status = get(patch, "status");
  const description = get(patch, "description");
  const activated = get(patch, "activated");
  useEffect(() => {
    if (error) {
      dispatchBanner.error(
        `There was an error loading the patch: ${error.message}`
      );
    }
  }, [error]);
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
    <PageWrapper>
      <Banners banners={bannersState} removeBanner={dispatchBanner.remove} />
      {patch && <BreadCrumb patchNumber={patch.patchNumber} />}
      <PageTitle
        loading={loading}
        hasData={!!patch}
        title={description ? description : `Patch ${get(patch, "patchNumber")}`}
        badge={
          <Badge variant={mapPatchStatusToBadgeVariant[status]}>{status}</Badge>
        }
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

export const Patch = () => {
  return (
    <BannerContextProvider>
      <PatchCore />
    </BannerContextProvider>
  );
};

const mapPatchStatusToBadgeVariant = {
  [PatchStatus.Created]: Variant.LightGray,
  [PatchStatus.Failed]: Variant.Red,
  [PatchStatus.Started]: Variant.Yellow,
  [PatchStatus.Success]: Variant.Green,
};
