import { useParams, Navigate } from "react-router-dom";
import { getUserPatchesRoute } from "constants/routes";

export const UserPatchesRedirect: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return <Navigate replace to={getUserPatchesRoute(id)} />;
};
