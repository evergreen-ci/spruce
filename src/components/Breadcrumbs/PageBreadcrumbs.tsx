import styled from "@emotion/styled";
import { useBreadcrumbAnalytics, BreadcrumbAnalytics } from "analytics";
import { getVersionRoute, getCommitsRoute } from "constants/routes";
import { size } from "constants/tokens";
import { useGetUserPatchesPageTitleAndLink } from "hooks";
import { shortenGithash } from "utils/string";
import BreadCrumbs, { Breadcrumb } from ".";

interface Props {
  taskName?: string;
  patchNumber?: number;
  versionMetadata?: {
    id: string;
    revision: string;
    project: string;
    isPatch: boolean;
    author: string;
    projectIdentifier: string;
  };
}

const PageBreadcrumbs: React.VFC<Props> = ({
  versionMetadata,
  patchNumber,
  taskName,
}) => {
  const breadcrumbAnalytics = useBreadcrumbAnalytics();
  const breadcrumbRoot = useBreadcrumbRoot(versionMetadata);
  const breadcrumbs: Breadcrumb[] = [
    breadcrumbRoot,
    getMainlineCommitOrPatchBreadcrumb(
      versionMetadata,
      patchNumber,
      breadcrumbAnalytics
    ),
  ];
  if (taskName) {
    breadcrumbs.push({
      text: taskName,
    });
  }
  return (
    <Container>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
    </Container>
  );
};

const getMainlineCommitOrPatchBreadcrumb = (
  versionMetadata: {
    id: string;
    revision: string;
    isPatch: boolean;
  },
  patchNumber: number,
  breadcrumbAnalytics: BreadcrumbAnalytics
) => {
  const { id, isPatch, revision } = versionMetadata;

  const patchBreadcrumb = {
    to: getVersionRoute(id),
    text: `Patch ${patchNumber}`,
    onClick: () => {
      breadcrumbAnalytics.sendEvent({
        name: "Click Link",
        link: "version",
      });
    },
  };

  const commitBreadcrumb = {
    to: getVersionRoute(id),
    text: shortenGithash(revision),
    onClick: () => {
      breadcrumbAnalytics.sendEvent({
        name: "Click Link",
        link: "version",
      });
    },
  };

  return isPatch ? patchBreadcrumb : commitBreadcrumb;
};

const useBreadcrumbRoot = ({
  isPatch,
  author,
  projectIdentifier,
}: {
  isPatch: boolean;
  author: string;
  projectIdentifier: string;
}) => {
  const breadcrumbAnalytics = useBreadcrumbAnalytics();

  const { title: userPatchesPageTitle, link: userPatchesPageLink } =
    useGetUserPatchesPageTitleAndLink(author, !isPatch) || {};
  return isPatch
    ? {
        text: userPatchesPageTitle,
        to: userPatchesPageLink,
        onClick: () => {
          breadcrumbAnalytics.sendEvent({
            name: "Click Link",
            link: "myPatches",
          });
        },
      }
    : {
        to: getCommitsRoute(projectIdentifier),
        text: projectIdentifier,
        onClick: () => {
          breadcrumbAnalytics.sendEvent({
            name: "Click Link",
            link: "waterfall",
          });
        },
      };
};

const Container = styled.div`
  margin-bottom: ${size.s};
`;
export default PageBreadcrumbs;
