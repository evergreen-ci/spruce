import { FormDataProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  ProjectSettingsInput,
  ProjectSettingsQuery,
  RepoSettingsQuery,
} from "gql/generated/types";
import * as access from "./AccessTab/types";
import * as general from "./GeneralTab/types";
import * as githubCommitQueue from "./GithubCommitQueueTab/types";
import * as notifications from "./NotificationsTab/types";
import * as plugins from "./PluginsTab/types";
import { ProjectType } from "./utils";
import * as variables from "./VariablesTab/types";

export type FormStateMap = {
  [ProjectSettingsTabRoutes.General]: general.FormState;
};

export type TabDataProps = {
  [ProjectSettingsTabRoutes.General]: {
    projectData: general.TabProps["projectData"];
    repoData: general.TabProps["repoData"];
  };
  [ProjectSettingsTabRoutes.Access]: {
    projectData: access.TabProps["projectData"];
    repoData: access.TabProps["repoData"];
  };
  [ProjectSettingsTabRoutes.Plugins]: {
    projectData: plugins.TabProps["projectData"];
    repoData: plugins.TabProps["repoData"];
  };
  [ProjectSettingsTabRoutes.Variables]: {
    projectData: variables.TabProps["projectData"];
    repoData: variables.TabProps["repoData"];
  };
  [ProjectSettingsTabRoutes.GithubCommitQueue]: {
    projectData: githubCommitQueue.TabProps["projectData"];
    repoData: githubCommitQueue.TabProps["repoData"];
  };
  [ProjectSettingsTabRoutes.Notifications]: {
    projectData: notifications.TabProps["projectData"];
    repoData: notifications.TabProps["repoData"];
  };
};

export type GqlToFormFunction<T = FormDataProps> = (
  data:
    | ProjectSettingsQuery["projectSettings"]
    | RepoSettingsQuery["repoSettings"],
  options?: { projectType?: ProjectType }
) => T;

export type FormToGqlFunction = (
  form: FormDataProps,
  id: string
) => Partial<ProjectSettingsInput>;

export const readOnlyTabs = [ProjectSettingsTabRoutes.EventLog] as const;

type ReadOnlyTabs = typeof readOnlyTabs[number];

export type WritableTabRoutes = Exclude<ProjectSettingsTabRoutes, ReadOnlyTabs>;
