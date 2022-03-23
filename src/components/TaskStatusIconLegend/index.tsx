import React, { useState } from "react";
import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import Popover from "@leafygreen-ui/popover";
import { spacing } from "@leafygreen-ui/tokens";
import { Disclaimer, Overline } from "@leafygreen-ui/typography";
import Icon from "components/Icon";
import { PopoverContainer } from "components/styles/Popover";
import { groupedIconStatuses } from "components/TaskStatusIcon";
import { taskStatusToCopy } from "constants/task";
import { size } from "constants/tokens";

export const LegendContent = () => (
  <>
    {/* @ts-expect-error */}
    <LegendTitle>NEW ICONS LEGEND</LegendTitle>
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
  align-items: top;
  width: 125px;
  margin-bottom: ${size.xs};
  margin-right: ${size.xs};
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 400px;
`;

const LabelContainer = styled.div`
  margin-left: ${size.xs};
`;

/* @ts-expect-error  */
const LegendTitle = styled(Overline)`
  margin-bottom: ${size.m};
`;
