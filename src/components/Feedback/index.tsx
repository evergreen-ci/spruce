import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import { uiColors } from "@leafygreen-ui/palette";
import Cookies from "js-cookie";
import Icon from "components/Icon";
import { StyledLink as Link } from "components/styles";
import { HIDE_FEEDBACK } from "constants/cookies";
import { GetSpruceConfigQuery } from "gql/generated/types";
import { GET_SPRUCE_CONFIG } from "gql/queries";

const { green } = uiColors;

export const Feedback: React.FC = () => {
  const { data } = useQuery<GetSpruceConfigQuery>(GET_SPRUCE_CONFIG);

  const userVoiceUrl = data?.spruceConfig?.ui?.userVoice;

  const hideFeeback =
    Cookies.get(HIDE_FEEDBACK) !== undefined
      ? Cookies.get(HIDE_FEEDBACK) === "true"
      : false;
  const [isHidden, setIsHidden] = useState(hideFeeback);
  return (
    <FloatingContainer>
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
    </FloatingContainer>
  );
};

const FloatingContainer = styled.div`
  position: fixed;
  z-index: 30;
  bottom: 0;
  right: 0;
  margin-left: 36px;
  margin-bottom: 15px;
  background-color: white;
  padding: 10px;
  border-radius: 15px;
  display: flex;
  justify-content: center;
`;
const StyledIcon = styled(Icon)`
  cursor: pointer;
`;
const StyledLink = styled(Link)`
  margin-right: 5px;
  margin-top: 3px;
`;
