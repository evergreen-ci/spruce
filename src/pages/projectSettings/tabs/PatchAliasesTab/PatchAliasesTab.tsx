import { useMemo } from "react";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { BaseTab } from "../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { PatchAliasesFormState, TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.PatchAliases;

const getInitialFormState = (
  projectData: TabProps["projectData"],
  repoData: TabProps["repoData"],
): PatchAliasesFormState => {
  if (!projectData) return repoData;
  if (repoData) {
    return {
      patchAliases: {
        ...projectData.patchAliases,
        repoData: repoData.patchAliases,
      },
      patchTriggerAliases: {
        ...projectData.patchTriggerAliases,
        repoData: repoData.patchTriggerAliases,
      },
    };
  }
  return projectData;
};

export const PatchAliasesTab: React.FC<TabProps> = ({
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
