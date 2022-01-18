import { ProjectSettingsInput, RepoSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { formToGql, gqlToForm } from "./transformers";

import { FormState } from "./types";

const { projectBase, repoBase } = data;

describe("repo data", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(repoBase)).toStrictEqual(repoForm);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(repoForm, "repo")).toStrictEqual(repoResult);
  });
});

describe("project data", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(projectBase)).toStrictEqual(projectForm);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(projectForm, "project")).toStrictEqual(projectResult);
  });
});

const projectForm: FormState = {
  performanceSettings: {
    perfEnabled: null,
  },
  buildBaronSettings: {
    ticketCreateProject: null,
    ticketSearchProjects: [],
    customTicket: true,
  },
  taskAnnotationSettings: {
    jiraCustomFields: [],
    fileTicketWebhook: {
      endpoint: null,
      secret: null,
    },
  },
};

const projectResult: Pick<ProjectSettingsInput, "projectRef"> = {
  projectRef: {
    id: "project",

    perfEnabled: null,
    buildBaronSettings: {
      ticketCreateProject: null,
      ticketSearchProjects: [],
    },
    taskAnnotationSettings: {
      jiraCustomFields: [],
      fileTicketWebhook: null,
    },
  },
};

const repoForm: FormState = {
  performanceSettings: {
    perfEnabled: true,
  },
  buildBaronSettings: {
    ticketSearchProjects: [
      {
        searchProject: "EVG",
      },
    ],
    ticketCreateProject: "EVG",
    customTicket: false,
  },
  taskAnnotationSettings: {
    fileTicketWebhook: {
      endpoint: "endpoint",
      secret: "secret",
    },

    jiraCustomFields: [
      {
        field: "customField",
        displayText: "Custom Field",
      },
    ],
  },
};

const repoResult: Pick<RepoSettingsInput, "projectRef"> = {
  projectRef: {
    id: "repo",
    perfEnabled: true,
    buildBaronSettings: {
      ticketCreateProject: "EVG",
      ticketSearchProjects: ["EVG"],
    },
    taskAnnotationSettings: {
      jiraCustomFields: [
        {
          field: "customField",
          displayText: "Custom Field",
        },
      ],
      fileTicketWebhook: {
        endpoint: "endpoint",
        secret: "secret",
      },
    },
  },
};
