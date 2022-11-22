import Button from "@leafygreen-ui/button";
import { useLGButtonRouterLink } from "hooks/useLGButtonRouterLink";

interface Props {
  onClick: () => void;
  to: string;
}

export const TaskHistoryTestsButton: React.FC<Props> = ({ onClick, to }) => {
  const linkComp = useLGButtonRouterLink(to);
  return (
    <Button
      size="xsmall"
      data-cy="task-history-tests-btn"
      key="task-history"
      onClick={onClick}
      as={linkComp}
    >
      History
    </Button>
  );
};
