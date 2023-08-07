import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import Tooltip from "@leafygreen-ui/tooltip";
import Icon from "components/Icon";
import { StyledLink } from "components/styles";
import {
  getJiraBugUrl,
  getJiraImprovementUrl,
} from "constants/externalResources";
import { useSpruceConfig } from "hooks";

const { green } = palette;

export const Feedback: React.FC = () => {
  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host;

  const jiraBugUrl = getJiraBugUrl(jiraHost);
  const jiraImprovementUrl = getJiraImprovementUrl(jiraHost);

  return (
    <Tooltip
      align="left"
      justify="end"
      trigger={
        <IconButton aria-label="Show Feedback form">
          <Icon glyph="Megaphone" color={green.dark1} />
        </IconButton>
      }
      triggerEvent="click"
    >
      Feedback for the Evergreen team?{" "}
      <StyledLink target="_blank" href={jiraImprovementUrl}>
        Suggest an improvement
      </StyledLink>{" "}
      or
      <StyledLink target="_blank" href={jiraBugUrl}>
        report a bug
      </StyledLink>
      .
    </Tooltip>
  );
};
