import styled from "@emotion/styled";
import Button, { Size } from "@leafygreen-ui/button";
import Tooltip from "@leafygreen-ui/tooltip";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import Icon from "components/Icon";
import Popconfirm from "components/Popconfirm";
import { size } from "constants/tokens";
import AnnotationTicketRow, {
  AnnotationTicketRowProps,
} from "../AnnotationTicketRow";

interface AnnotationTicketRowWithActionsProps extends AnnotationTicketRowProps {
  onRemove: (url: string, issueKey: string) => void;
  userCanModify: boolean;
  onMove: ({
    confidenceScore,
    issueKey,
    url,
  }: {
    url: string;
    issueKey: string;
    confidenceScore?: number;
  }) => void;
  issueString: string;
  isIssue: boolean;
}

const AnnotationTicketRowWithActions: React.FC<
  AnnotationTicketRowWithActionsProps
> = ({ isIssue, issueString, onMove, onRemove, userCanModify, ...rest }) => {
  const { confidenceScore, issueKey, url } = rest;
  return (
    <Container>
      <AnnotationTicketRow {...rest} />
      <ButtonContainer>
        {ConditionalWrapper({
          condition: userCanModify,
          wrapper: (children: JSX.Element) => (
            <Popconfirm
              align="right"
              onConfirm={() => {
                onMove({ url, issueKey, confidenceScore });
              }}
              trigger={children}
            >
              Do you want to move this {issueString} to{" "}
              {isIssue ? "suspected issues" : "issues"}?
            </Popconfirm>
          ),
          altWrapper: (children: JSX.Element) => (
            <Tooltip trigger={children}>
              You are not authorized to edit failure details
            </Tooltip>
          ),
          children: (
            <Button
              size={Size.Small}
              data-cy={`move-btn-${issueKey}`}
              disabled={!userCanModify}
              leftGlyph={<Icon glyph={isIssue ? "ArrowDown" : "ArrowUp"} />}
            >
              Move to {isIssue ? "suspected issues" : "issues"}
            </Button>
          ),
        })}
        {ConditionalWrapper({
          condition: userCanModify,
          wrapper: (children: JSX.Element) => (
            <Popconfirm
              align="right"
              onConfirm={() => {
                onRemove(url, issueKey);
              }}
              trigger={children}
            >
              Do you want to delete this {issueString}?
            </Popconfirm>
          ),
          altWrapper: (children: JSX.Element) => (
            <Tooltip trigger={children}>
              You are not authorized to edit failure details
            </Tooltip>
          ),
          children: (
            <Button
              size="small"
              data-cy={`${issueKey}-delete-btn`}
              leftGlyph={<Icon glyph="Trash" />}
              disabled={!userCanModify}
            />
          ),
        })}
      </ButtonContainer>
    </Container>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${size.xs};
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default AnnotationTicketRowWithActions;
