import { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useProjectSettingsAnalytics } from "analytics";
import {
  getProjectSettingsRoute,
  ProjectSettingsTabRoutes,
  slugs,
} from "constants/routes";
import { useToastContext } from "context/toast";
import {
  ProjectSettingsSection,
  SaveProjectSettingsForSectionMutation,
  SaveProjectSettingsForSectionMutationVariables,
  SaveRepoSettingsForSectionMutation,
  SaveRepoSettingsForSectionMutationVariables,
} from "gql/generated/types";
import {
  SAVE_PROJECT_SETTINGS_FOR_SECTION,
  SAVE_REPO_SETTINGS_FOR_SECTION,
} from "gql/mutations";
import { useProjectSettingsContext } from "./Context";
import { DefaultSectionToRepoModal } from "./DefaultSectionToRepoModal";
import { formToGqlMap } from "./tabs/transformers";
import { FormToGqlFunction, WritableProjectSettingsType } from "./tabs/types";
import { ProjectType } from "./tabs/utils";

const defaultToRepoDisabled: Set<WritableProjectSettingsType> = new Set([
  ProjectSettingsTabRoutes.Notifications,
  ProjectSettingsTabRoutes.Plugins,
  ProjectSettingsTabRoutes.Containers,
  ProjectSettingsTabRoutes.ViewsAndFilters,
]);

interface Props {
  id: string;
  projectType: ProjectType;
  tab: WritableProjectSettingsType;
}

export const HeaderButtons: React.FC<Props> = ({ id, projectType, tab }) => {
  const { sendEvent } = useProjectSettingsAnalytics();
  const dispatchToast = useToastContext();

  const isRepo = projectType === ProjectType.Repo;
  const { getTab, saveTab } = useProjectSettingsContext();
  const { formData, hasChanges, hasError } = getTab(tab);
  const navigate = useNavigate();
  const { [slugs.projectIdentifier]: identifier } = useParams();

  const [defaultModalOpen, setDefaultModalOpen] = useState(false);

  const [saveProjectSection] = useMutation<
    SaveProjectSettingsForSectionMutation,
    SaveProjectSettingsForSectionMutationVariables
  >(SAVE_PROJECT_SETTINGS_FOR_SECTION, {
    onCompleted({
      saveProjectSettingsForSection: {
        projectRef: { identifier: newIdentifier },
      },
    }) {
      saveTab(tab);
      dispatchToast.success("Successfully updated project");

      if (identifier !== newIdentifier) {
        setTimeout(() => {
          navigate(getProjectSettingsRoute(newIdentifier, tab), {
            replace: true,
          });
        }, 500);
      }
    },
    onError(err) {
      dispatchToast.error(
        `There was an error saving the project: ${err.message}`,
      );
    },
    refetchQueries: ({
      data: {
        saveProjectSettingsForSection: {
          projectRef: { identifier: newIdentifier },
        },
      },
    }) =>
      identifier === newIdentifier
        ? ["ProjectSettings", "ViewableProjectRefs", "ProjectBanner"]
        : [],
  });

  const [saveRepoSection] = useMutation<
    SaveRepoSettingsForSectionMutation,
    SaveRepoSettingsForSectionMutationVariables
  >(SAVE_REPO_SETTINGS_FOR_SECTION, {
    onCompleted() {
      saveTab(tab);
      dispatchToast.success("Successfully updated repo");
    },
    onError(err) {
      dispatchToast.error(`There was an error saving the repo: ${err.message}`);
    },
    refetchQueries: ["RepoSettings", "ViewableProjectRefs"],
  });

  const onClick = () => {
    const formToGql: FormToGqlFunction<typeof tab> = formToGqlMap[tab];
    const newData = formToGql(formData, id);
    const save = (update, section) =>
      isRepo
        ? saveRepoSection({
            variables: {
              section,
              repoSettings: update,
            },
          })
        : saveProjectSection({
            variables: {
              section,
              projectSettings: update,
            },
          });

    const section = mapRouteToSection[tab];
    save(newData, section);
    sendEvent({ section, name: isRepo ? "Save repo" : "Save project" });
  };

  const canDefaultToRepo = !defaultToRepoDisabled.has(tab);

  return (
    <ButtonRow>
      <Button
        data-cy="save-settings-button"
        variant="primary"
        onClick={onClick}
        disabled={hasError || !hasChanges}
      >
        Save Changes on Page
      </Button>
      {projectType === ProjectType.AttachedProject && canDefaultToRepo && (
        <>
          <Button
            onClick={() => setDefaultModalOpen(true)}
            data-cy="default-to-repo-button"
          >
            Default to Repo on Page
          </Button>
          <DefaultSectionToRepoModal
            handleClose={() => setDefaultModalOpen(false)}
            open={defaultModalOpen}
            projectId={id}
            section={mapRouteToSection[tab]}
          />
        </>
      )}
    </ButtonRow>
  );
};

const mapRouteToSection: Record<
  WritableProjectSettingsType,
  ProjectSettingsSection
> = {
  [ProjectSettingsTabRoutes.General]: ProjectSettingsSection.General,
  [ProjectSettingsTabRoutes.Access]: ProjectSettingsSection.Access,
  [ProjectSettingsTabRoutes.Variables]: ProjectSettingsSection.Variables,
  [ProjectSettingsTabRoutes.GithubCommitQueue]:
    ProjectSettingsSection.GithubAndCommitQueue,
  [ProjectSettingsTabRoutes.Notifications]:
    ProjectSettingsSection.Notifications,
  [ProjectSettingsTabRoutes.PatchAliases]: ProjectSettingsSection.PatchAliases,
  [ProjectSettingsTabRoutes.VirtualWorkstation]:
    ProjectSettingsSection.Workstation,
  [ProjectSettingsTabRoutes.ProjectTriggers]: ProjectSettingsSection.Triggers,
  [ProjectSettingsTabRoutes.PeriodicBuilds]:
    ProjectSettingsSection.PeriodicBuilds,
  [ProjectSettingsTabRoutes.Plugins]: ProjectSettingsSection.Plugins,
  [ProjectSettingsTabRoutes.Containers]: ProjectSettingsSection.Containers,
  [ProjectSettingsTabRoutes.ViewsAndFilters]:
    ProjectSettingsSection.ViewsAndFilters,
};

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;

  > :not(:last-child) {
    margin-right: 12px;
  }
`;
