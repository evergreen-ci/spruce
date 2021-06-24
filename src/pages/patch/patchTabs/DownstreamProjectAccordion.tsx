import React from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Skeleton } from "antd";
import { Accordion } from "components/Accordion";
import { PatchStatusBadge } from "components/PatchStatusBadge";
import { useToastContext } from "context/toast";
import { PatchTasksQuery, PatchTasksQueryVariables } from "gql/generated/types";
import { GET_PATCH_TASKS } from "gql/queries";
import { useNetworkStatus } from "hooks";
import { PatchTasksTable } from "./tasks/PatchTasksTable";

interface DownstreamProjectAccordionProps {
  projectName: string;
  status: string;
  taskCount: number;
  childPatchId: string;
}
export const DownstreamProjectAccordion: React.FC<DownstreamProjectAccordionProps> = ({
  projectName,
  childPatchId,
  status,
}) => {
  const dispatchToast = useToastContext();

  const { data, startPolling, stopPolling } = useQuery<
    PatchTasksQuery,
    PatchTasksQueryVariables
  >(GET_PATCH_TASKS, {
    variables: {
      patchId: childPatchId,
    },
    fetchPolicy: "cache-and-network",
    onError: (err) => {
      dispatchToast.error(`Error fetching downstream tasks ${err}`);
    },
  });
  let showSkeleton = true;
  if (data) {
    showSkeleton = false;
  }
  useNetworkStatus(startPolling, stopPolling);
  const { patchTasks } = data || {};

  const variantTitle = (
    <>
      <ProjectTitleWrapper>
        <span data-cy="page-title">{projectName}</span>
      </ProjectTitleWrapper>
      <PatchStatusBadge status={status} />
    </>
  );
  return (
    <AccordionWrapper data-cy="variant-Accordion">
      <Accordion
        title={variantTitle}
        contents={
          <TableWrapper>
            {/* todo: add pagination and filtering  */}
            {showSkeleton ? (
              <Skeleton active title={false} paragraph={{ rows: 8 }} />
            ) : (
              <PatchTasksTable sorts={[]} patchTasks={patchTasks} />
            )}
          </TableWrapper>
        }
      />
    </AccordionWrapper>
  );
};

const AccordionWrapper = styled.div`
  padding-bottom: 12px;
  padding-top: 12px;
`;

const ProjectTitleWrapper = styled.div`
  margin-right: 10px;
  font-weight: bold;
`;

const TableWrapper = styled.div`
  padding-bottom: 15px;
  padding-top: 15px;
`;
