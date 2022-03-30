import { useMemo } from "react";
import { SpruceForm } from "components/SpruceForm";
import { timeZones } from "constants/fieldMaps";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { useUserTimeZone } from "hooks/useUserTimeZone";
import {
  usePopulateForm,
  useProjectSettingsContext,
} from "pages/projectSettings/Context";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.PeriodicBuilds;

const getInitialFormState = (projectData, repoData) => {
  if (!projectData) return repoData;
  if (repoData) return { ...projectData, repoData };
  return projectData;
};

export const PeriodicBuildsTab: React.FC<TabProps> = ({
  projectData,
  projectType,
  repoData,
}) => {
  const { getTab, updateForm } = useProjectSettingsContext();
  const { formData } = getTab(tab);

  const initialFormState = useMemo(
    () => getInitialFormState(projectData, repoData),
    [projectData, repoData]
  );
  usePopulateForm(initialFormState, tab);

  const onChange = updateForm(tab);

  const timezone = useUserTimeZone();
  const selectedTimezone = timeZones.find((tz) => tz.value === timezone);

  const { fields, schema, uiSchema } = useMemo(
    () => getFormSchema(projectType, selectedTimezone),
    [projectType, selectedTimezone]
  );

  if (!formData) return null;

  return (
    <SpruceForm
      fields={fields}
      formData={formData}
      onChange={onChange}
      schema={schema}
      uiSchema={uiSchema}
    />
  );
};
