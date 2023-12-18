import { Navigate } from "react-router-dom";
import {
  getDistroSettingsRoute,
  DistroSettingsTabRoutes,
} from "constants/routes";
import { useFirstDistro } from "hooks";

export const DistroSettingsRedirect: React.FC = () => {
  const { distro, loading } = useFirstDistro();

  if (loading) {
    return null;
  }
  return (
    <Navigate
      to={getDistroSettingsRoute(distro, DistroSettingsTabRoutes.General)}
    />
  );
};
