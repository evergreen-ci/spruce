import { useState } from "react";
import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import Popover from "@leafygreen-ui/popover";
import { Disclaimer, Overline } from "@leafygreen-ui/typography";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import Icon from "components/Icon";
import { PopoverContainer } from "components/styles/Popover";
import { groupedIconStatuses } from "components/TaskStatusIcon";
import { taskStatusToCopy } from "constants/task";
import { size, zIndex } from "constants/tokens";

export const LegendContent = () => (
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
);

export const TaskStatusIconLegend: React.FC = () => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Commit chart" });
  const [isActive, setIsActive] = useState(false);

  return (
    <div>
      <IconButton
        onClick={() => {
          setIsActive(!isActive);
          sendEvent({
            name: "Toggle task icons legend",
            toggle: isActive ? "close" : "open",
          });
        }}
        aria-label="Task Status Icon Legend"
      >
        <StyledIcon glyph="QuestionMarkWithCircle" />
      </IconButton>
      <Popover
        align="top"
        justify="end"
        active={isActive}
        usePortal
        popoverZIndex={zIndex.popover}
      >
        <StyledPopoverContainer>
          <TitleContainer>
            <Overline>Icon Legend</Overline>
            <IconButton
              onClick={() => {
                sendEvent({
                  name: "Toggle task icons legend",
                  toggle: "close",
                });
                setIsActive(false);
              }}
              aria-label="Close Task Status Icon Legend"
            >
              <Icon glyph="X" />
            </IconButton>
          </TitleContainer>
          <LegendContent />
        </StyledPopoverContainer>
      </Popover>
    </div>
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

const StyledPopoverContainer = styled(PopoverContainer)`
  border-radius: ${size.xs};
`;
