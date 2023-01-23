import { useParams, Navigate } from "react-router-dom";
import { getUserPatchesRoute } from "constants/routes";

export const UserPatchesRedirect: React.VFC = () => {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={getUserPatchesRoute(id)} />;
};
