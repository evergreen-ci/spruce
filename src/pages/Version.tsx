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
  GetIsPatchOrVersionQuery,
  GetIsPatchOrVersionQueryVariables,
  PatchOrVersionType,
} from "gql/generated/types";
import {
  GET_VERSION,
  GET_IS_PATCH_CONFIGURED,
  GET_SPRUCE_CONFIG,
  GET_IS_PATCH_OR_VERSION,
} from "gql/queries";
import { usePageTitle, useNetworkStatus } from "hooks";
import { PageDoesNotExist } from "pages/404";
import { errorReporting } from "utils";
import { githubPRLinkify } from "utils/string";
import { jiraLinkify } from "utils/string/jiraLinkify";
import { BuildVariants } from "./version/BuildVariants";
import { ActionButtons } from "./version/index";
import { Metadata } from "./version/Metadata";
import { Tabs } from "./version/Tabs";

const { reportError } = errorReporting;

export const VersionPage: React.FC = () => {
  const { data: spruceConfigData } = useQuery<GetSpruceConfigQuery>(
    GET_SPRUCE_CONFIG
  );
  const { id } = useParams<{ id: string }>();

  const dispatchToast = useToastContext();

  const [redirectURL, setRedirectURL] = useState(undefined);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const { error: isPatchOrVersionError } = useQuery<
    GetIsPatchOrVersionQuery,
    GetIsPatchOrVersionQueryVariables
  >(GET_IS_PATCH_OR_VERSION, {
    variables: {
      id,
    },
    onCompleted: (data) => {
      switch (data.isPatchOrVersion) {
        case PatchOrVersionType.Patch:
          getPatch({ variables: { id } });

          break;
        case PatchOrVersionType.Version:
          getVersion({ variables: { id } });
          break;
        default: {
          // This should never happen but we need to handle it just in case
          const err = new Error(
            `Received an unexpected response from isPatchOrVersion: ${data.isPatchOrVersion}`
          );
          dispatchToast.error(err.message);
          reportError(err).severe();
          break;
        }
      }
    },
    onError: (error) => {
      dispatchToast.error(error.message);
      setIsLoadingData(false);
    },
  });

  // This resets the pages states to force showing the loading state when the page is changed on navigation
  useEffect(() => {
    setIsLoadingData(true);
    setRedirectURL(undefined);
  }, [id]);

  const [getPatch, { data: patchData, error: patchError }] = useLazyQuery<
    IsPatchConfiguredQuery,
    IsPatchConfiguredQueryVariables
  >(GET_IS_PATCH_CONFIGURED, {
    variables: {
      id,
    },
    onError: (error) => {
      dispatchToast.error(
        `There was an error loading this patch: ${error.message}`
      );
      setIsLoadingData(false);
    },
  });

  const [
    getVersion,
    { data, error: versionError, startPolling, stopPolling },
  ] = useLazyQuery<VersionQuery, VersionQueryVariables>(GET_VERSION, {
    variables: { id },
    pollInterval,
    onError: (e) => {
      dispatchToast.error(
        `There was an error loading the version: ${e.message}`
      );
      setIsLoadingData(false);
    },
  });

  useNetworkStatus(startPolling, stopPolling);

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
        getVersion({ variables: { id } });
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

  // If a revision exists
  const versionText = revision?.length
    ? revision?.substring(0, 7)
    : id.substring(0, 7);
  const title = isPatch ? `Patch - ${patchNumber}` : `Version - ${versionText}`;
  usePageTitle(title);

  if (isLoadingData) {
    return <PatchAndTaskFullPageLoad />;
  }

  if (redirectURL) {
    return <Redirect to={redirectURL} />;
  }

  if (isPatchOrVersionError || patchError || versionError) {
    return (
      <PageWrapper data-cy="version-page">
        <PageDoesNotExist />
      </PageWrapper>
    );
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
