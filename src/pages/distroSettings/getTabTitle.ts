import { DistroSettingsTabRoutes } from "constants/routes";

export const getTabTitle = (tab: DistroSettingsTabRoutes): { title: string } =>
  ({
    [DistroSettingsTabRoutes.General]: { title: "General Settings" },
    [DistroSettingsTabRoutes.Provider]: { title: "Provider Settings" },
    [DistroSettingsTabRoutes.Task]: { title: "Task Settings" },
    [DistroSettingsTabRoutes.Host]: { title: "Host Settings" },
    [DistroSettingsTabRoutes.Project]: { title: "Project Settings" },
    [DistroSettingsTabRoutes.EventLog]: { title: "Event Log" },
  })[tab];
