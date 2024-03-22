import { useParams, Navigate } from "react-router-dom";
import { getUserPatchesRoute, slugs } from "constants/routes";

export const UserPatchesRedirect: React.FC = () => {
  const { [slugs.userId]: userId } = useParams();
  return <Navigate replace to={getUserPatchesRoute(userId)} />;
};
