import styled from "@emotion/styled";

interface ColumnHeadersProps {
  columns: {
    displayName: string;
  }[];
  loading: boolean;
}
const ColumnHeaders: React.FC<ColumnHeadersProps> = ({ columns, loading }) => (
  <RowContainer>
    <LabelCellContainer />
    {columns.map((c) => (
      <Cell>{c.displayName}</Cell>
    ))}
    {loading && Array.from(Array(8)).map(() => <Cell>Loading...</Cell>)}
  </RowContainer>
);

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
