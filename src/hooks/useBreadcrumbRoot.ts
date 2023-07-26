import { useBreadcrumbAnalytics } from "analytics";
import { getCommitsRoute } from "constants/routes";
import { useGetUserPatchesPageTitleAndLink } from "hooks";

export const useBreadcrumbRoot = (
  isPatch: boolean,
  author: string,
  projectIdentifier: string
) => {
  const breadcrumbAnalytics = useBreadcrumbAnalytics();

  const { link: userPatchesPageLink, title: userPatchesPageTitle } =
    useGetUserPatchesPageTitleAndLink(author, !isPatch) ?? {};

  return isPatch
    ? {
        "data-cy": "bc-my-patches",
        onClick: () => {
          breadcrumbAnalytics.sendEvent({
            link: "myPatches",
            name: "Click Link",
          });
        },
        text: userPatchesPageTitle,
        to: userPatchesPageLink,
      }
    : {
        "data-cy": "bc-waterfall",
        onClick: () => {
          breadcrumbAnalytics.sendEvent({
            link: "waterfall",
            name: "Click Link",
          });
        },
        text: projectIdentifier,
        to: getCommitsRoute(projectIdentifier),
      };
};
