import { useBreadcrumbAnalytics } from "analytics";
import { getCommitsRoute } from "constants/routes";
import { useGetUserPatchesPageTitleAndLink } from "hooks";

export const useBreadcrumbRoot = (
  isPatch: boolean,
  author: string,
  projectIdentifier: string,
) => {
  const breadcrumbAnalytics = useBreadcrumbAnalytics();

  const { link: userPatchesPageLink, title: userPatchesPageTitle } =
    useGetUserPatchesPageTitleAndLink(author, !isPatch) ?? {};

  return isPatch
    ? {
        to: userPatchesPageLink,
        text: userPatchesPageTitle,
        onClick: () => {
          breadcrumbAnalytics.sendEvent({
            name: "Click Link",
            link: "myPatches",
          });
        },
        "data-cy": "bc-my-patches",
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
        "data-cy": "bc-waterfall",
      };
};
