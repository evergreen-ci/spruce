import { useParams, Redirect } from "react-router-dom";
import { getUserPatchesRoute } from "constants/routes";

export const UserPatchesRedirect: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return <Redirect to={getUserPatchesRoute(id)} />;
};
