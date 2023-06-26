import { ConfigurePatchQuery } from "gql/generated/types";
import { Unpacked } from "types/utils";

// Extract the type of a child patch and append alias field
export interface ChildPatchAliased
  extends Unpacked<ConfigurePatchQuery["patch"]["childPatches"]> {
  alias: string;
}

export type PatchTriggerAlias = Unpacked<
  ConfigurePatchQuery["patch"]["patchTriggerAliases"]
>;

export type AliasState = {
  [alias: string]: boolean;
};
export type TasksState = {
  [task: string]: boolean;
};
export type VariantTasksState = {
  [variant: string]: TasksState;
};
