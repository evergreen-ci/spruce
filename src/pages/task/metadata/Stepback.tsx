import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import Tooltip from "@leafygreen-ui/tooltip";
import { Body } from "@leafygreen-ui/typography";
import Icon from "components/Icon";
import { MetadataItem } from "components/MetadataCard";
import { size } from "constants/tokens";

type Props = {
  finished: boolean;
  isStepbackTask: boolean;
  loading: boolean;
};

export const Stepback: React.FC<Props> = ({
  finished,
  isStepbackTask,
  loading,
}) => {
  if (!isStepbackTask) {
    return;
  }

  return (
    <MetadataItem>
      Stepback:
      <Tooltip
        align="top"
        justify="middle"
        trigger={
          <IconContainer>
            <Icon glyph="InfoWithCircle" size="small" />
          </IconContainer>
        }
        triggerEvent="hover"
      >
        <Body>
          When Stepback is completed you can access the breaking commit via the
          relevant commits dropdown.
        </Body>
      </Tooltip>{" "}
      {loading && <Badge variant="lightgray">Loading</Badge>}
      {!loading && !finished && <Badge variant="lightgray">In progress</Badge>}
      {!loading && finished && <Badge variant="green">Complete</Badge>}
    </MetadataItem>
  );
};

const IconContainer = styled.span`
  margin-left: ${size.xxs};
  vertical-align: bottom;
`;
