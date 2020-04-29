import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { GET_PATCH_BUILD_VARIANTS } from "gql/queries/get-patch-build-variants";
import {
  PatchBuildVariantsQuery,
  PatchBuildVariantsQueryVariables,
} from "gql/generated/types";
import { SiderCard } from "components/styles";
import { Divider } from "components/styles/Divider";
import { Skeleton } from "antd";
import { TaskSquare } from "./buildVariants/TaskSquare";
import { H3, P1 } from "components/Typography";
import styled from "@emotion/styled/macro";
import every from "lodash/every";
import { TaskStatus } from "types/task";
import get from "lodash/get";

export const BuildVariants: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error, stopPolling } = useQuery<
    PatchBuildVariantsQuery,
    PatchBuildVariantsQueryVariables
  >(GET_PATCH_BUILD_VARIANTS, {
    variables: { patchId: id },
    pollInterval: 2000,
  });
  useEffect(() => stopPolling, []);
  const buildVariants = get(data, "patchBuildVariants", []);
  if (data && allTasksHaveFinished(buildVariants)) {
    stopPolling();
  }
  return (
    <SiderCard>
      <H3>Build Variants</H3>
      <Divider />
      {error ? (
        <div>{error.message}</div>
      ) : loading ? (
        <Skeleton active={true} title={false} paragraph={{ rows: 4 }} />
      ) : (
        data.patchBuildVariants.map(({ variant, tasks }) => (
          <BuildVariant key={variant} className="patch-build-variant">
            <P1>{variant}</P1>
            <VariantTasks>
              {tasks.map((task) => (
                <TaskSquare key={task.id} {...task} />
              ))}
            </VariantTasks>
          </BuildVariant>
        ))
      )}
    </SiderCard>
  );
};

const allTasksHaveFinished = (
  buildVariants: PatchBuildVariantsQuery["patchBuildVariants"]
) =>
  every(buildVariants, ({ tasks }) =>
    every(
      tasks,
      ({ status }) =>
        status !== TaskStatus.Started &&
        status !== TaskStatus.Dispatched &&
        status !== TaskStatus.Undispatched
    )
  );

const BuildVariant = styled.div`
  margin-bottom: 8px;
`;
const VariantTasks = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
