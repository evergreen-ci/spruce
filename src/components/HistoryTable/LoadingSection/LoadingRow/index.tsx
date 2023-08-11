import styled from "@emotion/styled";
import { Skeleton } from "antd";
import { LoadingCell, LabelCellContainer } from "components/HistoryTable/Cell";

interface LoadingRowProps {
  numVisibleCols: number;
}
const LoadingRow: React.FC<LoadingRowProps> = ({ numVisibleCols }) => (
  <Container>
    <LabelCellContainer>
      <Skeleton active title={false} paragraph={{ rows: 3 }} />
    </LabelCellContainer>
    {Array.from(Array(numVisibleCols)).map((_, index) => (
      // Disabling key index rules since there is nothing unique about these rows
      <LoadingCell key={`loading_row_${index}`} /> // eslint-disable-line react/no-array-index-key
    ))}
  </Container>
);

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export default LoadingRow;
