import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { GET_PATCH_CONFIGURE } from "gql/queries/patch";
import {
  ConfigurePatchQuery,
  ConfigurePatchQueryVariables,
} from "gql/generated/types";
import { ConfigurePatchCore } from "pages/configurePatch/ConfigurePatchCore";
import { PatchAndTaskFullPageLoad } from "components/Loading/PatchAndTaskFullPageLoad";
import { PageWrapper } from "components/styles";
import { usePageTitle } from "hooks";
import { getVersionRoute } from "constants/routes";
import { commitQueueAlias } from "constants/patch";

export const ConfigurePatch: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data, loading, error } = useQuery<
    ConfigurePatchQuery,
    ConfigurePatchQueryVariables
  >(GET_PATCH_CONFIGURE, {
    variables: { id },
  });

  usePageTitle(`Configure Patch`);

  const router = useHistory();

  // redirect to version page if patch is on commit queue
  useEffect(() => {
    const patchAlias = data?.patch?.alias ?? null;

    if (patchAlias === commitQueueAlias) {
      router.replace(getVersionRoute(id));
    }
  }, [data, router, id]);

  return (
    <PageWrapper>
      {loading && !error && <PatchAndTaskFullPageLoad />}
      {error && !loading && <div>{error.message}</div>}
      {!error && !loading && <ConfigurePatchCore patch={data.patch} />}
    </PageWrapper>
  );
};
