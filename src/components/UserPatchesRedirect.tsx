import { getUserPatchesRoute } from "constants/routes";
import { useParams, Redirect } from "react-router-dom";

export const UserPatchesRedirect: React.VFC = () => {
  const { id } = useParams<{ id: string }>();
  return <Redirect to={getUserPatchesRoute(id)} />;
};
