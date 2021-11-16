import { FormDataProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectSettingsInput } from "gql/generated/types";
import { PartialRecord } from "types/utils";
import * as general from "./GeneralTab";

export type FormStateMap = {
  [ProjectSettingsTabRoutes.General]: general.FormState;
};

// TODO: Convert PartialRecord to Record once all tabs have been implemented.
export const TransformerMap: PartialRecord<
  WritableTabRoutes,
  (form: FormDataProps, section: string) => Partial<ProjectSettingsInput>
> = {
  [ProjectSettingsTabRoutes.General]: general.formToGql,
};

export type TabDataProps = {
  [ProjectSettingsTabRoutes.General]: {
    projectData: general.TabProps["projectData"];
    repoData: general.TabProps["repoData"];
  };
};

export const readOnlyTabs: ProjectSettingsTabRoutes[] = [
  ProjectSettingsTabRoutes.EventLog,
];

type ReadOnlyTabs = typeof readOnlyTabs[number];

export type WritableTabRoutes = Exclude<ProjectSettingsTabRoutes, ReadOnlyTabs>;
