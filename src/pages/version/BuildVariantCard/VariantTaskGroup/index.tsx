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
const VariantTaskGroup: React.FC<VariantTaskGroupProps> = ({
  displayName,
  statusCounts,
  variant,
  versionId,
}) => {
  const { sendEvent } = useVersionAnalytics(versionId);

  const [variantSearch] = useQueryParam<string | null>(
    PatchTasksQueryParams.Variant,
    undefined,
  );
  const [sorts] = useQueryParam(PatchTasksQueryParams.Sorts, undefined);
  const [statusSearch] = useQueryParam<string[] | null>(
    PatchTasksQueryParams.Statuses,
    [],
  );
  const hasStatusFilter = statusSearch.length > 0;
  const hasVariantFilter = variantSearch !== undefined;

  const isVariantSelected = variantSearch === applyStrictRegex(variant);

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
          ({ count, statusCounts: groupedStatusCounts, umbrellaStatus }) => {
            const hasStatusFilterForUmbrellaStatus = isUmbrellaStatusSet(
              umbrellaStatus,
              statusSearch,
            );
            // A badge is active if the variant is selected and the status is selected
            // or if the variant is selected and there are no status filters
            // or if there are no variant filters
            const isBadgeActive =
              (isVariantSelected && hasStatusFilterForUmbrellaStatus) ||
              (isVariantSelected && !hasStatusFilter) ||
              !hasVariantFilter;
            const shouldLinkToVariant = !(
              isBadgeActive && hasStatusFilterForUmbrellaStatus
            );
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
                  shouldLinkToVariant
                    ? {
                        ...versionRouteParams,
                        variant: applyStrictRegex(variant),
                        statuses: mapUmbrellaStatusToQueryParam[umbrellaStatus],
                      }
                    : { ...versionRouteParams },
                )}
                isActive={isBadgeActive}
              />
            );
          },
        )}
      </TaskBadgeContainer>
    </div>
  );
};

const isUmbrellaStatusSet = (
  status: TaskStatus,
  activeStatusSearch: string[],
) =>
  arraySymmetricDifference(
    mapUmbrellaStatusToQueryParam[status],
    activeStatusSearch,
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
