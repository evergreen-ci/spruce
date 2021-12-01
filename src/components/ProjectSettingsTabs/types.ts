import { FormDataProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  ProjectSettingsInput,
  ProjectSettingsQuery,
  RepoSettingsQuery,
} from "gql/generated/types";
import { PartialRecord } from "types/utils";
import * as access from "./AccessTab";
import * as general from "./GeneralTab";

export type FormStateMap = {
  [ProjectSettingsTabRoutes.General]: general.FormState;
};

// TODO: Convert PartialRecord to Record once all tabs have been implemented.
export const formToGqlMap: PartialRecord<
  WritableTabRoutes,
  (form: FormDataProps, section: string) => Partial<ProjectSettingsInput>
> = {
  [ProjectSettingsTabRoutes.General]: general.formToGql,
  [ProjectSettingsTabRoutes.Access]: access.formToGql,
};

// TODO: Convert PartialRecord to Record once all tabs have been implemented.
export const gqlToFormMap: PartialRecord<
  WritableTabRoutes,
  (
    data:
      | ProjectSettingsQuery["projectSettings"]
      | RepoSettingsQuery["repoSettings"]
  ) => FormDataProps
> = {
  [ProjectSettingsTabRoutes.General]: general.gqlToForm,
  [ProjectSettingsTabRoutes.Access]: access.gqlToForm,
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

export const readOnlyTabs = [ProjectSettingsTabRoutes.EventLog] as const;

type ReadOnlyTabs = typeof readOnlyTabs[number];

export type WritableTabRoutes = Exclude<ProjectSettingsTabRoutes, ReadOnlyTabs>;
