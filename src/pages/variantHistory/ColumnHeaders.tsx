import { useEffect } from "react";
import styled from "@emotion/styled";
import { context } from "components/HistoryTable";

const { useHistoryTable } = context;
interface ColumnHeadersProps {
  columns: string[];
  loading: boolean;
}
const ColumnHeaders: React.FC<ColumnHeadersProps> = ({ columns, loading }) => {
  const { visibleColumns, addColumns } = useHistoryTable();
  useEffect(() => {
    if (columns) {
      addColumns(columns);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns]);

  return (
    <RowContainer>
      <LabelCellContainer />
      {visibleColumns.map((vc) => {
        const cell = columns.find((c) => c === vc);
        if (!cell) {
          return null;
        }
        return <Cell key={`header_cell_${cell}`}>{cell}</Cell>;
      })}
      {loading &&
        Array.from(Array(8)).map((i) => (
          <Cell key={`loading_cell_${i}`}>Loading...</Cell>
        ))}
    </RowContainer>
  );
};

const LabelCellContainer = styled.div`
  width: 200px;
  padding-right: 40px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const Cell = styled.div`
  display: flex;
  height: 100%;
  width: 140px;
  justify-content: center;
  align-items: center;
`;

export default ColumnHeaders;
