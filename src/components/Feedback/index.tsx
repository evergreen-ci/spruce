import React from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import Icon from "components/icons/Icon";
import { StyledLink } from "components/styles";
import { getUserVoiceKey } from "utils/getEnvironmentVariables";

const { green } = uiColors;
export const Feedback: React.FC = () => {
  const userVoiceUrl = `https://feedback.mongodb.com/forums/${getUserVoiceKey()}`;
  return (
    <FloatingContainer>
      <StyledLink target="_blank" href={userVoiceUrl}>
        Feature Requests/Feedback
        <StyledIcon glyph="Megaphone" color={green.base} />
      </StyledLink>
    </FloatingContainer>
  );
};

const FloatingContainer = styled.div`
  position: fixed;
  z-index: 30;
  bottom: 0;
  margin-left: 36px;
  margin-bottom: 15px;
  background-color: white;
  padding: 10px;
  border-radius: 15px;
`;
const StyledIcon = styled(Icon)`
  padding: 5px 0 0 5px;
`;
