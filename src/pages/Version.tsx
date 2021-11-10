import { useState, useEffect } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
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
  IsPatchConfiguredQuery,
  IsPatchConfiguredQueryVariables,
  GetSpruceConfigQuery,
} from "gql/generated/types";
import {
  GET_VERSION,
  GET_IS_PATCH_CONFIGURED,
  GET_SPRUCE_CONFIG,
} from "gql/queries";
import { usePageTitle, useNetworkStatus } from "hooks";
import { PageDoesNotExist } from "pages/404";
import { githubPRLinkify } from "utils/string";
import { jiraLinkify } from "utils/string/jiraLinkify";
import { validateObjectId } from "utils/validators";
import { BuildVariants } from "./version/BuildVariants";
import { ActionButtons } from "./version/index";
import { Metadata } from "./version/Metadata";
import { Tabs } from "./version/Tabs";

export const VersionPage: React.FC = () => {
  const { data: spruceConfigData } = useQuery<GetSpruceConfigQuery>(
    GET_SPRUCE_CONFIG
  );
  const { id } = useParams<{ id: string }>();

  const dispatchToast = useToastContext();

  const [redirectURL, setRedirectURL] = useState(undefined);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [getPatch, { data: patchData }] = useLazyQuery<
    IsPatchConfiguredQuery,
    IsPatchConfiguredQueryVariables
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
  });

  useNetworkStatus(startPolling, stopPolling);

  // First check if an id belongs to a patch if so we should fetch the patch,
  //  to see if it has been activated and has a version; otherwise fetch the version directly
  useEffect(() => {
    if (validateObjectId(id)) {
      getPatch();
    } else {
      getVersion();
    }
  }, [getPatch, getVersion, id]);

  // Decide where to redirect the user based off of whether or not the patch has been activated
  // If this patch is activated and not on the commit queue we can safely fetch the associated version
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

  // If we have successfully loaded a version we can show the page
  useEffect(() => {
    if (data) {
      setIsLoadingData(false);
    }
  }, [data]);

  const { version } = data || {};
  const { status, patch, isPatch, revision, message, order } = version || {};

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

  const linkifiedMessage = jiraLinkify(
    githubPRLinkify(message),
    spruceConfigData?.spruceConfig?.jira?.host
  );
  return (
    <PageWrapper data-cy="version-page">
      <BreadCrumb versionMetadata={version} patchNumber={patchNumber} />
      <PageTitle
        loading={false}
        hasData
        title={linkifiedMessage || `Version ${order}`}
        badge={<PatchStatusBadge status={status} />}
        buttons={
          <ActionButtons
            canEnqueueToCommitQueue={canEnqueueToCommitQueue}
            isPatchOnCommitQueue={isPatchOnCommitQueue}
            canReconfigure={!isPatchOnCommitQueue && isPatch}
            patchDescription={message}
            versionId={id}
            childPatches={childPatches}
            isPatch={isPatch}
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
            <Tabs
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
