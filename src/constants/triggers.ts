export enum ResourceType {
  TASK = "TASK",
  VERSION = "VERSION",
  BUILD = "BUILD",
}

type PayloadResourceIdKey = "in-version" | "in-build" | "id";
export interface Trigger {
  trigger: string;
  label: string;
  extraFields?: ExtraField[];
  resourceType: ResourceType;
  payloadResourceIdKey?: PayloadResourceIdKey;
  regexSelectors?: RegexSelector[];
}

export const buildRegexSelectors: RegexSelector[] = [
  {
    type: "display-name",
    typeLabel: "Build Variant Name",
  },
  {
    type: "build-variant",
    typeLabel: "Build Variant ID",
  },
];

export const taskRegexSelectors: RegexSelector[] = [
  {
    type: "display-name",
    typeLabel: "Task Name",
  },
  {
    type: "build-variant",
    typeLabel: "Build Variant Name",
  },
];

export interface ExtraField {
  text: string;
  key: string;
  type?: string;
  options?: StringMap;
  default?: string;
  validator?: (v: any) => string;
  dataCy?: string;
}

export type RegexSelectorType = "display-name" | "build-variant";
export interface RegexSelector {
  type: RegexSelectorType;
  typeLabel: string;
}

export const failureTypeSubscriberConfig = {
  text: "Failure type",
  key: "failure-type",
  type: "select",
  options: {
    any: "Any",
    test: "Test",
    system: "System",
    setup: "Setup",
  },
  default: "any",
};

export const requesterSubscriberConfig = {
  text: "Build initiator",
  key: "requester",
  type: "select",
  options: {
    gitter_request: "Commit",
    patch_request: "Patch",
    github_pull_request: "Pull Request",
    merge_test: "Commit Queue",
    ad_hoc: "Periodic Build",
  },
  default: "gitter_request",
};

export const clearExtraFieldsInputCb = (accum: StringMap, eF: ExtraField) => ({
  ...accum,
  [eF.key]: "10",
});

interface StringMap {
  [index: string]: string;
}
