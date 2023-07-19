import { useMemo } from "react";
import { SpruceForm, ValidateProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  usePopulateForm,
  useProjectSettingsContext,
} from "pages/projectSettings/Context";
import { ProjectType } from "../utils";
import { getFormSchema } from "./getFormSchema";
import { GeneralFormState, TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.General;

export const GeneralTab: React.VFC<TabProps> = ({
  projectData,
  projectId,
  projectType,
  repoData,
}) => {
  const { getTab, updateForm } = useProjectSettingsContext();
  const tabData = getTab(tab);

  // @ts-expect-error - see TabState for details.
  const { formData }: { formData: GeneralFormState } = tabData;
  const { initialData } = tabData;

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
    if (projectType === ProjectType.Repo) {
      return errors;
    }

    const {
      generalConfiguration: { enabled, branch },
    } = formData;

    // Ensure that both attached and unattached projects have a branch specified if they are enabled.
    if (enabled && !branch) {
      errors.generalConfiguration.branch.addError(
        "A branch is required for enabled projects."
      );
    }

    return errors;
  }) satisfies ValidateProps<GeneralFormState>;
