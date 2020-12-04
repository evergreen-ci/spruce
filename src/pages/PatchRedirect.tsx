import { useParams, useLocation, useHistory } from "react-router-dom";
import { paths } from "constants/routes";

export const PatchRedirect = () => {
  const { id, tab } = useParams<{ id: string; tab: string }>();
  const { search } = useLocation();
  const router = useHistory();
  router.replace(`${paths.version}/${id}${tab ? `/${tab}` : ""}${search}`);
  return null;
};
