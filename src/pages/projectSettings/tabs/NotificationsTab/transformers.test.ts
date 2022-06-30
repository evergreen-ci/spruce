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
// todo: use in testing in future work EVG-16971
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sub = [
  {
    id: "subscription-1",
    resourceType: "repo",
    trigger: "build-failure",
    ownerType: "repo",
    triggerData: {
      repo: "repo",
      branch: "main",
    },
    selectors: [
      {
        type: "regex",
        data: "^[a-z]+$",
      },
    ],
    regexSelectors: [
      {
        type: "regex",
        data: "^[a-z]+$",
      },
    ],
    subscriber: {
      githubPRSubscriber: {
        repo: "repo",
        owner: "owner",
        prNumber: 1,
        ref: "ref",
      },
      githubCheckSubscriber: {
        repo: "repo",
        owner: "owner",
        ref: "ref",
      },
      webhookSubscriber: {
        url: "https://example.com",
        secret: "secret",
        headers: [
          {
            key: "key",
            value: "value",
          },
        ],
      },
      jiraIssueSubscriber: {
        project: "project",
        issueType: "issueType",
      },
      jiraCommentSubscriber: "jira-comment-subscriber-1",
      emailSubscriber: "email-subscriber-1",
      slackSubscriber: "slack-subscriber-1",
    },
  },
];

const projectForm: FormState = {
  buildBreakSettings: {
    notifyOnBuildFailure: null,
  },
  subscriptions: [],
};

const projectResult: Pick<ProjectSettingsInput, "projectRef"> = {
  projectRef: {
    id: "project",
    notifyOnBuildFailure: null,
  },
};

const repoForm: FormState = {
  buildBreakSettings: {
    notifyOnBuildFailure: false,
  },
  subscriptions: [],
};

const repoResult: Pick<RepoSettingsInput, "projectRef"> = {
  projectRef: {
    id: "repo",
    notifyOnBuildFailure: false,
  },
};
