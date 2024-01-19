import { useMemo } from "react";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { BaseTab } from "../BaseTab";
import { ProjectType } from "../utils";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.Access;

export const AccessTab: React.FC<TabProps> = ({
  projectData,
  projectType,
  repoData,
}) => {
  const initialFormState = projectData || repoData;

  const formSchema = useMemo(
    () =>
      getFormSchema(
        projectType,
        projectType === ProjectType.AttachedProject ? repoData : null,
      ),
    [projectType, repoData],
  );

  return (
    <BaseTab
      formSchema={formSchema}
      initialFormState={initialFormState}
      tab={tab}
    />
  );
};
