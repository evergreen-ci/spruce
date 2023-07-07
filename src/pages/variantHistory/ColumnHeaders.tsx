import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import { context, Cell, hooks } from "components/HistoryTable";
import { variantHistoryMaxLength as maxLength } from "constants/history";
import { getTaskHistoryRoute } from "constants/routes";
import { useToastContext } from "context/toast";
import {
  TaskNamesForBuildVariantQuery,
  TaskNamesForBuildVariantQueryVariables,
} from "gql/generated/types";
import { GET_TASK_NAMES_FOR_BUILD_VARIANT } from "gql/queries";
import { array, string } from "utils";
import { reportError } from "utils/errorReporting";

const { mapStringArrayToObject } = array;
const { LoadingCell, ColumnHeaderCell, LabelCellContainer } = Cell;
const { useHistoryTable } = context;
const { useColumns } = hooks;
const { trimStringFromMiddle } = string;

interface ColumnHeadersProps {
  projectIdentifier: string;
  variantName: string;
}

const ColumnHeaders: React.VFC<ColumnHeadersProps> = ({
  projectIdentifier,
  variantName,
}) => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Variant history" });
  const dispatchToast = useToastContext();

  // Fetch the column headers from the same query used on the dropdown.
  const { data: columnData, loading } = useQuery<
    TaskNamesForBuildVariantQuery,
    TaskNamesForBuildVariantQueryVariables
  >(GET_TASK_NAMES_FOR_BUILD_VARIANT, {
    variables: {
      projectIdentifier,
      buildVariant: variantName,
    },
    onCompleted: ({ taskNamesForBuildVariant }) => {
      if (!taskNamesForBuildVariant) {
        reportError(
          new Error("No task names found for build variant")
        ).severe();
        dispatchToast.error(`No tasks found for buildVariant: ${variantName}}`);
      }
    },
  });

  const { taskNamesForBuildVariant } = columnData || {};
  const { visibleColumns, columnLimit } = useHistoryTable();

  const columnMap = mapStringArrayToObject(visibleColumns, "name");
  const activeColumns = useColumns(taskNamesForBuildVariant, (c) => c);
  return (
    <RowContainer>
      <LabelCellContainer />
      {activeColumns.map((vc) => {
        const cell = columnMap[vc];
        if (!cell) {
          return null;
        }
        return (
          <ColumnHeaderCell
            key={`header_cell_${vc}`}
            link={getTaskHistoryRoute(projectIdentifier, vc)}
            trimmedDisplayName={trimStringFromMiddle(vc, maxLength)}
            fullDisplayName={vc}
            onClick={() => {
              sendEvent({
                name: "Click column header",
              });
            }}
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
