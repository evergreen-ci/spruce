import { Skeleton } from "@leafygreen-ui/skeleton-loader";
import { Cell, Row } from "@leafygreen-ui/table";

interface LoadingRowProps {
  numColumns: number;
}
const LoadingRow: React.FC<LoadingRowProps> = ({ numColumns }) => (
  <Row>
    {Array.from({ length: numColumns }, (_, i) => (
      <Cell key={i}>
        <Skeleton size="small" />
      </Cell>
    ))}
  </Row>
);

export default LoadingRow;
