import { useState } from "react";
import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import Popover from "@leafygreen-ui/popover";
import { spacing } from "@leafygreen-ui/tokens";
import { Disclaimer, Overline } from "@leafygreen-ui/typography";
import Icon from "components/Icon";
import { PopoverContainer } from "components/styles/Popover";
import { groupedIconStatuses } from "components/TaskStatusIcon";
import { taskStatusToCopy } from "constants/task";
import { size, zIndex } from "constants/tokens";

export const LegendContent = () => (
  <>
    <TitleContainer>
      <Overline>NEW ICONS LEGEND</Overline>
      <IconButton aria-label="Close Task Status Icon Legend">
        <Icon glyph="X" />
      </IconButton>
    </TitleContainer>
    <Container>
      {groupedIconStatuses.map(({ icon, statuses }) => {
        const label = statuses.map((status) => (
          <Disclaimer key={status}>{taskStatusToCopy[status]}</Disclaimer>
        ));
        return (
          <Row key={statuses.join()}>
            {icon}
            <LabelContainer>{label}</LabelContainer>
          </Row>
        );
      })}
    </Container>
  </>
);

export const TaskStatusIconLegend: React.FC = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <IconButton
      onClick={() => {
        setIsActive(!isActive);
      }}
      aria-label="Task Status Icon Legend"
    >
      <StyledIcon glyph="QuestionMarkWithCircle" />
      <Popover
        align="top"
        justify="end"
        active={isActive}
        usePortal
        spacing={spacing[2]}
        popoverZIndex={zIndex.popover}
      >
        <PopoverContainer>
          <LegendContent />
        </PopoverContainer>
      </Popover>
    </IconButton>
  );
};

const StyledIcon = styled(Icon)`
  cursor: pointer;
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: ${size.xs};
  margin-right: ${size.xs};
`;

const Container = styled.div`
  width: 400px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`;

const LabelContainer = styled.div`
  margin-left: ${size.xs};
`;

const TitleContainer = styled.div`
  margin-bottom: ${size.m};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
