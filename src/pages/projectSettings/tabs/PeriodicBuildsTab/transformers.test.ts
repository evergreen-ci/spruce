import { ProjectSettingsInput, RepoSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { ProjectType } from "../utils";
import { formToGql, gqlToForm } from "./transformers";
import { PeriodicBuildsFormState, IntervalSpecifier } from "./types";

const { projectBase, repoBase } = data;

describe("project data", () => {
  it("correctly converts from GQL to a form", () => {
    expect(
      gqlToForm(projectBase, { projectType: ProjectType.AttachedProject })
    ).toStrictEqual(projectForm);
  });

  it("correctly converts from a form to GQL and omits empty strings", () => {
    expect(formToGql(projectForm, "project")).toStrictEqual(projectResult);
  });
});

describe("repo data", () => {
  it("correctly converts from GQL to a form", () => {
    expect(
      gqlToForm(repoBase, { projectType: ProjectType.Repo })
    ).toStrictEqual(repoForm);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(repoForm, "repo")).toStrictEqual(repoResult);
  });
});

const projectForm: PeriodicBuildsFormState = {
  periodicBuilds: [],
  periodicBuildsOverride: true,
};

const projectResult: Pick<ProjectSettingsInput, "projectRef"> = {
  projectRef: {
    id: "project",
    periodicBuilds: [],
  },
};

const repoForm: PeriodicBuildsFormState = {
  periodicBuilds: [
    {
      alias: "",
      configFile: "evergreen.yml",
      displayTitle: "Every 24 hours",
      id: "123",
      interval: {
        cron: "",
        intervalHours: 24,
        specifier: IntervalSpecifier.Hours,
      },
      message: "",
      nextRunTime:
        "Wed Mar 30 2022 17:07:10 GMT+0000 (Coordinated Universal Time)",
    },
    {
      alias: "test",
      configFile: "evergreen.yml",
      displayTitle: "Build Message",
      id: "456",
      interval: {
        cron: "*/5 * * * *",
        intervalHours: null,
        specifier: IntervalSpecifier.Cron,
      },
      message: "Build Message",
      nextRunTime:
        "Wed Mar 30 2022 17:07:10 GMT+0000 (Coordinated Universal Time)",
    },
  ],
  periodicBuildsOverride: true,
};

const repoResult: Pick<RepoSettingsInput, "projectRef"> = {
  projectRef: {
    id: "repo",
    periodicBuilds: [
      {
        alias: "",
        configFile: "evergreen.yml",
        cron: "",
        id: "123",
        intervalHours: 24,
        message: "",
        nextRunTime: new Date("2022-03-30T17:07:10.000Z"),
      },
      {
        alias: "test",
        configFile: "evergreen.yml",
        cron: "*/5 * * * *",
        id: "456",
        intervalHours: 0,
        message: "Build Message",
        nextRunTime: new Date("2022-03-30T17:07:10.000Z"),
      },
    ],
  },
};
