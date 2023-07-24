import styled from "@emotion/styled";
import { H2 } from "@leafygreen-ui/typography";
import { DistroSettingsTabRoutes } from "constants/routes";
import { size } from "constants/tokens";
import { getTabTitle } from "./getTabTitle";
import { HeaderButtons } from "./HeaderButtons";
import {
  WritableDistroSettingsTabs,
  WritableDistroSettingsType,
} from "./tabs/types";

interface Props {
  tab: DistroSettingsTabRoutes;
}

export const Header: React.VFC<Props> = ({ tab }) => {
  const { title } = getTabTitle(tab);
  const saveable = Object.values(WritableDistroSettingsTabs).includes(
    tab as WritableDistroSettingsType
  );

  return (
    <Container>
      <TitleContainer>
        <H2 data-cy="project-settings-tab-title">{title}</H2>
      </TitleContainer>
      {saveable && <HeaderButtons tab={tab as WritableDistroSettingsType} />}
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
