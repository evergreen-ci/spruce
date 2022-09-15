import { GetSpawnTaskQuery } from "gql/generated/types";

interface GetNoExpirationCheckboxTooltipCopyProps {
  disableExpirationCheckbox: boolean;
  isVolume: boolean;
  limit: number;
}
export const getNoExpirationCheckboxTooltipCopy = ({
  disableExpirationCheckbox,
  isVolume,
  limit,
}: GetNoExpirationCheckboxTooltipCopyProps) =>
  disableExpirationCheckbox
    ? `You have reached the max number of unexpirable ${
        isVolume ? `volumes` : `hosts`
      }  (${limit}). Toggle an existing ${
        isVolume ? "volume" : "host"
      } to expirable to enable this checkbox.`
    : undefined;

export const validateTask = (taskData: GetSpawnTaskQuery["task"]) => {
  const {
    displayName: taskDisplayName,
    buildVariant,
    revision,
  } = taskData || {};
  return taskDisplayName && buildVariant && revision;
};
