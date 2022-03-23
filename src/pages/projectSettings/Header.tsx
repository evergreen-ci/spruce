import { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import { H2, Disclaimer } from "@leafygreen-ui/typography";
import { Button } from "components/Button";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { size } from "constants/tokens";
import { useProjectSettingsContext } from "context/projectSettings";
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
import { DefaultSectionToRepoModal } from "./DefaultSectionToRepoModal";
import { getTabTitle } from "./getTabTitle";
import { formToGqlMap } from "./tabs/transformers";
import { WritableTabRoutes } from "./tabs/types";
import { ProjectType } from "./tabs/utils";

interface Props {
  id: string;
  isRepo: boolean;
  projectType: ProjectType;
  saveable: boolean;
  tab: ProjectSettingsTabRoutes;
}

export const Header: React.FC<Props> = ({
  id,
  isRepo,
  projectType,
  saveable,
  tab,
}) => {
  const dispatchToast = useToastContext();
  const { title, subtitle } = getTabTitle(tab);
  const { getTab, saveTab } = useProjectSettingsContext();
  const { formData, hasChanges, hasError } = getTab(tab);

  const [defaultModalOpen, setDefaultModalOpen] = useState(false);

  const [saveProjectSection] = useMutation<
    SaveProjectSettingsForSectionMutation,
    SaveProjectSettingsForSectionMutationVariables
  >(SAVE_PROJECT_SETTINGS_FOR_SECTION, {
    onCompleted() {
      saveTab(tab);
      dispatchToast.success("Successfully updated project");
    },
    onError(err) {
      dispatchToast.error(
        `There was an error saving the project: ${err.message}`
      );
    },
    refetchQueries: ["ProjectSettings"],
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
    refetchQueries: ["RepoSettings"],
  });

  const onClick = () => {
    const newData = formToGqlMap[tab](formData, id);
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

    save(newData, mapRouteToSection[tab]);
  };

  return (
    <Container>
      <TitleContainer>
        <H2 data-cy="project-settings-tab-title">{title}</H2>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </TitleContainer>
      <ButtonRow>
        {saveable && (
          <Button
            data-cy="save-settings-button"
            variant="primary"
            onClick={onClick}
            disabled={hasError || !hasChanges}
          >
            Save Changes on Page
          </Button>
        )}
        {projectType === ProjectType.AttachedProject && (
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
    </Container>
  );
};

const mapRouteToSection: Record<WritableTabRoutes, ProjectSettingsSection> = {
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
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${size.l};
`;

const TitleContainer = styled.div`
  margin-right: ${size.s};
`;

const Subtitle = styled(Disclaimer)`
  padding-top: ${size.s};
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;

  > :not(:last-child) {
    margin-right: 12px;
  }
`;
