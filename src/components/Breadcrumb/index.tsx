import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Breadcrumb } from "antd";
import { useBreadcrumbAnalytics, BreadcrumbAnalytics } from "analytics";
import { StyledRouterLink } from "components/styles";
import { H3, P1 } from "components/Typography";
import {
  getVersionRoute,
  getCommitsRoute,
  getProjectPatchesRoute,
} from "constants/routes";
import { size } from "constants/tokens";
import { useGetUserPatchesPageTitleAndLink } from "hooks";
import { isBeta } from "utils/environmentalVariables";
import { shortenGithash } from "utils/string";

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
    projectIdentifier: string;
  };
}

export const BreadCrumb: React.VFC<Props> = ({
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
const PatchBreadcrumb: React.VFC<PatchBreadcrumbProps> = ({
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
    projectIdentifier: string;
  };
  isTask: boolean;
  analytics: BreadcrumbAnalytics;
}
const VersionBreadcrumb: React.VFC<VersionBreadcrumbProps> = ({
  versionMetadata,
  analytics,
  isTask,
}) => {
  const { projectIdentifier, revision, id } = versionMetadata;
  // We need to case on revision since periodic builds do not have a revision
  const breadcrumbText = shortenGithash(revision.length ? revision : id);
  return (
    <>
      <Breadcrumb.Item>
        <StyledP1>
          {isBeta() ? (
            <StyledBreadcrumbLink
              data-cy="bc-waterfall"
              to={getCommitsRoute(projectIdentifier)}
              onClick={() =>
                analytics.sendEvent({
                  name: "Click Link",
                  link: "waterfall",
                })
              }
            >
              {projectIdentifier}
            </StyledBreadcrumbLink>
          ) : (
            <StyledBreadcrumbLink
              data-cy="bc-my-patches"
              to={getProjectPatchesRoute(projectIdentifier)}
              onClick={() =>
                analytics.sendEvent({
                  name: "Click Link",
                  link: "myPatches",
                })
              }
            >
              {projectIdentifier}&apos;s patches
            </StyledBreadcrumbLink>
          )}
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
  margin-bottom: ${size.s};
`;

const StyledBreadcrumbLink = styled(StyledRouterLink)`
  color: ${blue.base} !important;
`;
