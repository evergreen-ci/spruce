import styled from "@emotion/styled";
import { Skeleton } from "antd";
import { context, Cell } from "components/HistoryTable";

const { useHistoryTable } = context;
const { HeaderCell } = Cell;

interface ColumnHeadersProps {
  columns: string[];
  loading: boolean;
}
const ColumnHeaders: React.FC<ColumnHeadersProps> = ({ columns, loading }) => {
  const { visibleColumns, columnLimit } = useHistoryTable();

  return (
    <RowContainer>
      <LabelCellContainer />
      {visibleColumns.map((vc) => {
        const cell = columns.find((c) => c === vc);
        if (!cell) {
          return null;
        }
        return <HeaderCell key={`header_cell_${cell}`}>{cell}</HeaderCell>;
      })}
      {loading &&
        Array.from(Array(columnLimit)).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <HeaderCell key={`loading_cell_${i}`}>
            <Skeleton active title paragraph={false} />
          </HeaderCell>
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
