import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { TreeDataEntry } from "components/TreeSelect";
import { pollInterval } from "constants/index";
import { taskStatusesFilterTreeData } from "constants/task";
import {
  GetTaskStatusesQuery,
  GetTaskStatusesQueryVariables,
} from "gql/generated/types";
import { GET_TASK_STATUSES } from "gql/queries";
import { usePollForQueries } from "hooks";
import { getCurrentStatuses } from "utils/statuses";

interface UseTaskStatusesProps {
  versionId: string;
}

interface UseTaskStatusesResult {
  currentStatuses: TreeDataEntry[];
  baseStatuses: TreeDataEntry[];
}

export const useTaskStatuses = ({
  versionId,
}: UseTaskStatusesProps): UseTaskStatusesResult => {
  const { data, startPolling, stopPolling } = useQuery<
    GetTaskStatusesQuery,
    GetTaskStatusesQueryVariables
  >(GET_TASK_STATUSES, { variables: { id: versionId }, pollInterval });

  usePollForQueries(startPolling, stopPolling);

  const { version } = data || {};
  const { taskStatuses, baseTaskStatuses } = version || {};
  const currentStatuses = useMemo(
    () => getCurrentStatuses(taskStatuses ?? [], taskStatusesFilterTreeData),
    [taskStatuses]
  );
  const baseStatuses = useMemo(
    () =>
      getCurrentStatuses(baseTaskStatuses ?? [], taskStatusesFilterTreeData),
    [baseTaskStatuses]
  );

  return { currentStatuses, baseStatuses };
};
