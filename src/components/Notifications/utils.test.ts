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
        { type: "object", data: "task" },
        { type: "id", data: "task_id" },
      ],
      subscriber: {
        type: "slack",
        target: "@fake.user",
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
        { type: "object", data: "version" },
        { type: "id", data: "version_id" },
      ],
      subscriber: {
        type: "email",
        target: "fake.user@mongodb.com",
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
          type: "build-variant",
          data: "bv_id",
        },
        {
          type: "display-name",
          data: "bv_name",
        },
      ],
      resource_type: "BUILD",
      selectors: [
        { type: "project", data: "project_id" },
        { type: "requester", data: "gitter_request" },
      ],
      subscriber: {
        type: "jira-comment",
        target: "FAKE-123",
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
        { type: "object", data: "version" },
        { type: "id", data: "version_id" },
      ],
      subscriber: {
        type: "email",
        target: "fake.user@mongodb.com",
      },
      trigger: "outcome",
      trigger_data: {},
    });
  });
});

const taskFormState = {
  event: {
    extraFields: {
      "task-duration-secs": "10",
    },
    eventSelect: "task-exceeds-duration",
    regexSelector: [],
  },
  notification: {
    notificationSelect: "slack",
    jiraCommentInput: "",
    slackInput: "@fake.user",
    emailInput: "fake.user@mongodb.com",
  },
};

const versionFormState = {
  event: {
    extraFields: {
      "version-percent-change": "10",
    },
    regexSelector: [],
    eventSelect: "version-runtime-change",
  },
  notification: {
    notificationSelect: "email",
    jiraCommentInput: "",
    slackInput: "@fake.user",
    emailInput: "fake.user@mongodb.com",
  },
};

const projectFormState = {
  event: {
    extraFields: {
      requester: "gitter_request",
    },
    regexSelector: [
      {
        regexSelect: "build-variant",
        regexInput: "bv_id",
      },
      {
        regexSelect: "display-name",
        regexInput: "bv_name",
      },
    ],
    eventSelect: "any-build-finishes",
  },
  notification: {
    notificationSelect: "jira-comment",
    jiraCommentInput: "FAKE-123",
    slackInput: "",
    emailInput: "",
  },
};

const omitFieldsFormState = {
  event: {
    // Neither of these extra fields are applicable to the "version-finishes" event.
    extraFields: {
      "version-percent-change": "10",
      "version-duration-secs": "10",
    },
    // Regex fields are not applicable to the "version-finishes" event.
    regexSelector: [
      {
        regexSelect: "build-variant",
        regexInput: "bv_id",
      },
    ],
    eventSelect: "version-finishes",
  },
  notification: {
    notificationSelect: "email",
    jiraCommentInput: "",
    slackInput: "@fake.user",
    emailInput: "fake.user@mongodb.com",
  },
};
