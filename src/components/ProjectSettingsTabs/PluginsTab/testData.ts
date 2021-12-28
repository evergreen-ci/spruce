import {
  ProjectPluginsSettingsFragment,
  ProjectSettingsInput,
  RepoPluginsSettingsFragment,
  RepoSettingsInput,
} from "gql/generated/types";
import { FormState } from "./types";

const repoGqlBase = {
  id: "123",
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
};

const repoGqlInput: {
  [projectRef: string]: {
    id: string;
  } & RepoPluginsSettingsFragment;
} = {
  projectRef: {
    ...repoGqlBase,
  },
};

const repoGqlResult: Partial<RepoSettingsInput> = {
  projectRef: {
    ...repoGqlBase,
  },
};

const repoFormData: FormState = {
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

const projectGqlBase = {
  id: "456",

  perfEnabled: null,
  buildBaronSettings: {
    ticketCreateProject: null,
    ticketSearchProjects: [],
  },
  taskAnnotationSettings: {
    jiraCustomFields: [],
    fileTicketWebhook: {
      endpoint: null,
      secret: null,
    },
  },
};

const projectGqlInput: {
  [projectRef: string]: {
    id: string;
  } & ProjectPluginsSettingsFragment;
} = {
  projectRef: {
    ...projectGqlBase,
  },
};

const projectGqlResult: Partial<ProjectSettingsInput> = {
  projectRef: {
    ...projectGqlBase,
  },
};

const projectFormData: FormState = {
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

const data = {
  project: {
    gql: {
      input: projectGqlInput,
      result: projectGqlResult,
    },
    form: projectFormData,
  },
  repo: {
    gql: {
      input: repoGqlInput,
      result: repoGqlResult,
    },
    form: repoFormData,
  },
};

export { data };
