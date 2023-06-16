import styled from "@emotion/styled";
import { useVersionAnalytics } from "analytics";
import { GroupedTaskStatusBadge } from "components/GroupedTaskStatusBadge";
import { wordBreakCss, StyledRouterLink } from "components/styles";
import { getVersionRoute } from "constants/routes";
import { mapUmbrellaStatusToQueryParam } from "constants/task";
import { size } from "constants/tokens";
import { StatusCount } from "gql/generated/types";
import { useQueryParam } from "hooks/useQueryParam";
import { PatchTasksQueryParams, TaskStatus } from "types/task";
import { string, statuses } from "utils";
import { arraySymmetricDifference } from "utils/array";

const { groupStatusesByUmbrellaStatus } = statuses;
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

  const [variantSearch] = useQueryParam<string | null>(
    PatchTasksQueryParams.Variant,
    undefined
  );
  const [sorts] = useQueryParam(PatchTasksQueryParams.Sorts, undefined);
  const [statusSearch] = useQueryParam<string[] | null>(
    PatchTasksQueryParams.Statuses,
    []
  );
  const hasStatusFilter = statusSearch.length > 0;
  const hasVariantFilter = variantSearch !== undefined;
  const isVariantSelected = variantSearch === applyStrictRegex(variant);
  const hasAnyStatusOrVariantFilters = hasVariantFilter || hasStatusFilter;

  const { stats } = groupStatusesByUmbrellaStatus(statusCounts ?? []);

  const versionRouteParams = {
    sorts,
    page: 0,
  };

  return (
    <div data-cy="patch-build-variant">
      <StyledRouterLink
        css={wordBreakCss}
        to={getVersionRoute(versionId, {
          ...versionRouteParams,
          variant: isVariantSelected ? undefined : applyStrictRegex(variant),
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
          ({ umbrellaStatus, count, statusCounts: groupedStatusCounts }) => {
            // If the variant is selected and there are no status filters, the badge should be active.
            // If the variant is selected and there are status filters, the badge should be active if the umbrella status is set.
            // If the variant is not selected, the badge should be active if the umbrella status is set.
            const isBadgeActive =
              (isVariantSelected && !hasStatusFilter) ||
              (isVariantSelected &&
                hasStatusFilter &&
                isUmbrellaStatusSet(umbrellaStatus, statusSearch));

            return (
              <GroupedTaskStatusBadge
                key={`${versionId}_${variant}_${umbrellaStatus}`}
                count={count}
                onClick={() => {
                  sendEvent({
                    name: "Click Grouped Task Square",
                    taskSquareStatuses: Object.keys(groupedStatusCounts),
                  });
                }}
                status={umbrellaStatus}
                statusCounts={groupedStatusCounts}
                // If the badge is active it should reset the page.
                href={getVersionRoute(
                  versionId,
                  isBadgeActive
                    ? { ...versionRouteParams }
                    : {
                        ...versionRouteParams,
                        variant: applyStrictRegex(variant),
                        statuses: mapUmbrellaStatusToQueryParam[umbrellaStatus],
                      }
                )}
                isActive={hasAnyStatusOrVariantFilters ? isBadgeActive : true}
              />
            );
          }
        )}
      </TaskBadgeContainer>
    </div>
  );
};

const isUmbrellaStatusSet = (
  status: TaskStatus,
  activeStatusSearch: string[]
) =>
  arraySymmetricDifference(
    mapUmbrellaStatusToQueryParam[status],
    activeStatusSearch
  ).length === 0;

const TaskBadgeContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: ${size.xs};
  margin-top: ${size.xs};
  margin-bottom: ${size.xs};
`;

export default VariantTaskGroup;
