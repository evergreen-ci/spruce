import { Skeleton } from "antd";
import { LoadingCell, LabelCellContainer } from "../Cell/Cell";

interface LoadingRowProps {
  numVisibleCols: number;
}
export const LoadingRow: React.VFC<LoadingRowProps> = ({ numVisibleCols }) => (
  <>
    <LabelCellContainer>
      <Skeleton active title={false} paragraph={{ rows: 3 }} />
    </LabelCellContainer>
    {Array.from(Array(numVisibleCols)).map((_, index) => (
      // Disabling key index rules since there is nothing unique about these rows
      <LoadingCell key={`loading_row_${index}`} /> // eslint-disable-line react/no-array-index-key
    ))}
  </>
);
