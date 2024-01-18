import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import { context, Cell, hooks } from "components/HistoryTable";
import { taskHistoryMaxLength as maxLength } from "constants/history";
import { getVariantHistoryRoute } from "constants/routes";
import { useToastContext } from "context/toast";
import {
  BuildVariantsForTaskNameQuery,
  BuildVariantsForTaskNameQueryVariables,
} from "gql/generated/types";
import { BUILD_VARIANTS_FOR_TASK_NAME } from "gql/queries";
import { array, string } from "utils";
import { reportError } from "utils/errorReporting";

const { useColumns } = hooks;
const { convertArrayToObject } = array;
const { trimStringFromMiddle } = string;
const { useHistoryTable } = context;
const { ColumnHeaderCell, LabelCellContainer, LoadingCell } = Cell;

interface ColumnHeadersProps {
  projectIdentifier: string;
  taskName: string;
}

const ColumnHeaders: React.FC<ColumnHeadersProps> = ({
  projectIdentifier,
  taskName,
}) => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Task history" });
  const dispatchToast = useToastContext();

  // Fetch the column headers from the same query used on the dropdown.
  const { data: columnData, loading } = useQuery<
    BuildVariantsForTaskNameQuery,
    BuildVariantsForTaskNameQueryVariables
  >(BUILD_VARIANTS_FOR_TASK_NAME, {
    variables: {
      projectIdentifier,
      taskName,
    },
    onCompleted: ({ buildVariantsForTaskName }) => {
      if (!buildVariantsForTaskName) {
        reportError(
          new Error("No build variants found for task name"),
        ).warning();
        dispatchToast.error(`No build variants found for task: ${taskName}`);
      }
    },
  });

  const { columnLimit, visibleColumns } = useHistoryTable();
  const { buildVariantsForTaskName } = columnData || {};

  const activeColumns = useColumns(
    buildVariantsForTaskName,
    ({ buildVariant }) => buildVariant,
  );
  const columnMap = convertArrayToObject(activeColumns, "buildVariant");
  return (
    <RowContainer>
      <LabelCellContainer />
      {visibleColumns.map((vc) => {
        const cell = columnMap[vc];
        if (!cell) {
          return null;
        }
        return (
          <ColumnHeaderCell
            key={`header_cell_${cell.displayName}`}
            link={getVariantHistoryRoute(projectIdentifier, cell.buildVariant)}
            trimmedDisplayName={trimStringFromMiddle(
              cell.displayName,
              maxLength,
            )}
            onClick={() => {
              sendEvent({
                name: "Click column header",
              });
            }}
            fullDisplayName={cell.displayName}
          />
        );
      })}
      {loading &&
        Array.from(Array(columnLimit)).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <LoadingCell key={`loading_cell_${i}`} isHeader />
        ))}
    </RowContainer>
  );
};

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export default ColumnHeaders;
