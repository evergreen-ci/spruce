import { FormDataProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  ProjectSettingsInput,
  ProjectSettingsQuery,
  RepoSettingsQuery,
} from "gql/generated/types";
import * as access from "./AccessTab/types";
import * as general from "./GeneralTab/types";

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
};

export type GqlToFormFunction = (
  data:
    | ProjectSettingsQuery["projectSettings"]
    | RepoSettingsQuery["repoSettings"]
) => FormDataProps;

export type FormToGqlFunction = (
  form: FormDataProps,
  id: string,
  options?: {
    useRepoSettings?: boolean;
  }
) => Partial<ProjectSettingsInput>;

export const readOnlyTabs = [ProjectSettingsTabRoutes.EventLog] as const;

type ReadOnlyTabs = typeof readOnlyTabs[number];

export type WritableTabRoutes = Exclude<ProjectSettingsTabRoutes, ReadOnlyTabs>;
