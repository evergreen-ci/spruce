import { getGqlPayload } from "./getGqlPayload";
import * as utils from "./utils";

describe("getGqlPayload", () => {
  it("should correctly format multiple subscriptions", () => {
    const payload = multipleSubscriptions.map(getGqlPayload("project_id"));
    expect(payload).toStrictEqual([
      {
        id: "subscription_1",
        owner_type: "project",
        regex_selectors: [{ type: "build-variant", data: "bv-name" }],
        resource_type: "TASK",
        selectors: [
          { type: "project", data: "project_id" },
          { type: "requester", data: "gitter_request" },
        ],
        subscriber: {
          target: "@fake.user",
          type: "slack",
          webhookSubscriber: undefined,
          jiraIssueSubscriber: undefined,
        },
        trigger: "first-failure-in-version",
        trigger_data: { requester: "gitter_request" },
      },
      {
        id: "subscription_2",
        owner_type: "project",
        regex_selectors: [],
        resource_type: "VERSION",
        selectors: [
          { type: "project", data: "project_id" },
          { type: "requester", data: "gitter_request" },
        ],
        subscriber: {
          target: "fake@fake.com",
          type: "email",
          webhookSubscriber: undefined,
          jiraIssueSubscriber: undefined,
        },
        trigger: "outcome",
        trigger_data: { requester: "gitter_request" },
      },
    ]);
  });

  it("should correctly format webhook subscription", () => {
    const payload = getGqlPayload("project_id")(webhookSubscriptionWithSecret);
    expect(payload).toStrictEqual({
      id: "webhook_subscription",
      owner_type: "project",
      regex_selectors: [],
      resource_type: "TASK",
      selectors: [
        { type: "project", data: "project_id" },
        { type: "requester", data: "gitter_request" },
      ],
      subscriber: {
        target: "https://fake-website.com",
        type: "evergreen-webhook",
        webhookSubscriber: {
          secret: "webhook_secret",
          url: "https://fake-website.com",
          retries: 0,
          minDelayMs: 0,
          timeoutMs: 0,
          headers: [],
        },
        jiraIssueSubscriber: undefined,
      },
      trigger: "outcome",
      trigger_data: { requester: "gitter_request" },
    });
  });

  it("should correctly format and generate a secret for webhook subscription", () => {
    jest
      .spyOn(utils, "generateWebhookSecret")
      .mockImplementationOnce(() => "my_generated_secret");

    const payload = getGqlPayload("project_id")(
      webhookSubscriptionWithoutSecret,
    );
    expect(payload).toStrictEqual({
      id: "webhook_subscription",
      owner_type: "project",
      regex_selectors: [],
      resource_type: "TASK",
      selectors: [
        { type: "project", data: "project_id" },
        { type: "requester", data: "gitter_request" },
      ],
      subscriber: {
        target: "https://fake-website.com",
        type: "evergreen-webhook",
        webhookSubscriber: {
          secret: "my_generated_secret",
          url: "https://fake-website.com",
          retries: 1,
          minDelayMs: 100,
          timeoutMs: 1000,
          headers: [],
        },
        jiraIssueSubscriber: undefined,
      },
      trigger: "outcome",
      trigger_data: { requester: "gitter_request" },
    });
  });

  it("should correctly format jira issue subscription", () => {
    const payload = getGqlPayload("project_id")(jiraIssueSubscription);
    expect(payload).toStrictEqual({
      id: "jira_issue_subscription",
      owner_type: "project",
      regex_selectors: [],
      resource_type: "TASK",
      selectors: [
        { type: "project", data: "project_id" },
        { type: "requester", data: "gitter_request" },
      ],
      subscriber: {
        target: "FAKEPROJECT",
        type: "jira-issue",
        webhookSubscriber: undefined,
        jiraIssueSubscriber: {
          project: "FAKEPROJECT",
          issueType: "Build Failure",
        },
      },
      trigger: "outcome",
      trigger_data: { requester: "gitter_request" },
    });
  });

  it("should correctly omit extra fields and regex selectors that don't exist for the specified trigger", () => {
    const payload = getGqlPayload("project_id")(omitFieldsSubscription);
    expect(payload).toStrictEqual({
      id: "omit_fields_subscription",
      owner_type: "project",
      regex_selectors: [],
      resource_type: "VERSION",
      selectors: [
        { type: "project", data: "project_id" },
        { type: "requester", data: "ad_hoc" },
      ],
      subscriber: {
        type: "email",
        target: "fake.user@mongodb.com",
        webhookSubscriber: undefined,
        jiraIssueSubscriber: undefined,
      },
      trigger: "failure",
      trigger_data: { requester: "ad_hoc" },
    });
  });
});

const multipleSubscriptions = [
  {
    subscriptionData: {
      id: "subscription_1",
      event: {
        extraFields: {
          requester: "gitter_request",
        },
        regexSelector: [
          {
            regexSelect: "build-variant",
            regexInput: "bv-name",
          },
        ],
        eventSelect: "first-failure-version",
      },
      notification: {
        notificationSelect: "slack",
        slackInput: "@fake.user",
      },
    },
  },
  {
    subscriptionData: {
      id: "subscription_2",
      event: {
        extraFields: {
          requester: "gitter_request",
        },
        eventSelect: "any-version-finishes",
      },
      notification: {
        notificationSelect: "email",
        emailInput: "fake@fake.com",
      },
    },
  },
];

const webhookSubscriptionWithSecret = {
  subscriptionData: {
    id: "webhook_subscription",
    event: {
      extraFields: {
        requester: "gitter_request",
      },
      eventSelect: "any-task-finishes",
    },
    notification: {
      webhookInput: {
        secretInput: "webhook_secret",
        urlInput: "https://fake-website.com",
        retryInput: undefined,
        minDelayInput: undefined,
        timeoutInput: undefined,
        httpHeaders: undefined,
      },
      notificationSelect: "evergreen-webhook",
    },
  },
};

const webhookSubscriptionWithoutSecret = {
  subscriptionData: {
    id: "webhook_subscription",
    event: {
      extraFields: {
        requester: "gitter_request",
      },
      eventSelect: "any-task-finishes",
    },
    notification: {
      webhookInput: {
        secretInput: "",
        urlInput: "https://fake-website.com",
        retryInput: 1,
        minDelayInput: 100,
        timeoutInput: 1000,
        httpHeaders: undefined,
      },
      notificationSelect: "evergreen-webhook",
    },
  },
};

const jiraIssueSubscription = {
  subscriptionData: {
    id: "jira_issue_subscription",
    event: {
      eventSelect: "any-task-finishes",
      extraFields: {
        requester: "gitter_request",
      },
      regexSelector: [],
    },
    notification: {
      notificationSelect: "jira-issue",
      jiraIssueInput: {
        projectInput: "FAKEPROJECT",
        issueInput: "Build Failure",
      },
    },
  },
};

const omitFieldsSubscription = {
  subscriptionData: {
    id: "omit_fields_subscription",
    event: {
      // Only the requester field is applicable to the "any-version-fails" event.
      extraFields: {
        "version-percent-change": "10",
        "version-duration-secs": "10",
        requester: "ad_hoc",
      },
      // Regex fields are not applicable to the "any-version-fails" event.
      regexSelector: [
        {
          regexSelect: "build-variant",
          regexInput: "bv_id",
        },
      ],
      eventSelect: "any-version-fails",
    },
    notification: {
      notificationSelect: "email",
      jiraCommentInput: "",
      slackInput: "@fake.user",
      emailInput: "fake.user@mongodb.com",
    },
  },
};
