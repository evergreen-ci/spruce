import { useMemo, useState } from "react";
import Button, { Size } from "@leafygreen-ui/button";
import { ValidateProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { useProjectSettingsContext } from "pages/projectSettings/Context";
import { BaseTab } from "../BaseTab";
import { ProjectType, findDuplicateIndices } from "../utils";
import { getFormSchema } from "./getFormSchema";
import { PromoteVariablesModal } from "./PromoteVariablesModal";
import { VariablesFormState, TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.Variables;

const getInitialFormState = (
  projectData: TabProps["projectData"],
  repoData: TabProps["repoData"],
): VariablesFormState => {
  if (!projectData) return repoData;
  if (repoData) return { ...projectData, repoData };
  return projectData;
};

export const VariablesTab: React.FC<TabProps> = ({
  identifier,
  projectData,
  projectType,
  repoData,
}) => {
  const { getTab } = useProjectSettingsContext();
  // @ts-expect-error - see TabState for details.
  const { formData }: { formData: VariablesFormState } = getTab(
    ProjectSettingsTabRoutes.Variables,
  );
  const [modalOpen, setModalOpen] = useState(false);

  const initialFormState = useMemo(
    () => getInitialFormState(projectData, repoData),
    [projectData, repoData],
  );

  const ModalButton: React.FC = () => (
    <Button
      data-cy="promote-vars-button"
      onClick={() => setModalOpen(true)}
      size={Size.Small}
    >
      Move variables to repo
    </Button>
  );

  const formSchema = useMemo(
    () =>
      getFormSchema(
        projectType,
        projectType === ProjectType.AttachedProject ? repoData : null,
        projectType === ProjectType.AttachedProject ? <ModalButton /> : null,
      ),
    [projectType, repoData],
  );

  return (
    <>
      {modalOpen && (
        <PromoteVariablesModal
          projectId={identifier}
          open={modalOpen}
          handleClose={() => setModalOpen(false)}
          variables={formData.vars.map(({ varName }) => ({
            name: varName,
            inRepo:
              repoData?.vars?.some(
                ({ varName: repoVar }) => varName === repoVar,
              ) ?? false,
          }))}
        />
      )}
      <BaseTab
        formSchema={formSchema}
        initialFormState={initialFormState}
        tab={tab}
        validate={validate}
      />
    </>
  );
};

/* Display an error and prevent saving if a user enters a variable name that already appears in the project. */
const validate = ((formData, errors) => {
  const duplicateIndices = findDuplicateIndices(formData.vars, "varName");
  duplicateIndices.forEach((i) => {
    errors.vars?.[i]?.varName?.addError(
      "Value already appears in project variables.",
    );
  });

  return errors;
}) satisfies ValidateProps<VariablesFormState>;
