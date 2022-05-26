import Badge, { Variant } from "components/Badge";
import { statusToBadgeColor, statusCopy } from "constants/test";

interface TestStatusBadgeProps {
  status: string;
}

export const TestStatusBadge: React.VFC<TestStatusBadgeProps> = ({
  status,
}) => (
  <Badge
    variant={statusToBadgeColor[status?.toLowerCase()] || Variant.LightGray}
    key={status}
  >
    {statusCopy[status?.toLowerCase()] || status}
  </Badge>
);
