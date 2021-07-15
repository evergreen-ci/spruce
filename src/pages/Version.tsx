import React from "react";
import { useQuery } from "@apollo/client";
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
import { getPatchRoute } from "constants/routes";
import { useToastContext } from "context/toast";
import { VersionQuery, VersionQueryVariables } from "gql/generated/types";
import { GET_VERSION } from "gql/queries";
import { usePageTitle, useNetworkStatus } from "hooks";
import { PageDoesNotExist } from "pages/404";
import { BuildVariants } from "./version/BuildVariants";
import { ActionButtons } from "./version/index";
import { Metadata } from "./version/Metadata";
import { PatchTabs } from "./version/PatchTabs";

export const VersionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const dispatchToast = useToastContext();

  const { data, loading, error, startPolling, stopPolling } = useQuery<
    VersionQuery,
    VersionQueryVariables
  >(GET_VERSION, {
    variables: { id },
    pollInterval,
    onError: (e) =>
      dispatchToast.error(`There was an error loading the patch: ${e.message}`),
  });

  useNetworkStatus(startPolling, stopPolling);

  const { version } = data || {};
  const {
    status,
    activated,
    patch,
    isPatch,
    revision,
    author,
    message,
    order,
  } = version || {};

  const { commitQueuePosition, patchNumber, alias, canEnqueueToCommitQueue } =
    patch || {};
  const isPatchOnCommitQueue = commitQueuePosition !== null;

  const title = isPatch
    ? `Patch - ${patchNumber}`
    : `Version - ${revision?.substr(6)}`;
  usePageTitle(title);

  if (loading) {
    return <PatchAndTaskFullPageLoad />;
  }

  if (activated === false && alias !== commitQueueAlias && isPatch) {
    return <Redirect to={getPatchRoute(id, { configure: true })} />;
  }
  if (error) {
    return <PageDoesNotExist />;
  }

  return (
    <PageWrapper data-cy="version-page">
      {version && <BreadCrumb patchAuthor={author} patchNumber={patchNumber} />}
      <PageTitle
        loading={loading}
        hasData={!!version}
        title={message || `Version ${order}`}
        badge={<PatchStatusBadge status={status} />}
        buttons={
          <ActionButtons
            canEnqueueToCommitQueue={canEnqueueToCommitQueue}
            isPatchOnCommitQueue={isPatchOnCommitQueue}
            patchDescription={message}
            patchId={id}
          />
        }
      />
      <PageLayout>
        <PageSider>
          <Metadata loading={loading} version={version} />
          <BuildVariants />
        </PageSider>
        <PageLayout>
          <PageContent>
            <PatchTabs
              taskCount={version?.taskCount}
              childPatches={null}
              isPatch={version.isPatch}
            />
          </PageContent>
        </PageLayout>
      </PageLayout>
    </PageWrapper>
  );
};
