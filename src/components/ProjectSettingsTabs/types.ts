import { ProjectSettingsQuery } from "gql/generated/types";

export type GeneralTabProps = {
  data: Pick<
    ProjectSettingsQuery["projectSettings"]["projectRef"],
    | "enabled"
    | "owner"
    | "repo"
    | "branch"
    | "displayName"
    | "batchTime"
    | "remotePath"
    | "spawnHostScriptPath"
  >;
  useRepoSettings: boolean;
};
