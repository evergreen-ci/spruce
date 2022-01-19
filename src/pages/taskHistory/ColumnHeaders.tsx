import styled from "@emotion/styled";
import { context, Cell } from "components/HistoryTable";
import { getVariantHistoryRoute } from "constants/routes";
import { array, string } from "utils";

const { convertArrayToObject } = array;
const { trimMiddleText } = string;
const { useHistoryTable } = context;
const { LoadingCell, ColumnHeaderCell } = Cell;

const maxLength = 50;
const trailingLength = 15;

interface ColumnHeadersProps {
  projectId: string;
  columns: {
    displayName: string;
    buildVariant: string;
  }[];
  loading: boolean;
}
const ColumnHeaders: React.FC<ColumnHeadersProps> = ({
  projectId,
  columns,
  loading,
}) => {
  const { visibleColumns, columnLimit } = useHistoryTable();
  const columnMap = convertArrayToObject(columns, "buildVariant");
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
            trimmedDisplayName={trimMiddleText(
              cell.displayName,
              maxLength,
              trailingLength
            )}
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

// LabelCellContainer is used to provide padding for the first column in the table since we do not have a header for it
const LabelCellContainer = styled.div`
  width: 200px;
  padding-right: 40px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export default ColumnHeaders;
