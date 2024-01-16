import { useState, useEffect } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useParams, Navigate } from "react-router-dom";
import { ProjectBanner } from "components/Banners";
import { PatchAndTaskFullPageLoad } from "components/Loading/PatchAndTaskFullPageLoad";
import { PageTitle } from "components/PageTitle";
import { PatchStatusBadge } from "components/PatchStatusBadge";
import {
  PageWrapper,
  PageContent,
  PageLayout,
  PageSider,
} from "components/styles";
import { commitQueueAlias } from "constants/patch";
import { getCommitQueueRoute, getPatchRoute } from "constants/routes";
import { useToastContext } from "context/toast";
import {
  VersionQuery,
  VersionQueryVariables,
  IsPatchConfiguredQuery,
  IsPatchConfiguredQueryVariables,
  HasVersionQuery,
  HasVersionQueryVariables,
} from "gql/generated/types";
import { VERSION, IS_PATCH_CONFIGURED, HAS_VERSION } from "gql/queries";
import { useSpruceConfig } from "hooks";
import { PageDoesNotExist } from "pages/NotFound";
import { isPatchUnconfigured } from "utils/patch";
import { shortenGithash, githubPRLinkify } from "utils/string";
import { jiraLinkify } from "utils/string/jiraLinkify";
import { WarningBanner, ErrorBanner, IgnoredBanner } from "./version/Banners";
import VersionPageBreadcrumbs from "./version/Breadcrumbs";
import BuildVariantCard from "./version/BuildVariantCard";
import { ActionButtons, Metadata, VersionTabs } from "./version/index";
import { NameChangeModal } from "./version/NameChangeModal";

// IMPORTANT: If you make any changes to the state logic in this file, please make sure to update the ADR:
// docs/decisions/2023-12-13_version_page_logic.md
export const VersionPage: React.FC = () => {
  const spruceConfig = useSpruceConfig();
  const { id } = useParams<{ id: string }>();
  const dispatchToast = useToastContext();

  const [redirectURL, setRedirectURL] = useState(undefined);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // This query is used to fetch the version data.
  const [getVersion, { data: versionData, error: versionError }] = useLazyQuery<
    VersionQuery,
    VersionQueryVariables
  >(VERSION, {
    variables: { id },
    fetchPolicy: "cache-and-network",
    onError: (error) => {
      dispatchToast.error(
        `There was an error loading the version: ${error.message}`,
      );
      setIsLoadingData(false);
    },
  });

  // If the version is a patch, we need to check if it's been configured.
  const [getPatch, { data: patchData, error: patchError }] = useLazyQuery<
    IsPatchConfiguredQuery,
    IsPatchConfiguredQueryVariables
  >(IS_PATCH_CONFIGURED, {
    variables: { id },
    onError: (error) => {
      dispatchToast.error(
        `There was an error loading this patch: ${error.message}`,
      );
      setIsLoadingData(false);
    },
  });

  // This query checks if the provided id has a configured version.
  const { error: hasVersionError } = useQuery<
    HasVersionQuery,
    HasVersionQueryVariables
  >(HAS_VERSION, {
    variables: { id },
    onCompleted: ({ hasVersion }) => {
      setIsLoadingData(true);
      if (hasVersion) {
        getVersion({ variables: { id } });
      } else {
        getPatch({ variables: { id } });
      }
    },
    onError: (error) => {
      dispatchToast.error(error.message);
      setIsLoadingData(false);
    },
  });

  // Decide where to redirect the user based off of whether or not the patch has been activated.
  // If the patch is activated and not on the commit queue, we can safely fetch the associated version.
  useEffect(() => {
    if (patchData) {
      const { patch } = patchData;
      const { activated, alias, projectID } = patch;
      if (isPatchUnconfigured({ alias, activated })) {
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

  // If we have successfully loaded a version, we can show the page.
  useEffect(() => {
    if (versionData) {
      setIsLoadingData(false);
    }
  }, [versionData]);

  if (isLoadingData) {
    return <PatchAndTaskFullPageLoad />;
  }

  if (hasVersionError || patchError || versionError) {
    return (
      <PageWrapper data-cy="version-page">
        <PageDoesNotExist />
      </PageWrapper>
    );
  }

  // If it's a patch, redirect to the proper page.
  if (redirectURL) {
    return <Navigate replace to={redirectURL} />;
  }

  // If it's a version, proceed with loading the version page.
  const { version } = versionData || {};
  const {
    errors,
    ignored,
    isPatch,
    message,
    order,
    patch,
    projectIdentifier,
    revision,
    status,
    warnings,
  } = version || {};
  const {
    canEnqueueToCommitQueue,
    childPatches,
    commitQueuePosition = null,
    patchNumber,
  } = patch || {};
  const isPatchOnCommitQueue = commitQueuePosition !== null;

  const versionText = shortenGithash(revision || id);
  const pageTitle = isPatch
    ? `Patch - ${patchNumber}`
    : `Version - ${versionText}`;

  const linkifiedMessage = jiraLinkify(
    githubPRLinkify(message),
    spruceConfig?.jira?.host,
  );

  return (
    <PageWrapper data-cy="version-page">
      <ProjectBanner projectIdentifier={projectIdentifier} />
      {errors && errors.length > 0 && <ErrorBanner errors={errors} />}
      {warnings && warnings.length > 0 && <WarningBanner warnings={warnings} />}
      {ignored && <IgnoredBanner />}
      {version && (
        <VersionPageBreadcrumbs
          patchNumber={patchNumber}
          versionMetadata={version}
        />
      )}
      <PageTitle
        badge={<PatchStatusBadge status={status} />}
        buttons={
          <ActionButtons
            canEnqueueToCommitQueue={canEnqueueToCommitQueue}
            canReconfigure={!isPatchOnCommitQueue && isPatch}
            isPatch={isPatch}
            isPatchOnCommitQueue={isPatchOnCommitQueue}
            patchDescription={message}
            versionId={id}
          />
        }
        loading={false}
        pageTitle={pageTitle}
        title={linkifiedMessage || `Version ${order}`}
      >
        {isPatch && (
          <NameChangeModal patchId={id} originalPatchName={message} />
        )}
      </PageTitle>
      <PageLayout hasSider>
        <PageSider>
          <Metadata loading={false} version={version} />
          <BuildVariantCard />
        </PageSider>
        <PageLayout>
          <PageContent>
            <VersionTabs
              childPatches={childPatches}
              isPatch={version?.isPatch}
              taskCount={version?.taskCount}
            />
          </PageContent>
        </PageLayout>
      </PageLayout>
    </PageWrapper>
  );
};
