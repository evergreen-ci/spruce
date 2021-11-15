import React from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Breadcrumb } from "antd";
import { useBreadcrumbAnalytics, BreadcrumbAnalytics } from "analytics";
import { StyledRouterLink } from "components/styles";
import { H3, P1 } from "components/Typography";
import { getVersionRoute, getCommitsRoute } from "constants/routes";
import { useGetUserPatchesPageTitleAndLink } from "hooks";

const { blue } = uiColors;

interface Props {
  taskName?: string;
  patchNumber?: number;
  author?: string;
  versionMetadata?: {
    id: string;
    revision: string;
    project: string;
    isPatch: boolean;
    author: string;
  };
}

export const BreadCrumb: React.FC<Props> = ({
  taskName,
  patchNumber,
  versionMetadata,
}) => {
  const { isPatch, author } = versionMetadata || {};
  const breadcrumbAnalytics = useBreadcrumbAnalytics();

  return (
    <StyledBreadcrumb>
      {isPatch ? (
        <PatchBreadcrumb
          patchAuthor={author}
          analytics={breadcrumbAnalytics}
          patchNumber={patchNumber}
          isTask={!!taskName}
          versionId={versionMetadata.id}
        />
      ) : (
        <VersionBreadcrumb
          versionMetadata={versionMetadata}
          analytics={breadcrumbAnalytics}
          isTask={!!taskName}
        />
      )}

      {taskName && (
        <Breadcrumb.Item>
          <H3 data-cy="bc-task">{taskName}</H3>
        </Breadcrumb.Item>
      )}
    </StyledBreadcrumb>
  );
};

interface PatchBreadcrumbProps {
  patchAuthor: string;
  analytics: ReturnType<typeof useBreadcrumbAnalytics>;
  versionId: string;
  patchNumber?: number;
  isTask: boolean;
}
const PatchBreadcrumb: React.FC<PatchBreadcrumbProps> = ({
  patchAuthor,
  analytics,
  versionId,
  isTask,
  patchNumber,
}) => {
  const {
    title: userPatchesPageTitle,
    link: userPatchesPageLink,
  } = useGetUserPatchesPageTitleAndLink(patchAuthor);
  const patch = `Patch ${patchNumber}`;

  return (
    <>
      <Breadcrumb.Item>
        <StyledP1>
          <StyledBreadcrumbLink
            data-cy="bc-my-patches"
            to={userPatchesPageLink}
            onClick={() =>
              analytics.sendEvent({
                name: "Click Link",
                link: "myPatches",
              })
            }
          >
            {userPatchesPageTitle}
          </StyledBreadcrumbLink>
        </StyledP1>
      </Breadcrumb.Item>
      {isTask ? (
        <Breadcrumb.Item>
          <StyledBreadcrumbLink
            data-cy="bc-patch"
            to={getVersionRoute(versionId)}
            onClick={() =>
              analytics.sendEvent({
                name: "Click Link",
                link: "patch",
              })
            }
          >
            {patch}
          </StyledBreadcrumbLink>
        </Breadcrumb.Item>
      ) : (
        <Breadcrumb.Item>
          <H3 data-cy="bc-patch">{patch}</H3>
        </Breadcrumb.Item>
      )}
    </>
  );
};

interface VersionBreadcrumbProps {
  versionMetadata: {
    id: string;
    revision: string;
    project: string;
  };
  isTask: boolean;
  analytics: BreadcrumbAnalytics;
}
const VersionBreadcrumb: React.FC<VersionBreadcrumbProps> = ({
  versionMetadata,
  analytics,
  isTask,
}) => {
  const { project, revision, id } = versionMetadata;
  // We need to case on revision since periodic builds do not have a revision
  const breadcrumbText = revision.length
    ? revision.substring(0, 7)
    : id.substring(0, 7);
  return (
    <>
      <Breadcrumb.Item>
        <StyledP1>
          <StyledBreadcrumbLink
            data-cy="bc-waterfall"
            to={getCommitsRoute(project)}
            onClick={() =>
              analytics.sendEvent({
                name: "Click Link",
                link: "waterfall",
              })
            }
          >
            {project}
          </StyledBreadcrumbLink>
        </StyledP1>
      </Breadcrumb.Item>
      {isTask ? (
        <Breadcrumb.Item>
          <StyledP1>
            <StyledBreadcrumbLink
              data-cy="bc-version"
              to={getVersionRoute(id)}
              onClick={() =>
                analytics.sendEvent({
                  name: "Click Link",
                  link: "version",
                })
              }
            >
              {breadcrumbText}
            </StyledBreadcrumbLink>
          </StyledP1>
        </Breadcrumb.Item>
      ) : (
        <Breadcrumb.Item>
          <H3 data-cy="bc-version"> {breadcrumbText}</H3>
        </Breadcrumb.Item>
      )}
    </>
  );
};

const StyledP1 = styled(P1)`
  display: inline-flex;
`;

const StyledBreadcrumb = styled(Breadcrumb)`
  margin-bottom: 16px;
`;

const StyledBreadcrumbLink = styled(StyledRouterLink)`
  color: ${blue.base} !important;
`;
