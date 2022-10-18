import { useMemo, useState } from "react";
import Button, { Size } from "@leafygreen-ui/button";
import { SpruceForm } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  usePopulateForm,
  useProjectSettingsContext,
} from "pages/projectSettings/Context";
import { ProjectType } from "../utils";
import { getFormSchema } from "./getFormSchema";
import { PromoteVariablesModal } from "./PromoteVariablesModal";
import { TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.Variables;

const getInitialFormState = (projectData, repoData) => {
  if (!projectData) return repoData;
  if (repoData) return { ...projectData, repoData };
  return projectData;
};

export const VariablesTab: React.VFC<TabProps> = ({
  identifier,
  projectData,
  projectType,
  repoData,
}) => {
  const { getTab, updateForm } = useProjectSettingsContext();
  const { formData } = getTab(tab);
  const [modalOpen, setModalOpen] = useState(false);

  const initialFormState = useMemo(
    () => getInitialFormState(projectData, repoData),
    [projectData, repoData]
  );
  usePopulateForm(initialFormState, tab);

  const onChange = updateForm(tab);

  const ModalButton: React.VFC = () => (
    <Button
      data-cy="promote-vars-button"
      onClick={() => setModalOpen(true)}
      size={Size.Small}
    >
      Move variables to repo
    </Button>
  );

  const { fields, schema, uiSchema } = useMemo(
    () =>
      getFormSchema(
        projectType,
        projectType === ProjectType.AttachedProject ? repoData : null,
        projectType === ProjectType.AttachedProject ? <ModalButton /> : null
      ),
    [projectType, repoData]
  );

  if (!formData) return null;

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
                ({ varName: repoVar }) => varName === repoVar
              ) ?? false,
          }))}
        />
      )}
      <SpruceForm
        fields={fields}
        formData={formData}
        onChange={onChange}
        schema={schema}
        uiSchema={uiSchema}
        validate={validate}
      />
    </>
  );
};

/* Display an error and prevent saving if a user enters a variable name that already appears in the project. */
const validate = (formData, errors) => {
  const duplicateIndices = formData.vars
    .map((e) => e.varName)
    .map((e, i, arr) => arr.indexOf(e) !== i && i)
    .filter((obj) => formData.vars[obj]);

  duplicateIndices.forEach((i) => {
    errors.vars?.[i]?.varName?.addError(
      "Value already appears in project variables."
    );
  });

  return errors;
};
