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
import { useHistory } from "react-router-dom";
import { paths } from "constants/routes";
import { PatchStatusBadge } from "components/PatchStatusBadge";

export const Patch = () => {
  const { id } = useParams<{ id: string }>();
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

  if (activated === false) {
    router.push(`${paths.patch}/${id}/configure`);
  }
  return (
    <PageWrapper>
      {patch && <BreadCrumb patchNumber={patch.patchNumber} />}
      <PageTitle
        loading={loading}
        hasData={!!patch}
        title={description ? description : `Patch ${get(patch, "patchNumber")}`}
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
