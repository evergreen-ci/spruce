import React from "react";
import { useQuery } from "@apollo/client";
import { useParams, Redirect } from "react-router-dom";
import { PatchAndTaskFullPageLoad } from "components/Loading/PatchAndTaskFullPageLoad";
import { PageWrapper } from "components/styles";
import { commitQueueAlias } from "constants/patch";
import { getVersionRoute } from "constants/routes";
import { useToastContext } from "context/toast";
import {
  ConfigurePatchQuery,
  ConfigurePatchQueryVariables,
} from "gql/generated/types";
import { GET_PATCH_CONFIGURE } from "gql/queries";
import { usePageTitle } from "hooks";
import { PageDoesNotExist } from "pages/404";
import { ConfigurePatchCore } from "pages/configurePatch/ConfigurePatchCore";
import { validateObjectId } from "utils/validators";

export const ConfigurePatch: React.VFC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatchToast = useToastContext();
  const { data, loading, error } = useQuery<
    ConfigurePatchQuery,
    ConfigurePatchQueryVariables
  >(GET_PATCH_CONFIGURE, {
    variables: { id },
    onError(err) {
      dispatchToast.error(err.message);
    },
  });

  const { patch } = data || {};
  usePageTitle(`Configure Patch`);

  // Can't configure a mainline version so should redirect to the version page
  if (!validateObjectId(id)) {
    return <Redirect to={getVersionRoute(id)} />;
  }

  if (loading) {
    return <PatchAndTaskFullPageLoad />;
  }
  if (error) {
    return <PageDoesNotExist />;
  }

  if (patch.alias === commitQueueAlias) {
    return <Redirect to={getVersionRoute(id)} />;
  }

  return (
    <PageWrapper>
      <ConfigurePatchCore patch={patch} />
    </PageWrapper>
  );
};
