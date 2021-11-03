import { GeneralSettingsFragment } from "gql/generated/types";

export type GeneralTabProps = {
  data: GeneralSettingsFragment;
  projectId: string;
  useRepoSettings: boolean;
};
