import { ProjectSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { formToGql, gqlToForm } from "./transformers";
import { FormState } from "./types";

const { projectBase } = data;

describe("project data", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(projectBase)).toStrictEqual(projectFormBase);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(projectFormBase, "spruce")).toStrictEqual(
      projectResultBase
    );
    const projectForm = {
      ...projectFormBase,
      subscriptions: [
        {
          subscriptionData: {
            id: "xyz",
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
        },
      ],
    };
    const projectResult = {
      ...projectResultBase,
      subscriptions: [
        {
          id: "xyz",
          owner_type: "project",
          regex_selectors: [],
          resource_type: "VERSION",
          selectors: [
            {
              type: "project",
              data: "spruce",
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
          trigger: "family-outcome",
          trigger_data: {
            requester: "gitter_request",
          },
        },
      ],
    };

    expect(formToGql(projectForm, "spruce")).toStrictEqual(projectResult);
  });
  it("handles jira issue subscriptions", () => {
    const projectForm = {
      ...projectFormBase,
      subscriptions: [
        {
          subscriptionData: {
            id: "abc",
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
        },
      ],
    };

    const projectResult = {
      ...projectResultBase,
      subscriptions: [
        {
          id: "abc",
          owner_type: "project",
          regex_selectors: [],
          resource_type: "VERSION",
          selectors: [
            {
              type: "project",
              data: "spruce",
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
          trigger: "family-outcome",
          trigger_data: {
            requester: "gitter_request",
          },
        },
      ],
    };
    expect(formToGql(projectForm, "spruce")).toStrictEqual(projectResult);
  });
  it("handles webhook subscriptions", () => {
    const projectForm = {
      ...projectFormBase,
      subscriptions: [
        {
          subscriptionData: {
            id: "def",
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
                secretInput: "webhook_secret",
                httpHeaders: [
                  {
                    keyInput: "Content-Type",
                    valueInput: "application/json",
                  },
                ],
                retryInput: 0,
                minDelayInput: 100,
                timeoutInput: 1000,
              },
            },
          },
        },
      ],
    };

    const projectResult = {
      ...projectResultBase,
      subscriptions: [
        {
          id: "def",
          owner_type: "project",
          regex_selectors: [],
          resource_type: "VERSION",
          selectors: [
            {
              type: "project",
              data: "spruce",
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
              secret: "webhook_secret",
              retries: 0,
              minDelayMs: 100,
              timeoutMs: 1000,
              headers: [
                {
                  key: "Content-Type",
                  value: "application/json",
                },
              ],
            },
          },
          trigger: "family-outcome",
          trigger_data: {
            requester: "gitter_request",
          },
        },
      ],
    };

    expect(formToGql(projectForm, "spruce")).toStrictEqual(projectResult);
  });
});

const projectFormBase: FormState = {
  buildBreakSettings: {
    notifyOnBuildFailure: null,
  },
  subscriptions: [],
};

const projectResultBase: ProjectSettingsInput = {
  projectRef: {
    id: "spruce",
    notifyOnBuildFailure: null,
  },
  subscriptions: [],
};
