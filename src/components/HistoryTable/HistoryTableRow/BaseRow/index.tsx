import CommitChartLabel from "components/CommitChartLabel";
import { types } from "../..";
import { LabelCellContainer } from "../../Cell";
import { useHistoryTable } from "../../HistoryTableContext";
import { rowType } from "../../types";
import DateSeparator from "./DateSeparator";
import FoldedCommit from "./FoldedCommit";
import { RowContainer } from "./styles";

interface RowProps {
  columns: React.ReactNode[];
  data: types.CommitRowType;
  index: number;
  numVisibleCols: number;
  onClickFoldedGithash: () => void;
  onClickFoldedJiraTicket: () => void;
  onClickFoldedUpstreamProject: () => void;
  onClickGithash: () => void;
  onClickJiraTicket: () => void;
  onClickUpstreamProject: () => void;
  onToggleFoldedCommit: (s: { isVisible: boolean }) => void;
  selected: boolean;
}
const BaseRow: React.VFC<RowProps> = ({
  columns,
  data,
  index,
  numVisibleCols,
  onClickFoldedGithash,
  onClickFoldedJiraTicket,
  onClickFoldedUpstreamProject,
  onClickGithash,
  onClickJiraTicket,
  onClickUpstreamProject,
  onToggleFoldedCommit,
  selected,
}) => {
  const { columnLimit, toggleRowExpansion } = useHistoryTable();

  switch (data.type) {
    case rowType.DATE_SEPARATOR:
      return <DateSeparator date={data.date} />;
    case rowType.COMMIT: {
      const {
        revision,
        createTime,
        author,
        message,
        id: versionId,
        upstreamProject,
      } = data.commit;

      return (
        <RowContainer data-selected={selected} selected={selected}>
          <LabelCellContainer>
            <CommitChartLabel
              versionId={versionId}
              githash={revision}
              createTime={createTime}
              author={author}
              message={message}
              onClickGithash={onClickGithash}
              onClickJiraTicket={onClickJiraTicket}
              upstreamProject={upstreamProject}
              onClickUpstreamProject={onClickUpstreamProject}
            />
          </LabelCellContainer>
          {columns}
        </RowContainer>
      );
    }
    case rowType.FOLDED_COMMITS:
      return (
        <FoldedCommit
          index={index}
          data={data}
          selected={selected}
          numVisibleCols={numVisibleCols || columnLimit}
          onClickGithash={onClickFoldedGithash}
          onClickJiraTicket={onClickFoldedJiraTicket}
          onToggleFoldedCommit={({ expanded, index: rowIndex }) => {
            onToggleFoldedCommit({ isVisible: expanded });
            toggleRowExpansion(rowIndex, expanded);
          }}
          onClickUpstreamProject={onClickFoldedUpstreamProject}
        />
      );
    default:
      return null;
  }
};

export default BaseRow;
