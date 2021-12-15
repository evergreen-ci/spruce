import {
  ProjectAccessSettingsFragment,
  ProjectSettingsInput,
  RepoAccessSettingsFragment,
  RepoSettingsInput,
} from "gql/generated/types";
import { FormState } from "./types";

const repoGqlBase = {
  id: "123",
  private: false,
  restricted: true,
  admins: ["admin"],
};

const repoGqlInput: {
  [projectRef: string]: {
    id: string;
  } & RepoAccessSettingsFragment;
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
  accessSettings: {
    private: false,
    restricted: true,
  },
  admin: {
    admins: [
      {
        username: "admin",
      },
    ],
  },
};

const projectGqlBase = {
  id: "456",
  private: null,
  restricted: true,
  admins: [],
};

const projectGqlInput: {
  [projectRef: string]: {
    id: string;
  } & ProjectAccessSettingsFragment;
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
  accessSettings: {
    private: null,
    restricted: true,
  },
  admin: {
    admins: [],
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
