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
        owner_type: "project",
        regex_selectors: [],
        resource_type: "VERSION",
        selectors: [
          {
            type: "project",
            data: "version",
          },
          {
            type: "requester",
            data: "gitter_request",
          },
        ],
        subscriber: {
          type: "jira-comment",
          target: "evg-123",
          jiraIssueSubscriber: undefined,
          webhookSubscriber: undefined,
        },
        trigger: "outcome",
        trigger_data: {
          requester: "gitter_request",
        },
      },
    ];
    expect(formToGql(projectForm, "project")).toStrictEqual(projectResult);
  });
  it("handles jira issue subscriptions", () => {
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
            notificationSelect: "jira-issue",
            jiraIssueInput: {
              issueInput: "Bug",
              projectInput: "EVG",
            },
          },
        },
        subscriberData: {},
      },
    ];
    projectResult.subscriptions = [
      {
        owner_type: "project",
        regex_selectors: [],
        resource_type: "VERSION",
        selectors: [
          {
            type: "project",
            data: "version",
          },
          {
            type: "requester",
            data: "gitter_request",
          },
        ],
        subscriber: {
          type: "jira-issue",
          target: "EVG",
          jiraIssueSubscriber: {
            issueType: "Bug",
            project: "EVG",
          },
          webhookSubscriber: undefined,
        },
        trigger: "outcome",
        trigger_data: {
          requester: "gitter_request",
        },
      },
    ];
    expect(formToGql(projectForm, "project")).toStrictEqual(projectResult);
  });
  it("handles webhook subscriptions", () => {
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
            notificationSelect: "evergreen-webhook",
            webhookInput: {
              urlInput: "https://example.com",
              secretInput: "",
              httpHeaders: [
                {
                  keyInput: "Content-Type",
                  valueInput: "application/json",
                },
              ],
            },
          },
        },
        subscriberData: {},
      },
    ];
    projectResult.subscriptions = [
      {
        owner_type: "project",
        regex_selectors: [],
        resource_type: "VERSION",
        selectors: [
          {
            type: "project",
            data: "version",
          },
          {
            type: "requester",
            data: "gitter_request",
          },
        ],
        subscriber: {
          type: "evergreen-webhook",
          target: "https://example.com",
          jiraIssueSubscriber: undefined,
          webhookSubscriber: {
            url: "https://example.com",
            secret: "",
            headers: [
              {
                key: "Content-Type",
                value: "application/json",
              },
            ],
          },
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
