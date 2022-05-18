import { useBreadcrumbAnalytics, BreadcrumbAnalytics } from "analytics";
import { getVersionRoute, getCommitsRoute } from "constants/routes";
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
}) => {
  const breadcrumbAnalytics = useBreadcrumbAnalytics();
  const breadcrumbs: BreadCrumb[] = [
    getMainlineCommitOrPatchBreadcrumb(
      versionMetadata,
      patchNumber,
      breadcrumbAnalytics
    ),
  ];
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
  const { id, isPatch, projectIdentifier } = versionMetadata;

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
    to: getCommitsRoute(projectIdentifier),
    text: projectIdentifier,
    onClick: () => {
      breadcrumbAnalytics.sendEvent({
        name: "Click Link",
        link: "waterfall",
      });
    },
  };

  return isPatch ? patchBreadcrumb : commitBreadcrumb;
};

export default VersionBreadcrumb;
