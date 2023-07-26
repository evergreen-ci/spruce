import { getGqlPayload } from "./getGqlPayload";
import * as utils from "./utils";

describe("getGqlPayload", () => {
  it("should correctly format multiple subscriptions", () => {
    const payload = multipleSubscriptions.map(getGqlPayload("project_id"));
    expect(payload).toStrictEqual([
      {
        id: "subscription_1",
        owner_type: "project",
        regex_selectors: [{ data: "bv-name", type: "build-variant" }],
        resource_type: "TASK",
        selectors: [
          { data: "project_id", type: "project" },
          { data: "gitter_request", type: "requester" },
        ],
        subscriber: {
          jiraIssueSubscriber: undefined,
          target: "@fake.user",
          type: "slack",
          webhookSubscriber: undefined,
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
          { data: "project_id", type: "project" },
          { data: "gitter_request", type: "requester" },
        ],
        subscriber: {
          jiraIssueSubscriber: undefined,
          target: "fake@fake.com",
          type: "email",
          webhookSubscriber: undefined,
        },
        trigger: "family-outcome",
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
        { data: "project_id", type: "project" },
        { data: "gitter_request", type: "requester" },
      ],
      subscriber: {
        jiraIssueSubscriber: undefined,
        target: "https://fake-website.com",
        type: "evergreen-webhook",
        webhookSubscriber: {
          headers: [],
          minDelayMs: 0,
          retries: 0,
          secret: "webhook_secret",
          timeoutMs: 0,
          url: "https://fake-website.com",
        },
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
      webhookSubscriptionWithoutSecret
    );
    expect(payload).toStrictEqual({
      id: "webhook_subscription",
      owner_type: "project",
      regex_selectors: [],
      resource_type: "TASK",
      selectors: [
        { data: "project_id", type: "project" },
        { data: "gitter_request", type: "requester" },
      ],
      subscriber: {
        jiraIssueSubscriber: undefined,
        target: "https://fake-website.com",
        type: "evergreen-webhook",
        webhookSubscriber: {
          headers: [],
          minDelayMs: 100,
          retries: 1,
          secret: "my_generated_secret",
          timeoutMs: 1000,
          url: "https://fake-website.com",
        },
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
        { data: "project_id", type: "project" },
        { data: "gitter_request", type: "requester" },
      ],
      subscriber: {
        jiraIssueSubscriber: {
          issueType: "Build Failure",
          project: "FAKEPROJECT",
        },
        target: "FAKEPROJECT",
        type: "jira-issue",
        webhookSubscriber: undefined,
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
        { data: "project_id", type: "project" },
        { data: "ad_hoc", type: "requester" },
      ],
      subscriber: {
        jiraIssueSubscriber: undefined,
        target: "fake.user@mongodb.com",
        type: "email",
        webhookSubscriber: undefined,
      },
      trigger: "family-failure",
      trigger_data: { requester: "ad_hoc" },
    });
  });
});

const multipleSubscriptions = [
  {
    subscriptionData: {
      event: {
        eventSelect: "first-failure-version",
        extraFields: {
          requester: "gitter_request",
        },
        regexSelector: [
          {
            regexInput: "bv-name",
            regexSelect: "build-variant",
          },
        ],
      },
      id: "subscription_1",
      notification: {
        notificationSelect: "slack",
        slackInput: "@fake.user",
      },
    },
  },
  {
    subscriptionData: {
      event: {
        eventSelect: "any-version-finishes",
        extraFields: {
          requester: "gitter_request",
        },
      },
      id: "subscription_2",
      notification: {
        emailInput: "fake@fake.com",
        notificationSelect: "email",
      },
    },
  },
];

const webhookSubscriptionWithSecret = {
  subscriptionData: {
    event: {
      eventSelect: "any-task-finishes",
      extraFields: {
        requester: "gitter_request",
      },
    },
    id: "webhook_subscription",
    notification: {
      notificationSelect: "evergreen-webhook",
      webhookInput: {
        httpHeaders: undefined,
        minDelayInput: undefined,
        retryInput: undefined,
        secretInput: "webhook_secret",
        timeoutInput: undefined,
        urlInput: "https://fake-website.com",
      },
    },
  },
};

const webhookSubscriptionWithoutSecret = {
  subscriptionData: {
    event: {
      eventSelect: "any-task-finishes",
      extraFields: {
        requester: "gitter_request",
      },
    },
    id: "webhook_subscription",
    notification: {
      notificationSelect: "evergreen-webhook",
      webhookInput: {
        httpHeaders: undefined,
        minDelayInput: 100,
        retryInput: 1,
        secretInput: "",
        timeoutInput: 1000,
        urlInput: "https://fake-website.com",
      },
    },
  },
};

const jiraIssueSubscription = {
  subscriptionData: {
    event: {
      eventSelect: "any-task-finishes",
      extraFields: {
        requester: "gitter_request",
      },
      regexSelector: [],
    },
    id: "jira_issue_subscription",
    notification: {
      jiraIssueInput: {
        issueInput: "Build Failure",
        projectInput: "FAKEPROJECT",
      },
      notificationSelect: "jira-issue",
    },
  },
};

const omitFieldsSubscription = {
  subscriptionData: {
    event: {
      // Only the requester field is applicable to the "any-version-fails" event.
      extraFields: {
        requester: "ad_hoc",
        "version-duration-secs": "10",
        "version-percent-change": "10",
      },

      eventSelect: "any-version-fails",
      // Regex fields are not applicable to the "any-version-fails" event.
      regexSelector: [
        {
          regexInput: "bv_id",
          regexSelect: "build-variant",
        },
      ],
    },
    id: "omit_fields_subscription",
    notification: {
      emailInput: "fake.user@mongodb.com",
      jiraCommentInput: "",
      notificationSelect: "email",
      slackInput: "@fake.user",
    },
  },
};
