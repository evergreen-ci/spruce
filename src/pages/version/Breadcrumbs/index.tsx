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

const VersionPageBreadcrumbs: React.VFC<VersionPageBreadcrumbsProps> = ({
  patchNumber,
  versionMetadata,
}) => {
  const { author, isPatch, projectIdentifier, revision } =
    versionMetadata ?? {};
  const breadcrumbRoot = useBreadcrumbRoot(isPatch, author, projectIdentifier);
  const breadcrumbAnalytics = useBreadcrumbAnalytics();

  const patchBreadcrumb = {
    "data-cy": "bc-patch",
    onClick: () => {
      breadcrumbAnalytics.sendEvent({
        link: "version",
        name: "Click Link",
      });
    },
    text: `Patch ${patchNumber}`,
  };

  const commitBreadcrumb = {
    "data-cy": "bc-version",
    onClick: () => {
      breadcrumbAnalytics.sendEvent({
        link: "version",
        name: "Click Link",
      });
    },
    text: shortenGithash(revision),
  };

  const breadcrumbs: Breadcrumb[] = [
    breadcrumbRoot,
    isPatch ? patchBreadcrumb : commitBreadcrumb,
  ];

  return <Breadcrumbs breadcrumbs={breadcrumbs} />;
};

export default VersionPageBreadcrumbs;
