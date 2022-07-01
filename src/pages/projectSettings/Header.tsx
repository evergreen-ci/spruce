import styled from "@emotion/styled";
import { H2, Disclaimer } from "@leafygreen-ui/typography";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { size } from "constants/tokens";
import { getTabTitle } from "./getTabTitle";
import { HeaderButtons } from "./HeaderButtons";
import { readOnlyTabs, WritableTabRoutes } from "./tabs/types";
import { ProjectType } from "./tabs/utils";

interface Props {
  id: string;
  projectType: ProjectType;
  tab: ProjectSettingsTabRoutes;
}

export const Header: React.VFC<Props> = ({ id, projectType, tab }) => {
  const { title, subtitle } = getTabTitle(tab);
  const saveable = !(readOnlyTabs as ReadonlyArray<string>).includes(tab);

  return (
    <Container>
      <TitleContainer>
        <H2 data-cy="project-settings-tab-title">{title}</H2>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </TitleContainer>
      {saveable && (
        <HeaderButtons
          id={id}
          projectType={projectType}
          tab={tab as WritableTabRoutes}
        />
      )}
    </Container>
  );
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
