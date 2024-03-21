import { useParams, Navigate } from "react-router-dom";
import { getCommitsRoute, slugs } from "constants/routes";

export const WaterfallCommitsRedirect: React.FC = () => {
  const { [slugs.projectIdentifier]: projectIdentifier } = useParams();
  return <Navigate to={getCommitsRoute(projectIdentifier)} />;
};
