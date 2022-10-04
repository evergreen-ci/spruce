import { GetSpawnTaskQuery } from "gql/generated/types";

export const validateTask = (taskData: GetSpawnTaskQuery["task"]) => {
  const {
    displayName: taskDisplayName,
    buildVariant,
    revision,
  } = taskData || {};
  return taskDisplayName && buildVariant && revision;
};
