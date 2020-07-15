import React, { useEffect } from "react";
import { Skeleton } from "antd";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { GET_PATCH_BUILD_VARIANTS } from "gql/queries/get-patch-build-variants";
import {
  PatchBuildVariantsQuery,
  PatchBuildVariantsQueryVariables,
} from "gql/generated/types";
import { SiderCard } from "components/styles";
import { Divider } from "components/styles/Divider";
import { pollInterval } from "constants/index";
import { H3, P1 } from "components/Typography";
import styled from "@emotion/styled/macro";
import { usePollMonitor } from "hooks";
import { TaskSquare } from "./buildVariants/TaskSquare";

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
  usePollMonitor(startPolling, stopPolling);
  return (
    <SiderCard>
      <H3>Build Variants</H3>
      <Divider />
      {error && !loading && <div>{error.message}</div>}{" "}
      {loading && !error && (
        <Skeleton active title={false} paragraph={{ rows: 4 }} />
      )}
      {data &&
        !error &&
        !loading &&
        data.patchBuildVariants.map(({ displayName, tasks }) => (
          <BuildVariant key={displayName} className="patch-build-variant">
            <P1>{displayName}</P1>
            <VariantTasks>
              {tasks.map((task) => (
                <TaskSquare key={task.id} {...task} />
              ))}
            </VariantTasks>
          </BuildVariant>
        ))}
    </SiderCard>
  );
};

const BuildVariant = styled.div`
  margin-bottom: 8px;
`;
const VariantTasks = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
