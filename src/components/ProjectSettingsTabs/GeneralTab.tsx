import { useCallback, useMemo } from "react";
import { SpruceForm, SpruceFormContainer } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  usePopulateForm,
  useProjectSettingsContext,
} from "context/project-settings";
import { getFormData } from "./GeneralTab/getFormData";
import { GeneralTabProps } from "./types";

const tab = ProjectSettingsTabRoutes.General;

export const GeneralTab: React.FC<GeneralTabProps> = ({
  data,
  useRepoSettings,
}) => {
  const { getTabFormState, updateForm } = useProjectSettingsContext();
  const currentFormState = getTabFormState(tab);

  const initialFormState = useMemo(() => gqlToSchema(data), [data]);
  usePopulateForm(initialFormState, tab);

  const onChange = useCallback(({ formData }) => updateForm(tab, formData), [
    updateForm,
  ]);

  const { generalConfiguration } = useMemo(() => getFormData(useRepoSettings), [
    useRepoSettings,
  ]);

  return (
    <>
      <SpruceFormContainer title="General Configuration">
        <SpruceForm
          fields={generalConfiguration.fields}
          formData={currentFormState}
          onChange={onChange}
          schema={generalConfiguration.schema}
          uiSchema={generalConfiguration.uiSchema}
        />
      </SpruceFormContainer>
    </>
  );
};

const gqlToSchema = ({
  enabled = false,
  owner,
  repo,
  branch,
  displayName,
  batchTime = 0,
  remotePath,
  spawnHostScriptPath,
}) => ({
  enabled: enabled ? "enabled" : "disabled",
  repositoryInfo: {
    owner,
    repo,
  },
  branch,
  other: {
    displayName,
    batchTime,
    remotePath,
    spawnHostScriptPath,
  },
});
