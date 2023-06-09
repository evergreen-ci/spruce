import { useMemo } from "react";
import { SpruceForm } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  usePopulateForm,
  useProjectSettingsContext,
} from "pages/projectSettings/Context";
import { PatchStatus } from "../../../../types/patch";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.PatchAliases;

const getInitialFormState = (projectData, repoData) => {
  // Resolve legacy status value -- will remove after successful deploy
  if (projectData) {
    for (let i = 0; i < projectData.patchTriggerAliases.aliases.length; i++) {
      if (
        projectData.patchTriggerAliases.aliases[i].status ===
        PatchStatus.LegacySuccess
      ) {
        // eslint-disable-next-line no-param-reassign
        projectData.patchTriggerAliases.aliases[i].status = PatchStatus.Success;
      }
    }
  }
  if (repoData) {
    for (let i = 0; i < repoData.patchTriggerAliases.aliases.length; i++) {
      if (
        repoData.patchTriggerAliases.aliases[i].status ===
        PatchStatus.LegacySuccess
      ) {
        // eslint-disable-next-line no-param-reassign
        repoData.patchTriggerAliases.aliases[i].status = PatchStatus.Success;
      }
    }
  }
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

export const PatchAliasesTab: React.VFC<TabProps> = ({
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

  const { fields, schema, uiSchema } = useMemo(
    () => getFormSchema(projectType),
    [projectType]
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
