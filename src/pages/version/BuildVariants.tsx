import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Skeleton } from "antd";
import { useParams, Link } from "react-router-dom";
import { usePatchAnalytics, useVersionAnalytics } from "analytics";
import { SiderCard } from "components/styles";
import { Divider } from "components/styles/Divider";
import { H3, P1 } from "components/Typography";
import { pollInterval } from "constants/index";
import { getVersionRoute } from "constants/routes";
import {
  BuildVariantsQuery,
  BuildVariantsQueryVariables,
} from "gql/generated/types";
import { GET_BUILD_VARIANTS } from "gql/queries";
import { useNetworkStatus } from "hooks";
import { applyStrictRegex } from "utils/string";
import { GroupedTaskSquare } from "./buildVariants/GroupedTaskSquare";
import { groupTasksByUmbrellaStatus } from "./buildVariants/utils";

interface BuildVariantsProps {
  isPatch: boolean;
}

export const BuildVariants: React.FC<BuildVariantsProps> = ({ isPatch }) => {
  const { id } = useParams<{ id: string }>();
  const { sendEvent } = (isPatch ? usePatchAnalytics : useVersionAnalytics)();

  const { data, loading, error, startPolling, stopPolling } = useQuery<
    BuildVariantsQuery,
    BuildVariantsQueryVariables
  >(GET_BUILD_VARIANTS, {
    variables: { id },
    pollInterval,
  });
  useNetworkStatus(startPolling, stopPolling);
  const { version } = data || {};

  return (
    <>
      {/* @ts-expect-error */}
      <SiderCard>
        <H3>Build Variants</H3>
        <Divider />
        {error && <div>{error.message}</div>}{" "}
        {loading && <Skeleton active title={false} paragraph={{ rows: 4 }} />}
        {version?.buildVariants?.map(({ displayName, tasks, variant }) => (
          <BuildVariant
            key={`buildVariant_${displayName}_${tasks.length}`}
            data-cy="patch-build-variant"
          >
            <P1>
              <Link
                to={`${getVersionRoute(id, {
                  page: 0,
                  variant: applyStrictRegex(variant),
                })}`}
                onClick={() =>
                  sendEvent({
                    name: "Click Build Variant Grid Link",
                  })
                }
              >
                {displayName}
              </Link>
            </P1>
            <VariantTaskGroup
              variant={variant}
              tasks={tasks}
              isPatch={isPatch}
            />
          </BuildVariant>
        ))}
      </SiderCard>
    </>
  );
};

interface VariantTaskGroupProps {
  tasks: { status: string }[];
  variant: string;
  isPatch: boolean;
}
const VariantTaskGroup: React.FC<VariantTaskGroupProps> = ({
  tasks,
  variant,
  isPatch,
}) => {
  const groupedTasks = groupTasksByUmbrellaStatus(tasks);
  return (
    <VariantTasks>
      {Object.entries(groupedTasks).map(
        ([umbrellaStatus, { statuses, count }]) => (
          <GroupedTaskSquare
            key={`${variant}_${umbrellaStatus}`}
            statuses={statuses}
            count={count}
            variant={variant}
            umbrellaStatus={umbrellaStatus}
            isPatch={isPatch}
          />
        )
      )}
    </VariantTasks>
  );
};

const BuildVariant = styled.div`
  margin-bottom: 8px;
`;
const VariantTasks = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
