import { useParams, Navigate } from "react-router-dom";
import { getCommitsRoute } from "constants/routes";

export const WaterfallCommitsRedirect: React.FC = () => {
  const { projectIdentifier } = useParams<{ projectIdentifier: string }>();
  return <Navigate to={getCommitsRoute(projectIdentifier)} />;
};
