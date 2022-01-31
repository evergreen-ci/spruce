import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import { H2, Disclaimer } from "@leafygreen-ui/typography";
import { Button } from "components/Button";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { size } from "constants/tokens";
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
import { getTabTitle } from "pages/projectSettings/getTabTitle";
import { useIsTabSaved, useProjectSettingsContext } from "./Context";
import { formToGqlMap } from "./transformers";
import { WritableTabRoutes } from "./types";

interface Props {
  id: string;
  isRepo: boolean;
  saveable: boolean;
  tab: ProjectSettingsTabRoutes;
  useRepoSettings: boolean;
}

export const Header: React.FC<Props> = ({
  id,
  isRepo,
  saveable,
  tab,
  useRepoSettings,
}) => {
  const dispatchToast = useToastContext();
  const { title, subtitle } = getTabTitle(tab);
  const { getTab, saveTab } = useProjectSettingsContext();
  const { hasError } = getTab(tab);
  const saved = useIsTabSaved(tab);

  const [saveProjectSection] = useMutation<
    SaveProjectSettingsForSectionMutation,
    SaveProjectSettingsForSectionMutationVariables
  >(SAVE_PROJECT_SETTINGS_FOR_SECTION, {
    onCompleted() {
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
      dispatchToast.success("Successfully updated repo");
    },
    onError(err) {
      dispatchToast.error(`There was an error saving the repo: ${err.message}`);
    },
    refetchQueries: ["RepoSettings"],
  });

  const onClick = () => {
    const { formData } = getTab(tab);
    const newData = formToGqlMap[tab](formData, id, { useRepoSettings });
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
    saveTab(tab);
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
            disabled={hasError || saved}
          >
            Save Changes on Page
          </Button>
        )}
        {!isRepo && useRepoSettings && (
          <Button data-cy="default-to-repo">Default to Repo on Page</Button>
        )}
      </ButtonRow>
    </Container>
  );
};

const mapRouteToSection: Record<WritableTabRoutes, ProjectSettingsSection> = {
  [ProjectSettingsTabRoutes.General]: ProjectSettingsSection.General,
  [ProjectSettingsTabRoutes.Access]: ProjectSettingsSection.Access,
  [ProjectSettingsTabRoutes.Variables]: ProjectSettingsSection.Variables,
  [ProjectSettingsTabRoutes.GitHubCommitQueue]:
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
  margin-bottom: 30px;
`;

const TitleContainer = styled.div`
  flex-basis: 40%;
  margin-right: ${size.s}px;
`;

const Subtitle = styled(Disclaimer)`
  padding-top: ${size.s}px;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-grow: 4;
  justify-content: flex-end;

  > :not(:last-child) {
    margin-right: 12px;
  }
`;
