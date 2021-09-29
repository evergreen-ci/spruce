import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Skeleton } from "antd";
import { useParams, Link } from "react-router-dom";
import { usePatchAnalytics } from "analytics";
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

export const BuildVariants: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const patchAnalytics = usePatchAnalytics();

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
                  patchAnalytics.sendEvent({
                    name: "Click Build Variant Grid Link",
                  })
                }
              >
                {displayName}
              </Link>
            </P1>
            <VariantTaskGroup variant={variant} tasks={tasks} />
          </BuildVariant>
        ))}
      </SiderCard>
    </>
  );
};

interface VariantTaskGroupProps {
  tasks: { status: string }[];
  variant: string;
}
const VariantTaskGroup: React.FC<VariantTaskGroupProps> = ({
  tasks,
  variant,
}) => {
  const groupedTasks = groupTasksByUmbrellaStatus(tasks);
  return (
    <VariantTasks>
      {Object.values(groupedTasks).map(
        ({ textColor, fill, statuses, count }) => (
          <GroupedTaskSquare
            key={`${variant}_${fill}`}
            statuses={statuses}
            count={count}
            color={fill}
            textColor={textColor}
            variant={variant}
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
