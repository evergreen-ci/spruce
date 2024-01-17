import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import { INCLUDE_HIDDEN_PATCHES } from "constants/cookies";
import { PatchesInput } from "gql/generated/types";
import { useQueryParam } from "hooks/useQueryParam";
import { PatchPageQueryParams, ALL_PATCH_STATUS } from "types/patch";
import { getLimitFromSearch, getPageFromSearch } from "utils/url";

/**
 * usePatchesQueryParams is used alongside the Patches Page to transform URL state
 * to the input value to the patches field for the User and Project GQL type.
 * @returns - An object with all input values for the patches field except includeCommitQueue
 * and onlyCommitQueue
 */
export const usePatchesQueryParams = (): Omit<
  Required<PatchesInput>,
  "includeCommitQueue" | "onlyCommitQueue"
> => {
  const { search } = useLocation();
  const [patchName] = useQueryParam<string>(PatchPageQueryParams.PatchName, "");
  const [rawStatuses] = useQueryParam<string[]>(
    PatchPageQueryParams.Statuses,
    [],
  );
  const [hidden] = useQueryParam(PatchPageQueryParams.Hidden, false);
  const statuses = rawStatuses.filter((v) => v && v !== ALL_PATCH_STATUS);
  return {
    limit: getLimitFromSearch(search),
    includeHidden: hidden || Cookies.get(INCLUDE_HIDDEN_PATCHES) === "true",
    page: getPageFromSearch(search),
    patchName: `${patchName}`,
    statuses,
  };
};
