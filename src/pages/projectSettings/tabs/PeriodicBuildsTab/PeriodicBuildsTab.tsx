import { useMemo } from "react";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { useUserTimeZone } from "hooks/useUserTimeZone";
import { BaseTab } from "../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { PeriodicBuildsFormState, TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.PeriodicBuilds;

const getInitialFormState = (
  projectData: TabProps["projectData"],
  repoData: TabProps["repoData"],
): PeriodicBuildsFormState => {
  if (!projectData) return repoData;
  if (repoData) return { ...projectData, repoData };
  return projectData;
};

export const PeriodicBuildsTab: React.FC<TabProps> = ({
  projectData,
  projectType,
  repoData,
}) => {
  const timezone = useUserTimeZone();

  const initialFormState = useMemo(
    () => getInitialFormState(projectData, repoData),
    [projectData, repoData],
  );

  const formSchema = useMemo(
    () => getFormSchema(projectType, timezone),
    [projectType, timezone],
  );

  return (
    <BaseTab
      formSchema={formSchema}
      initialFormState={initialFormState}
      tab={tab}
    />
  );
};
