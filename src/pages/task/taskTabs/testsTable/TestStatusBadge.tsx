import Badge, { Variant } from "components/Badge";
import { statusToBadgeColor, statusCopy } from "constants/test";

interface TestStatusBadgeProps {
  status: string;
}

export const TestStatusBadge: React.FC<TestStatusBadgeProps> = ({ status }) => (
  <Badge variant={statusToBadgeColor[status] || Variant.LightGray} key={status}>
    {statusCopy[status] || status}
  </Badge>
);
