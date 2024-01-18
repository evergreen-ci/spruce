import styled from "@emotion/styled";
import { H2 } from "@leafygreen-ui/typography";
import { StyledRouterLink } from "components/styles";
import {
  getProjectSettingsRoute,
  ProjectSettingsTabRoutes,
} from "constants/routes";
import { size } from "constants/tokens";
import { getTabTitle } from "./getTabTitle";
import { HeaderButtons } from "./HeaderButtons";
import {
  WritableProjectSettingsTabs,
  WritableProjectSettingsType,
} from "./tabs/types";
import { ProjectType } from "./tabs/utils";

interface Props {
  attachedRepoId?: string;
  id: string;
  projectType: ProjectType;
  tab: ProjectSettingsTabRoutes;
}

export const Header: React.FC<Props> = ({
  attachedRepoId,
  id,
  projectType,
  tab,
}) => {
  const { title } = getTabTitle(tab);
  const saveable = Object.values(WritableProjectSettingsTabs).includes(
    tab as WritableProjectSettingsType,
  );

  return (
    <Container>
      <TitleContainer>
        <H2 data-cy="project-settings-tab-title">{title}</H2>
        {projectType === ProjectType.AttachedProject && (
          <StyledRouterLink
            to={getProjectSettingsRoute(attachedRepoId, tab)}
            data-cy="attached-repo-link"
          >
            <strong>Go to repo settings</strong>
          </StyledRouterLink>
        )}
      </TitleContainer>
      {saveable && (
        <HeaderButtons
          id={id}
          projectType={projectType}
          tab={tab as WritableProjectSettingsType}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  align-items: start;
  display: flex;
  justify-content: space-between;
  margin-bottom: ${size.l};
`;

const TitleContainer = styled.div`
  margin-right: ${size.s};
`;
