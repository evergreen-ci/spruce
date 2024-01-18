import { useMemo } from "react";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { BaseTab } from "../BaseTab";
import { ProjectType } from "../utils";
import { getFormSchema } from "./getFormSchema";
import { TabProps, VWFormState } from "./types";

const tab = ProjectSettingsTabRoutes.VirtualWorkstation;

const getInitialFormState = (
  projectData: TabProps["projectData"],
  repoData: TabProps["repoData"],
): VWFormState => {
  if (!projectData) return repoData;
  if (repoData) {
    return {
      ...projectData,
      commands: {
        ...projectData.commands,
        repoData: repoData.commands,
      },
    };
  }
  return projectData;
};

export const VirtualWorkstationTab: React.FC<TabProps> = ({
  identifier,
  projectData,
  projectType,
  repoData,
}) => {
  const initialFormState = useMemo(
    () => getInitialFormState(projectData, repoData),
    [projectData, repoData],
  );

  const formSchema = useMemo(
    () =>
      getFormSchema(
        identifier,
        projectType,
        projectType === ProjectType.AttachedProject ? repoData : null,
      ),
    [identifier, projectType, repoData],
  );

  return (
    <BaseTab
      formSchema={formSchema}
      initialFormState={initialFormState}
      tab={tab}
    />
  );
};
