import styled from "@emotion/styled";
import { Skeleton } from "antd";

interface LoadingRowProps {
  visibleCols: string[];
}
export const LoadingRow: React.FC<LoadingRowProps> = ({ visibleCols }) => (
  <>
    <LabelCellContainer>
      <Skeleton active title={false} paragraph={{ rows: 3 }} />
    </LabelCellContainer>
    {visibleCols.map((col) => (
      <LoadingCell key={`loading_row_${col}`}>
        <Skeleton.Avatar active shape="circle" size="small" />
      </LoadingCell>
    ))}
  </>
);

const LabelCellContainer = styled.div`
  width: 200px;
  padding-right: 40px;
`;

const LoadingCell = styled.div`
  display: flex;
  height: 100%;
  width: 140px;
  justify-content: center;
  align-items: center;
  :hover {
    cursor: pointer;
  }
`;
