import styled from "@emotion/styled";
import { Skeleton } from "antd";
import { v4 as uuid } from "uuid";
import { LoadingCell } from "../Cell";

interface LoadingRowProps {
  numVisibleCols: number;
}
export const LoadingRow: React.FC<LoadingRowProps> = ({ numVisibleCols }) => (
  <>
    <LabelCellContainer>
      <Skeleton active title={false} paragraph={{ rows: 3 }} />
    </LabelCellContainer>
    {Array.from(Array(numVisibleCols)).map(() => (
      <LoadingCell key={`loading_row_${uuid()}`} />
    ))}
  </>
);

const LabelCellContainer = styled.div`
  width: 200px;
  padding-right: 40px;
`;
