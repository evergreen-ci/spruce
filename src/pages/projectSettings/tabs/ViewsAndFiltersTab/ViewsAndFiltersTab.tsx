import { useMemo } from "react";
import { ValidateProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { BaseTab } from "../BaseTab";
import { findDuplicateIndices } from "../utils";
import { getFormSchema } from "./getFormSchema";
import { TabProps, ViewsFormState } from "./types";

const tab = ProjectSettingsTabRoutes.ViewsAndFilters;

export const ViewsAndFiltersTab: React.FC<TabProps> = ({ projectData }) => {
  const initialFormState = projectData;

  const formSchema = useMemo(() => getFormSchema(), []);

  return (
    <BaseTab
      formSchema={formSchema}
      initialFormState={initialFormState}
      tab={tab}
      validate={validate}
    />
  );
};

/* Display an error and prevent saving if a user enters a Parsley filter expression that already appears in the project. */
const validate = ((formData, errors) => {
  const duplicateIndices = findDuplicateIndices(
    formData.parsleyFilters,
    "expression"
  );
  duplicateIndices.forEach((i) => {
    errors.parsleyFilters?.[i]?.expression?.addError(
      "Filter expression already appears in this project."
    );
  });

  return errors;
}) satisfies ValidateProps<ViewsFormState>;
