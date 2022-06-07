import { useState } from "react";
import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import { uiColors } from "@leafygreen-ui/palette";
import Cookies from "js-cookie";
import Icon from "components/Icon";
import { StyledLink as Link } from "components/styles";
import { HIDE_FEEDBACK } from "constants/cookies";
import { size } from "constants/tokens";
import { useSpruceConfig } from "hooks";

const { green } = uiColors;

export const Feedback: React.VFC = () => {
  const spruceConfig = useSpruceConfig();

  const userVoiceUrl = spruceConfig?.ui?.userVoice;

  const hideFeeback =
    Cookies.get(HIDE_FEEDBACK) !== undefined
      ? Cookies.get(HIDE_FEEDBACK) === "true"
      : false;
  const [isHidden, setIsHidden] = useState(hideFeeback);
  return (
    <div>
      {!isHidden && (
        <StyledLink target="_blank" href={userVoiceUrl}>
          Feature Requests/Feedback
        </StyledLink>
      )}
      <IconButton
        onClick={() => {
          Cookies.set(HIDE_FEEDBACK, `${!isHidden}`, { expires: 365 });
          setIsHidden(!isHidden);
        }}
        aria-label="Show Feedback form"
      >
        <StyledIcon glyph="Megaphone" color={green.base} />
      </IconButton>
    </div>
  );
};

const StyledIcon = styled(Icon)`
  cursor: pointer;
`;
const StyledLink = styled(Link)`
  margin-top: ${size.xxs};
  margin-right: ${size.xs};
  position: fixed;
  background-color: ${uiColors.white};
  white-space: nowrap;
  right: ${size.l};
`;
