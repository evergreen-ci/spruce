import {
  taskTriggers,
  versionTriggers,
  waterfallTriggers,
} from "constants/triggers";
import { getGqlPayload } from "./utils";

describe("getGqlPayload", () => {
  it("should correctly format the GQL payload for a personal task subscription", () => {
    const payload = getGqlPayload(
      "task",
      taskTriggers,
      "task_id",
      taskFormState
    );
    expect(payload).toStrictEqual({
      owner_type: "person",
      regex_selectors: [],
      resource_type: "TASK",
      selectors: [
        { data: "task", type: "object" },
        { data: "task_id", type: "id" },
      ],
      subscriber: {
        target: "@fake.user",
        type: "slack",
      },
      trigger: "exceeds-duration",
      trigger_data: { "task-duration-secs": "10" },
    });
  });

  it("should correctly format the GQL payload for a personal version subscription", () => {
    const payload = getGqlPayload(
      "version",
      versionTriggers,
      "version_id",
      versionFormState
    );
    expect(payload).toStrictEqual({
      owner_type: "person",
      regex_selectors: [],
      resource_type: "VERSION",
      selectors: [
        { data: "version", type: "object" },
        { data: "version_id", type: "id" },
      ],
      subscriber: {
        target: "fake.user@mongodb.com",
        type: "email",
      },
      trigger: "runtime-change",
      trigger_data: { "version-percent-change": "10" },
    });
  });

  it("should correctly format the GQL payload for a personal project subscription", () => {
    const payload = getGqlPayload(
      "project",
      waterfallTriggers,
      "project_id",
      projectFormState
    );
    expect(payload).toStrictEqual({
      owner_type: "person",
      regex_selectors: [
        {
          data: "bv_id",
          type: "build-variant",
        },
        {
          data: "bv_name",
          type: "display-name",
        },
      ],
      resource_type: "BUILD",
      selectors: [
        { data: "project_id", type: "project" },
        { data: "gitter_request", type: "requester" },
      ],
      subscriber: {
        target: "FAKE-123",
        type: "jira-comment",
      },
      trigger: "outcome",
      trigger_data: { requester: "gitter_request" },
    });
  });

  it("should correctly omit extra fields and regex selectors that don't exist for the specified trigger", () => {
    const payload = getGqlPayload(
      "version",
      versionTriggers,
      "version_id",
      omitFieldsFormState
    );
    expect(payload).toStrictEqual({
      owner_type: "person",
      regex_selectors: [],
      resource_type: "VERSION",
      selectors: [
        { data: "version", type: "object" },
        { data: "version_id", type: "id" },
      ],
      subscriber: {
        target: "fake.user@mongodb.com",
        type: "email",
      },
      trigger: "family-outcome",
      trigger_data: {},
    });
  });
});

const taskFormState = {
  event: {
    eventSelect: "task-exceeds-duration",
    extraFields: {
      "task-duration-secs": "10",
    },
    regexSelector: [],
  },
  notification: {
    emailInput: "fake.user@mongodb.com",
    jiraCommentInput: "",
    notificationSelect: "slack",
    slackInput: "@fake.user",
  },
};

const versionFormState = {
  event: {
    eventSelect: "version-runtime-change",
    extraFields: {
      "version-percent-change": "10",
    },
    regexSelector: [],
  },
  notification: {
    emailInput: "fake.user@mongodb.com",
    jiraCommentInput: "",
    notificationSelect: "email",
    slackInput: "@fake.user",
  },
};

const projectFormState = {
  event: {
    eventSelect: "any-build-finishes",
    extraFields: {
      requester: "gitter_request",
    },
    regexSelector: [
      {
        regexInput: "bv_id",
        regexSelect: "build-variant",
      },
      {
        regexInput: "bv_name",
        regexSelect: "display-name",
      },
    ],
  },
  notification: {
    emailInput: "",
    jiraCommentInput: "FAKE-123",
    notificationSelect: "jira-comment",
    slackInput: "",
  },
};

const omitFieldsFormState = {
  event: {
    // Neither of these extra fields are applicable to the "version-finishes" event.
    extraFields: {
      "version-duration-secs": "10",
      "version-percent-change": "10",
    },

    eventSelect: "version-finishes",
    // Regex fields are not applicable to the "version-finishes" event.
    regexSelector: [
      {
        regexInput: "bv_id",
        regexSelect: "build-variant",
      },
    ],
  },
  notification: {
    emailInput: "fake.user@mongodb.com",
    jiraCommentInput: "",
    notificationSelect: "email",
    slackInput: "@fake.user",
  },
};
