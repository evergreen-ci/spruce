import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { useParams, Redirect } from "react-router-dom";
import { BreadCrumb } from "components/Breadcrumb";
import { PatchAndTaskFullPageLoad } from "components/Loading/PatchAndTaskFullPageLoad";
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
import { getCommitQueueRoute, getPatchRoute } from "constants/routes";
import { useToastContext } from "context/toast";
import {
  VersionQuery,
  VersionQueryVariables,
  IsPatchConfigurableQuery,
  IsPatchConfigurableQueryVariables,
} from "gql/generated/types";
import { GET_VERSION, GET_IS_PATCH_CONFIGURED } from "gql/queries";
import { usePageTitle, useNetworkStatus } from "hooks";
import { PageDoesNotExist } from "pages/404";
import { validatePatchId } from "utils/validators";
import { BuildVariants } from "./version/BuildVariants";
import { ActionButtons } from "./version/index";
import { Metadata } from "./version/Metadata";
import { PatchTabs } from "./version/PatchTabs";

export const VersionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const dispatchToast = useToastContext();

  const [redirectURL, setRedirectURL] = useState(undefined);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [getPatch, { data: patchData }] = useLazyQuery<
    IsPatchConfigurableQuery,
    IsPatchConfigurableQueryVariables
  >(GET_IS_PATCH_CONFIGURED, {
    variables: {
      id,
    },
  });

  const [getVersion, { data, error, startPolling, stopPolling }] = useLazyQuery<
    VersionQuery,
    VersionQueryVariables
  >(GET_VERSION, {
    variables: { id },
    pollInterval,
    onError: (e) =>
      dispatchToast.error(
        `There was an error loading the version: ${e.message}`
      ),
    onCompleted() {
      setIsLoadingData(false);
    },
  });

  useNetworkStatus(startPolling, stopPolling);

  // If we are viewing a patch we should first check if its configured before trying to check
  // for a version
  useEffect(() => {
    if (validatePatchId(id)) {
      getPatch();
    } else {
      getVersion();
    }
  }, [getPatch, getVersion, id]);

  // If we are viewing an unconfigured patch thats not on the commit queue we should be taken to the configure view
  // otherwise go to the commit queue
  useEffect(() => {
    if (patchData) {
      const { patch } = patchData;
      const { activated, alias, projectID } = patch;
      if (!activated && alias !== commitQueueAlias) {
        setRedirectURL(getPatchRoute(id, { configure: true }));
        setIsLoadingData(false);
      } else if (!activated && alias === commitQueueAlias) {
        setRedirectURL(getCommitQueueRoute(projectID));
        setIsLoadingData(false);
      } else {
        getVersion();
      }
    }
  }, [patchData, getVersion, id]);

  const { version } = data || {};
  const { status, patch, isPatch, revision, author, message, order } =
    version || {};

  const {
    commitQueuePosition,
    patchNumber,
    canEnqueueToCommitQueue,
    childPatches,
  } = patch || {};
  const isPatchOnCommitQueue = commitQueuePosition !== null;

  const title = isPatch
    ? `Patch - ${patchNumber}`
    : `Version - ${revision?.substr(0, 6)}`;
  usePageTitle(title);

  if (isLoadingData) {
    return <PatchAndTaskFullPageLoad />;
  }

  if (redirectURL) {
    return <Redirect to={redirectURL} />;
  }
  if (error) {
    return <PageDoesNotExist />;
  }

  return (
    <PageWrapper data-cy="version-page">
      <BreadCrumb patchAuthor={author} patchNumber={patchNumber} />
      <PageTitle
        loading={false}
        hasData
        title={message || `Version ${order}`}
        badge={<PatchStatusBadge status={status} />}
        buttons={
          <ActionButtons
            canEnqueueToCommitQueue={canEnqueueToCommitQueue}
            isPatchOnCommitQueue={isPatchOnCommitQueue}
            patchDescription={message}
            patchId={id}
            childPatches={childPatches}
          />
        }
      />
      <PageLayout>
        <PageSider>
          <Metadata loading={false} version={version} />
          <BuildVariants />
        </PageSider>
        <PageLayout>
          <PageContent>
            <PatchTabs
              taskCount={version?.taskCount}
              childPatches={childPatches}
              isPatch={version.isPatch}
            />
          </PageContent>
        </PageLayout>
      </PageLayout>
    </PageWrapper>
  );
};
