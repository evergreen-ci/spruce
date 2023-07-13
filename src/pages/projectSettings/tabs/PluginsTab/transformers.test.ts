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
  performanceSettings: {
    perfEnabled: true,
  },
  buildBaronSettings: {
    ticketCreateProject: {
      createProject: null,
    },
    ticketSearchProjects: [],
    useBuildBaron: false,
    taskAnnotationSettings: {
      jiraCustomFields: [],
    },
    fileTicketWebhook: {
      endpoint: null,
      secret: null,
    },
  },
  externalLinks: {
    patchMetadataPanelLink: {
      displayName: "a link display name",
      urlTemplate: "https:/a-link-template-{version_id}.com",
    },
  },
};

const projectResult: Pick<ProjectSettingsInput, "projectRef"> = {
  projectRef: {
    id: "project",
    perfEnabled: true,
    taskAnnotationSettings: {
      jiraCustomFields: [],
      fileTicketWebhook: {
        endpoint: null,
        secret: null,
      },
    },
    externalLinks: [
      {
        displayName: "a link display name",
        urlTemplate: "https:/a-link-template-{version_id}.com",
      },
    ],
  },
};

const repoForm: PluginsFormState = {
  performanceSettings: {
    perfEnabled: true,
  },
  buildBaronSettings: {
    ticketSearchProjects: [
      {
        searchProject: "EVG",
      },
    ],
    ticketCreateProject: {
      createProject: "EVG",
    },
    useBuildBaron: false,
    taskAnnotationSettings: {
      jiraCustomFields: [
        {
          field: "customField",
          displayText: "Custom Field",
        },
      ],
    },
    fileTicketWebhook: {
      endpoint: "endpoint",
      secret: "secret",
    },
  },
  externalLinks: {
    patchMetadataPanelLink: {
      displayName: "a link display name",
      urlTemplate: "https:/a-link-template-{version_id}.com",
    },
  },
};

const repoResult: Pick<RepoSettingsInput, "projectRef"> = {
  projectRef: {
    id: "repo",
    perfEnabled: true,
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
    externalLinks: [
      {
        displayName: "a link display name",
        urlTemplate: "https:/a-link-template-{version_id}.com",
      },
    ],
  },
};
