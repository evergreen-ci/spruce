import styled from "@emotion/styled";
import { useLocation } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import { GroupedTaskStatusBadge } from "components/GroupedTaskStatusBadge";
import { wordBreakCss, StyledRouterLink } from "components/styles";
import { getVersionRoute } from "constants/routes";
import { size } from "constants/tokens";
import { StatusCount } from "gql/generated/types";

import { queryString, string, statuses } from "utils";

const { groupStatusesByUmbrellaStatus } = statuses;
const { parseQueryString } = queryString;
const { applyStrictRegex } = string;

interface VariantTaskGroupProps {
  displayName: string;
  statusCounts: StatusCount[];
  variant: string;
  versionId: string;
}
const VariantTaskGroup: React.VFC<VariantTaskGroupProps> = ({
  displayName,
  statusCounts,
  variant,
  versionId,
}) => {
  const { sendEvent } = useVersionAnalytics(versionId);
  const { search } = useLocation();
  const queryParams = parseQueryString(search);

  const versionRouteParams = {
    sorts: queryParams.sorts,
    page: 0,
    variant: applyStrictRegex(variant),
  };

  const callBack = (taskSquareStatuses: string[]) => () => {
    sendEvent({
      name: "Click Grouped Task Square",
      taskSquareStatuses,
    });
  };

  const areAnyVariantsSelected = !!queryParams.variant;
  const { stats } = groupStatusesByUmbrellaStatus(statusCounts ?? []);

  return (
    <div data-cy="patch-build-variant">
      <StyledRouterLink
        css={wordBreakCss}
        to={getVersionRoute(versionId, {
          ...versionRouteParams,
        })}
        onClick={() =>
          sendEvent({
            name: "Click Build Variant Grid Link",
          })
        }
        data-cy="build-variant-display-name"
      >
        {displayName}
      </StyledRouterLink>

      <TaskBadgeContainer>
        {stats.map(
          ({ umbrellaStatus, count, statusCounts: groupedStatusCounts }) => (
            <GroupedTaskStatusBadge
              key={`${versionId}_${variant}_${umbrellaStatus}`}
              count={count}
              onClick={callBack(Object.keys(groupedStatusCounts))}
              queryParamsToPreserve={versionRouteParams}
              status={umbrellaStatus}
              statusCounts={groupedStatusCounts}
              versionId={versionId}
              isVariantActive={
                !areAnyVariantsSelected ||
                queryParams.variant === applyStrictRegex(variant)
              }
            />
          )
        )}
      </TaskBadgeContainer>
    </div>
  );
};

const TaskBadgeContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: ${size.xs};
  margin-top: ${size.xs};
  margin-bottom: ${size.xs};
`;

export default VariantTaskGroup;
