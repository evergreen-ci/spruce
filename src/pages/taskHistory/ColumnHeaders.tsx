import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import { context, Cell, hooks } from "components/HistoryTable";
import { taskHistoryMaxLength as maxLength } from "constants/history";
import { getVariantHistoryRoute } from "constants/routes";
import { useToastContext } from "context/toast";
import {
  GetBuildVariantsForTaskNameQuery,
  GetBuildVariantsForTaskNameQueryVariables,
} from "gql/generated/types";
import { GET_BUILD_VARIANTS_FOR_TASK_NAME } from "gql/queries";
import { array, string, errorReporting } from "utils";

const { reportError } = errorReporting;

const { useColumns } = hooks;
const { convertArrayToObject } = array;
const { trimStringFromMiddle } = string;
const { useHistoryTable } = context;
const { LoadingCell, ColumnHeaderCell, LabelCellContainer } = Cell;

interface ColumnHeadersProps {
  projectId: string;
  taskName: string;
}
const ColumnHeaders: React.FC<ColumnHeadersProps> = ({
  projectId,
  taskName,
}) => {
  const { sendEvent } = useProjectHealthAnalytics();
  const dispatchToast = useToastContext();

  // Fetch the column headers from the same query used on the dropdown.
  const { data: columnData, loading } = useQuery<
    GetBuildVariantsForTaskNameQuery,
    GetBuildVariantsForTaskNameQueryVariables
  >(GET_BUILD_VARIANTS_FOR_TASK_NAME, {
    variables: {
      projectId,
      taskName,
    },
    onCompleted: ({ buildVariantsForTaskName }) => {
      if (!buildVariantsForTaskName) {
        reportError(
          new Error("No build variants found for task name")
        ).severe();
        dispatchToast.error(`No build variants found for task: ${taskName}`);
      }
    },
  });

  const { visibleColumns, columnLimit } = useHistoryTable();
  const { buildVariantsForTaskName } = columnData || {};

  const activeColumns = useColumns(
    buildVariantsForTaskName,
    ({ buildVariant }) => buildVariant
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
            link={getVariantHistoryRoute(projectId, cell.buildVariant)}
            trimmedDisplayName={trimStringFromMiddle(
              cell.displayName,
              maxLength
            )}
            onClick={() => {
              sendEvent({
                name: "Click task history column header",
                variant: cell.buildVariant,
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
