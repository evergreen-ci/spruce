import { useMemo } from "react";
import { SpruceForm } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  usePopulateForm,
  useProjectSettingsContext,
} from "pages/projectSettings/Context";
import { ProjectType } from "../utils";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.General;

export const GeneralTab: React.VFC<TabProps> = ({
  projectData,
  projectId,
  projectType,
  repoData,
  validDefaultLoggers,
}) => {
  const { getTab, updateForm } = useProjectSettingsContext();
  const { formData, initialData } = getTab(tab);

  const initialFormState = projectData || repoData;
  console.log("initialFormState: ", initialFormState);
  usePopulateForm(initialFormState, tab);

  const onChange = updateForm(tab);

  const {
    projectRef: {
      identifier: initialIdentifier,
      owner: initialOwner,
      repo: initialRepo,
    },
  } = initialData ?? { projectRef: {} };

  const identifierHasChanges = useMemo(
    () =>
      initialIdentifier !== formData?.generalConfiguration?.other?.identifier,
    [initialIdentifier, formData?.generalConfiguration?.other?.identifier]
  );
  const { fields, schema, uiSchema } = useMemo(
    () =>
      getFormSchema(
        projectId,
        projectType,
        validDefaultLoggers,
        identifierHasChanges,
        initialOwner,
        initialRepo,
        projectType === ProjectType.AttachedProject ? repoData : null
      ),
    [
      identifierHasChanges,
      initialOwner,
      initialRepo,
      projectId,
      projectType,
      repoData,
      validDefaultLoggers,
    ]
  );
  console.log("fields: ", fields);

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
