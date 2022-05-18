import { useBreadcrumbAnalytics, BreadcrumbAnalytics } from "analytics";
import { getVersionRoute, getCommitsRoute } from "constants/routes";
import { useGetUserPatchesPageTitleAndLink } from "hooks";
import { shortenGithash } from "utils/string";
import BreadCrumbs, { BreadCrumb } from "./BreadCrumb";

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

const VersionBreadcrumb: React.VFC<Props> = ({
  versionMetadata,
  patchNumber,
  taskName,
}) => {
  const breadcrumbAnalytics = useBreadcrumbAnalytics();
  const breadcrumbRoot = useBreadcrumbRoot(versionMetadata);
  const breadcrumbs: BreadCrumb[] = [
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
  return <BreadCrumbs breadcrumbs={breadcrumbs} />;
};

const getMainlineCommitOrPatchBreadcrumb = (
  versionMetadata: {
    id: string;
    revision: string;
    project: string;
    isPatch: boolean;
    author: string;
    projectIdentifier: string;
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

export default VersionBreadcrumb;
