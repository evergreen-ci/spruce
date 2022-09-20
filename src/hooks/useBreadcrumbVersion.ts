import { useBreadcrumbAnalytics } from "analytics";
import { getVersionRoute } from "constants/routes";
import { shortenGithash } from "utils/string";

export const useBreadcrumbVersion = (
  versionMetadata: {
    id: string;
    revision: string;
    isPatch: boolean;
  },
  patchNumber: number
) => {
  const breadcrumbAnalytics = useBreadcrumbAnalytics();

  const { id, isPatch, revision } = versionMetadata ?? {};

  const patchBreadcrumb = {
    to: getVersionRoute(id),
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
    to: getVersionRoute(id),
    text: shortenGithash(revision),
    onClick: () => {
      breadcrumbAnalytics.sendEvent({
        name: "Click Link",
        link: "version",
      });
    },
    "data-cy": "bc-version",
  };

  return isPatch ? patchBreadcrumb : commitBreadcrumb;
};
