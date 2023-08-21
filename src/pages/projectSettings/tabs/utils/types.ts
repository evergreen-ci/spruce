import { PatchStatus } from "types/patch";
/* Projects are assigned to one of the following project types in order to manage which elements should appear on the page.
 * A project is an attached project if it has an associated repoRefId.
 */
export enum ProjectType {
  AttachedProject,
  Project,
  Repo,
}

export const PatchTriggerAliasStatus = {
  "*": "Any completed status",
  [PatchStatus.LegacySucceeded]: "Success",
  [PatchStatus.Success]: "Success",
  [PatchStatus.Failed]: "Failure",
} as const;
