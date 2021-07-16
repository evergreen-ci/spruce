import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { useParams, useLocation, Redirect } from "react-router-dom";
import { PatchAndTaskFullPageLoad } from "components/Loading/PatchAndTaskFullPageLoad";
import { commitQueueAlias } from "constants/patch";
import {
  getVersionRoute,
  getPatchRoute,
  getCommitQueueRoute,
} from "constants/routes";
import {
  IsPatchConfigurableQuery,
  IsPatchConfigurableQueryVariables,
} from "gql/generated/types";
import { GET_IS_PATCH_CONFIGURED } from "gql/queries";
import { PatchTab } from "types/patch";
import { queryString } from "utils";
import { validatePatchId } from "utils/validators";

const { parseQueryString } = queryString;

export const PatchRedirect = () => {
  const { id, tab } = useParams<{ id: string; tab: PatchTab }>();
  const { search } = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [getPatch, { data }] = useLazyQuery<
    IsPatchConfigurableQuery,
    IsPatchConfigurableQueryVariables
  >(GET_IS_PATCH_CONFIGURED, {
    variables: {
      id,
    },
    onCompleted() {
      setShouldRedirect(true);
    },
  });

  useEffect(() => {
    if (validatePatchId(id)) {
      getPatch();
    } else {
      setShouldRedirect(true);
    }
  }, [getPatch, id]);

  if (!shouldRedirect) {
    return <PatchAndTaskFullPageLoad />;
  }
  const { activated, alias, projectID } = data?.patch;
  // If we are viewing an unconfigured patch thats not on the commit queue we should be taken to the configure view
  // otherwise go to the commit queue
  if (activated === false && alias !== commitQueueAlias) {
    return <Redirect to={getPatchRoute(id, { configure: true })} />;
  }
  if (activated === false && alias === commitQueueAlias) {
    return <Redirect to={getCommitQueueRoute(projectID)} />;
  }

  return (
    <Redirect to={getVersionRoute(id, { tab, ...parseQueryString(search) })} />
  );
};
