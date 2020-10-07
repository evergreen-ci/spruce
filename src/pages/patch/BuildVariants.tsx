import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Skeleton } from "antd";
import { useParams, Link } from "react-router-dom";
import { SiderCard } from "components/styles";
import { Divider } from "components/styles/Divider";
import { H3, P1 } from "components/Typography";
import { pollInterval } from "constants/index";
import { getVersionRoute } from "constants/routes";
import {
  PatchBuildVariantsQuery,
  PatchBuildVariantsQueryVariables,
  PatchBuildVariantTask,
} from "gql/generated/types";
import { GET_PATCH_BUILD_VARIANTS } from "gql/queries/get-patch-build-variants";
import { useNetworkStatus } from "hooks";
import { GroupedTaskSquare } from "pages/patch/buildVariants/GroupedTaskSquare";

export const BuildVariants: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error, startPolling, stopPolling } = useQuery<
    PatchBuildVariantsQuery,
    PatchBuildVariantsQueryVariables
  >(GET_PATCH_BUILD_VARIANTS, {
    variables: { patchId: id },
    pollInterval,
  });
  useEffect(() => stopPolling, [stopPolling]);
  useNetworkStatus(startPolling, stopPolling);

  return (
    <SiderCard>
      <H3>Build Variants</H3>
      <Divider />
      {error && !loading && <div>{error.message}</div>}{" "}
      {loading && !error && (
        <Skeleton active title={false} paragraph={{ rows: 4 }} />
      )}
      {data &&
        data.patchBuildVariants.map(({ displayName, tasks, variant }) => (
          <BuildVariant
            key={`buildVariant_${displayName}`}
            data-cy="patch-build-variant"
          >
            <P1>
              <Link to={`${getVersionRoute(id)}?page=0&variant=${variant}`}>
                {displayName}
              </Link>
            </P1>
            <VariantTaskGroup variant={variant} tasks={tasks} />
          </BuildVariant>
        ))}
    </SiderCard>
  );
};

interface VariantTaskGroupProps {
  tasks: PatchBuildVariantTask[];
  variant: string;
}
const VariantTaskGroup: React.FC<VariantTaskGroupProps> = ({
  tasks,
  variant,
}) => {
  const groupedTasks = groupTasksByStatus(tasks);
  return (
    <VariantTasks>
      {Object.keys(groupedTasks).map((status) => (
        <GroupedTaskSquare
          key={`${variant}_${status}`}
          status={status}
          count={groupedTasks[status]}
        />
      ))}
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

const groupTasksByStatus = (tasks: PatchBuildVariantTask[]) => {
  const statuses = {};
  tasks.forEach((task) => {
    if (statuses[task.status]) {
      statuses[task.status] += 1;
    } else {
      statuses[task.status] = 1;
    }
  });
  return statuses;
};
