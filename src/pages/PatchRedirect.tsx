import { useParams, useLocation, Redirect } from "react-router-dom";
import { getVersionRoute } from "constants/routes";
import { PatchTab } from "types/patch";
import { queryString } from "utils";

const { parseQueryString } = queryString;

export const PatchRedirect = () => {
  const { id, tab } = useParams<{ id: string; tab: PatchTab }>();
  const { search } = useLocation();

  return (
    <Redirect to={getVersionRoute(id, { tab, ...parseQueryString(search) })} />
  );
};
