import { diff } from "deep-object-diff";
import isEqual from "lodash.isequal";
import { EditSpawnHostMutationVariables } from "gql/generated/types";

export const computeDiff = (
  initialState: EditSpawnHostMutationVariables,
  currEditState: EditSpawnHostMutationVariables,
): [boolean, EditSpawnHostMutationVariables] => {
  const hasChanges = !isEqual(initialState, currEditState);

  const mutationParams = diff(
    initialState,
    currEditState,
  ) as EditSpawnHostMutationVariables;

  // diff changes the format of these array fields, so we need to reformat them to be correct.
  if (mutationParams.addedInstanceTags) {
    mutationParams.addedInstanceTags = Object.values(
      mutationParams.addedInstanceTags,
    );
  }
  if (mutationParams.deletedInstanceTags) {
    mutationParams.deletedInstanceTags = Object.values(
      mutationParams.deletedInstanceTags,
    );
  }

  return [hasChanges, mutationParams];
};
