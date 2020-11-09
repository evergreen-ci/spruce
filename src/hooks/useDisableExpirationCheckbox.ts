import { MyHostsQuery, MyVolumesQuery } from "gql/generated/types";

interface Params {
  allItems:
    | (MyVolumesQuery["myVolumes"][0] | MyHostsQuery["myHosts"][0])[]
    | undefined;
  maxUnexpireable: number | undefined;
  targetItem?:
    | MyVolumesQuery["myVolumes"][0]
    | MyHostsQuery["myHosts"][0]
    | undefined;
}

export const useDisableExpirationCheckbox = ({
  allItems,
  maxUnexpireable,
  targetItem,
}: Params): boolean => {
  const currentUnexpireableCount = (allItems ?? []).reduce(
    (accum, currItem) => accum + (currItem.noExpiration ? 1 : 0),
    0
  );
  const maxReached = currentUnexpireableCount >= (maxUnexpireable ?? 0);
  // when the max number of unexpirable items is reached, only allow
  // toggling the "No Expiration" checkbox when it is already checked
  return targetItem ? maxReached && !targetItem.noExpiration : maxReached;
};
