import { ProjectSettingsInput, RepoSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { formToGql, gqlToForm } from "./transformers";

import { PluginsFormState } from "./types";

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

const projectForm: PluginsFormState = {
  buildBaronSettings: {
    fileTicketWebhook: {
      endpoint: null,
      secret: null,
    },
    taskAnnotationSettings: {
      jiraCustomFields: [],
    },
    ticketCreateProject: {
      createProject: null,
    },
    ticketSearchProjects: [],
    useBuildBaron: false,
  },
  externalLinks: {
    metadataPanelLink: {
      displayName: "a link display name",
      requesters: ["gitter_request", "patch_request"],
      urlTemplate: "https:/a-link-template-{version_id}.com",
    },
  },
  performanceSettings: {
    perfEnabled: true,
  },
};

const projectResult: Pick<ProjectSettingsInput, "projectRef"> = {
  projectRef: {
    externalLinks: [
      {
        displayName: "a link display name",
        requesters: ["gitter_request", "patch_request"],
        urlTemplate: "https:/a-link-template-{version_id}.com",
      },
    ],
    id: "project",
    perfEnabled: true,
    taskAnnotationSettings: {
      fileTicketWebhook: {
        endpoint: null,
        secret: null,
      },
      jiraCustomFields: [],
    },
  },
};

const repoForm: PluginsFormState = {
  buildBaronSettings: {
    fileTicketWebhook: {
      endpoint: "endpoint",
      secret: "secret",
    },
    taskAnnotationSettings: {
      jiraCustomFields: [
        {
          displayText: "Custom Field",
          field: "customField",
        },
      ],
    },
    ticketCreateProject: {
      createProject: "EVG",
    },
    ticketSearchProjects: [
      {
        searchProject: "EVG",
      },
    ],
    useBuildBaron: false,
  },
  externalLinks: {
    metadataPanelLink: {
      displayName: "a link display name",
      requesters: ["gitter_request", "patch_request"],
      urlTemplate: "https:/a-link-template-{version_id}.com",
    },
  },
  performanceSettings: {
    perfEnabled: true,
  },
};

const repoResult: Pick<RepoSettingsInput, "projectRef"> = {
  projectRef: {
    externalLinks: [
      {
        displayName: "a link display name",
        requesters: ["gitter_request", "patch_request"],
        urlTemplate: "https:/a-link-template-{version_id}.com",
      },
    ],
    id: "repo",
    perfEnabled: true,
    taskAnnotationSettings: {
      fileTicketWebhook: {
        endpoint: "endpoint",
        secret: "secret",
      },
      jiraCustomFields: [
        {
          displayText: "Custom Field",
          field: "customField",
        },
      ],
    },
  },
};
