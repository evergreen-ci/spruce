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

  const versionRouteParams = {
    sorts,
    page: 0,
    variant: applyStrictRegex(variant),
  };

  const callBack = (taskSquareStatuses: string[]) => () => {
    sendEvent({
      name: "Click Grouped Task Square",
      taskSquareStatuses,
    });
  };

  const areAnyVariantsSelected = !!variantSearch;
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
              isActive={
                !areAnyVariantsSelected ||
                (variantSearch === applyStrictRegex(variant) &&
                  isUmbrellaStatusSet(umbrellaStatus, statusSearch))
              }
            />
          )
        )}
      </TaskBadgeContainer>
    </div>
  );
};

const isUmbrellaStatusSet = (
  status: TaskStatus,
  activeStatusSearch: string[]
) => {
  console.log({
    activeStatusSearch,
    umbrellaStatus: mapUmbrellaStatusToQueryParam[status],
    diff: arraySymmetricDifference(
      mapUmbrellaStatusToQueryParam[status],
      activeStatusSearch
    ),
  });

  return (
    arraySymmetricDifference(
      mapUmbrellaStatusToQueryParam[status],
      activeStatusSearch
    ).length === 0
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