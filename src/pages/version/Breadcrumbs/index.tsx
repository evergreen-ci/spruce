import { useBreadcrumbAnalytics } from "analytics";
import Breadcrumbs, { Breadcrumb } from "components/Breadcrumbs";
import { useBreadcrumbRoot } from "hooks";
import { shortenGithash } from "utils/string";

interface VersionPageBreadcrumbsProps {
  patchNumber?: number;
  versionMetadata?: {
    id: string;
    revision: string;
    project: string;
    isPatch: boolean;
    author: string;
    projectIdentifier: string;
    message: string;
  };
}

const VersionPageBreadcrumbs: React.FC<VersionPageBreadcrumbsProps> = ({
  patchNumber,
  versionMetadata,
}) => {
  const { author, isPatch, projectIdentifier, revision } =
    versionMetadata ?? {};
  const breadcrumbRoot = useBreadcrumbRoot(isPatch, author, projectIdentifier);
  const breadcrumbAnalytics = useBreadcrumbAnalytics();

  const patchBreadcrumb = {
    text: `Patch ${patchNumber}`,
    onClick: () => {
      breadcrumbAnalytics.sendEvent({
        name: "Click Link",
        link: "version",
      });
    },
    "data-cy": "bc-patch",
  };

  const commitBreadcrumb = {
    text: shortenGithash(revision),
    onClick: () => {
      breadcrumbAnalytics.sendEvent({
        name: "Click Link",
        link: "version",
      });
    },
    "data-cy": "bc-version",
  };

  const breadcrumbs: Breadcrumb[] = [
    breadcrumbRoot,
    isPatch ? patchBreadcrumb : commitBreadcrumb,
  ];

  return <Breadcrumbs breadcrumbs={breadcrumbs} />;
};

export default VersionPageBreadcrumbs;
