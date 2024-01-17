import { useMemo } from "react";
import { ValidateProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { BaseTab } from "../BaseTab";
import { findDuplicateIndices } from "../utils";
import { getFormSchema } from "./getFormSchema";
import { TabProps, ViewsFormState } from "./types";

const tab = ProjectSettingsTabRoutes.ViewsAndFilters;

const getInitialFormState = (
  projectData: TabProps["projectData"],
  repoData: TabProps["repoData"],
): ViewsFormState => {
  if (!projectData) return repoData;
  if (repoData) return { ...projectData, repoData };
  return projectData;
};

export const ViewsAndFiltersTab: React.FC<TabProps> = ({
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
      validate={validate}
    />
  );
};

/* Display an error and prevent saving if a user enters a Parsley filter expression that already appears in the project or repo. */
const validate = ((formData, errors) => {
  const combinedFilters = [
    ...formData.parsleyFilters,
    ...(formData?.repoData?.parsleyFilters ?? []),
  ];
  const duplicateIndices = findDuplicateIndices(combinedFilters, "expression");
  duplicateIndices.forEach((i) => {
    errors.parsleyFilters?.[i]?.expression?.addError(
      "Filter expression already appears in this project.",
    );
  });

  return errors;
}) satisfies ValidateProps<ViewsFormState>;
