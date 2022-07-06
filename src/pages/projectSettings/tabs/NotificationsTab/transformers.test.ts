import { ProjectSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { formToGql, gqlToForm } from "./transformers";

import { FormState } from "./types";

const { projectBase } = data;

describe("project data", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(projectBase)).toStrictEqual(projectForm);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(projectForm, "project")).toStrictEqual(projectResult);
    projectForm.subscriptions = [
      {
        subscriptionData: {
          event: {
            extraFields: {
              requester: "gitter_request",
            },
            eventSelect: "any-version-finishes",
          },
          notification: {
            notificationSelect: "jira-comment",
            jiraCommentInput: "evg-123",
          },
        },
        subscriberData: {},
      },
    ];
    projectResult.subscriptions = [
      {
        owner_type: "person",
        regex_selectors: [],
        resource_type: "VERSION",
        selectors: [
          {
            type: "object",
            data: "version",
          },
          {
            type: "id",
            data: "project",
          },
        ],
        subscriber: {
          type: "jira-comment",
          target: "evg-123",
        },
        trigger: "outcome",
        trigger_data: {
          requester: "gitter_request",
        },
      },
    ];
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

const projectResult: ProjectSettingsInput = {
  projectRef: {
    id: "project",
    notifyOnBuildFailure: null,
  },
  subscriptions: [],
};
