import { useMemo } from "react";
import { ValidateProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { useProjectSettingsContext } from "pages/projectSettings/Context";
import { BaseTab } from "../BaseTab";
import { ProjectType } from "../utils";
import { getFormSchema } from "./getFormSchema";
import { GeneralFormState, TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.General;

export const GeneralTab: React.FC<TabProps> = ({
  projectData,
  projectId,
  projectType,
  repoData,
}) => {
  const { getTab } = useProjectSettingsContext();
  const tabData = getTab(tab);

  // @ts-expect-error - see TabState for details.
  const { formData }: { formData: GeneralFormState } = tabData;
  const { initialData } = tabData;

  const initialFormState = projectData || repoData;

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
    [initialIdentifier, formData?.generalConfiguration?.other?.identifier],
  );
  const formSchema = useMemo(
    () =>
      getFormSchema(
        projectId,
        projectType,
        identifierHasChanges,
        initialOwner,
        initialRepo,
        projectType === ProjectType.AttachedProject ? repoData : null,
      ),
    [
      identifierHasChanges,
      initialOwner,
      initialRepo,
      projectId,
      projectType,
      repoData,
    ],
  );

  return (
    <BaseTab
      initialFormState={initialFormState}
      formSchema={formSchema}
      tab={tab}
      validate={validate(projectType)}
    />
  );
};

const validate = (projectType: ProjectType) =>
  ((formData, errors) => {
    if (projectType === ProjectType.Repo) {
      return errors;
    }

    const {
      generalConfiguration: { branch, enabled },
    } = formData;

    // Ensure that both attached and unattached projects have a branch specified if they are enabled.
    if (enabled && !branch) {
      errors.generalConfiguration.branch.addError(
        "A branch is required for enabled projects.",
      );
    }

    return errors;
  }) satisfies ValidateProps<GeneralFormState>;
