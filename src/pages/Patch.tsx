import React from "react";
import { useParams } from "react-router-dom";
import { BreadCrumb } from "components/Breadcrumb";
import { PageTitle } from "components/PageTitle";
import {
  PageWrapper,
  PageContent,
  PageLayout,
  PageSider
} from "components/styles";
import { useQuery } from "@apollo/react-hooks";
import { GET_PATCH, PatchQuery } from "gql/queries/patch";
import { PatchTabs } from "pages/patch/PatchTabs";
import { BuildVariants } from "pages/patch/BuildVariants";
import get from "lodash/get";
import { Metadata } from "pages/patch/Metadata";
import Badge, { Variant } from "@leafygreen-ui/badge";
import { PatchStatus } from "gql/queries/get-patch-tasks";

export const Patch = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error, stopPolling } = useQuery<PatchQuery>(GET_PATCH, {
    variables: { id: id },
    pollInterval: 500
  });
  const patch = get(data, "patch");
  const status = get(patch, "status");
  const description = get(patch, "description");
  if(status === PatchStatus.Failed || status === PatchStatus.Success) {
    stopPolling();
  }
  return (
    <PageWrapper>
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

const mapPatchStatusToBadgeVariant = {
  [PatchStatus.Created]: Variant.LightGray,
  [PatchStatus.Failed]: Variant.Red,
  [PatchStatus.Started]: Variant.Yellow,
  [PatchStatus.Success]: Variant.Green
};
