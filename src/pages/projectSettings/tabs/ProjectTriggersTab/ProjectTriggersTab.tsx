import { useMemo } from "react";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { BaseTab } from "../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { ProjectTriggersFormState, TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.ProjectTriggers;

const getInitialFormState = (
  projectData: TabProps["projectData"],
  repoData: TabProps["repoData"],
): ProjectTriggersFormState => {
  if (!projectData) return repoData;
  if (repoData) return { ...projectData, repoData };
  return projectData;
};

export const ProjectTriggersTab: React.FC<TabProps> = ({
  projectData,
  projectType,
  repoData,
}) => {
  const initialFormState = useMemo(
    () => getInitialFormState(projectData, repoData),
    [projectData, repoData],
  );

  const formSchema = useMemo(() => getFormSchema(projectType), [projectType]);

  return (
    <BaseTab
      formSchema={formSchema}
      initialFormState={initialFormState}
      tab={tab}
    />
  );
};
