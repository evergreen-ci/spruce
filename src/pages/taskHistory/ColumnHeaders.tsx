import { useEffect } from "react";
import styled from "@emotion/styled";
import { context, Cell } from "components/HistoryTable";

const { useHistoryTable } = context;
const { HeaderCell } = Cell;

interface ColumnHeadersProps {
  columns: {
    displayName: string;
    buildVariant: string;
  }[];
  loading: boolean;
}
const ColumnHeaders: React.FC<ColumnHeadersProps> = ({ columns, loading }) => {
  const { visibleColumns, addColumns, columnLimit } = useHistoryTable();
  useEffect(() => {
    if (columns) {
      addColumns(columns.map((c) => c.buildVariant));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns]);

  return (
    <RowContainer>
      <LabelCellContainer />
      {visibleColumns.map((vc) => {
        const cell = columns.find((c) => c.buildVariant === vc);
        if (!cell) {
          return null;
        }
        return (
          <HeaderCell key={`header_cell_${cell.buildVariant}`}>
            {cell.displayName}
          </HeaderCell>
        );
      })}
      {loading &&
        Array.from(Array(columnLimit)).map((i) => (
          <HeaderCell key={`loading_cell_${i}`}>Loading...</HeaderCell>
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
