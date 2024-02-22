import Badge, { Variant } from "@leafygreen-ui/badge";
import { TestStatus } from "types/test";
import { statusToBadgeColor, statusCopy } from "./constants";

interface TestStatusBadgeProps {
  status: TestStatus;
}

const TestStatusBadge: React.FC<TestStatusBadgeProps> = ({ status }) => (
  <Badge
    variant={statusToBadgeColor[status?.toLowerCase()] || Variant.LightGray}
    key={status}
  >
    {statusCopy[status?.toLowerCase()] || status}
  </Badge>
);

export default TestStatusBadge;
