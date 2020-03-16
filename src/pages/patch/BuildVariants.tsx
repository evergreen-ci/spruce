import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { SiderCard } from "components/styles";
import { Divider } from "components/styles/Divider";
import { Skeleton } from "antd";
import { TaskSquare } from "./buildVariants/TaskSquare";
import { H3, P1 } from "components/Typography";
import styled from "@emotion/styled/macro";

interface BuildVariantTask {
  id: string;
  name: string;
  status: string;
}
interface PatchBuildVariantTask {
  variant: string;
  tasks: [BuildVariantTask];
}
interface BuildVariantsQuery {
  patchBuildVariants: [PatchBuildVariantTask];
}

export const GET_PATCH_BUILD_VARIANTS = gql`
  query PatchBuildVariants($patchId: String!) {
    patchBuildVariants(patchId: $patchId) {
      variant
      tasks {
        id
        name
        status
      }
    }
  }
`;

export const BuildVariants: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<BuildVariantsQuery>(
    GET_PATCH_BUILD_VARIANTS,
    {
      variables: { patchId: id }
    }
  );
  return (
    <SiderCard>
      <H3>Build Variants</H3>
      <Divider />
      {error ? (
        <div>{error.message}</div>
      ) : loading ? (
        <Skeleton active={true} title={false} paragraph={{ rows: 4 }} />
      ) : (
        <>
          {data.patchBuildVariants.map(({ variant, tasks }) => (
            <div>
              <P1>{variant}</P1>
              <TasksWrapper>
                {tasks.map(task => (
                  <TaskSquare key={task.id} {...task} />
                ))}
              </TasksWrapper>
            </div>
          ))}
        </>
      )}
    </SiderCard>
  );
};

const TasksWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
