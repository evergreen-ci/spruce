import { useMemo } from "react";
import { SpruceForm, ValidateProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  usePopulateForm,
  useProjectSettingsContext,
} from "pages/projectSettings/Context";
import { ProjectType } from "../utils";
import { getFormSchema } from "./getFormSchema";
import { FormState, TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.General;

export const GeneralTab: React.VFC<TabProps> = ({
  projectData,
  projectId,
  projectType,
  repoData,
}) => {
  const { getTab, updateForm } = useProjectSettingsContext();
  const { formData, initialData } = getTab(tab);

  const initialFormState = projectData || repoData;
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
    ]
  );

  if (!formData) return null;

  return (
    <SpruceForm
      fields={fields}
      formData={formData}
      onChange={onChange}
      schema={schema}
      uiSchema={uiSchema}
      validate={validate(projectType) as any}
    />
  );
};

const validate = (projectType: ProjectType) =>
  ((formData, errors) => {
    const {
      generalConfiguration: { enabled, branch },
    } = formData;

    // Repos don't use the enabled field and are always considered enabled, so don't check for it.
    const invalidRepoBranch = projectType === ProjectType.Repo && !branch;
    const invalidProjectBranch =
      projectType === ProjectType.Project && enabled && !branch;

    if (invalidRepoBranch || invalidProjectBranch) {
      errors.generalConfiguration.branch.addError(
        "A branch is required for enabled projects."
      );
    }

    return errors;
  }) satisfies ValidateProps<FormState>;
