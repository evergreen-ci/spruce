import { FormDataProps } from "components/SpruceForm";
import {
  ProjectGeneralSettingsFragment,
  RepoGeneralSettingsFragment,
} from "gql/generated/types";

export interface FormState extends FormDataProps {
  generalConfiguration: {
    enabled: boolean | null;
    repositoryInfo: {
      owner: string;
      repo: string;
    };
    branch: string;
    other: {
      displayName: string;
      batchTime: number;
      remotePath: string;
      spawnHostScriptPath: string;
    };
  };
  projectFlags: {
    dispatchingDisabled: boolean | null;
    scheduling: {
      deactivatePrevious: boolean | null;
    };
    repotracker: {
      repotrackerDisabled: boolean | null;
    };
    logger: {
      defaultLogger: string;
    };
    testResults: {
      cedarTestResultsEnabled: boolean | null;
    };
    patch: {
      patchingDisabled: boolean | null;
    };
    taskSync: {
      configEnabled: boolean | null;
      patchEnabled: boolean | null;
    };
  };
  historicalDataCaching: {
    disabledStatsCache: boolean | null;
    files: {
      filesIgnoredFromCache: Array<{
        filePattern: string;
      }> | null;
    };
  };
}

export type TabProps = {
  projectData?: ProjectGeneralSettingsFragment;
  projectId?: string;
  repoData?: RepoGeneralSettingsFragment;
  useRepoSettings: boolean;
};
